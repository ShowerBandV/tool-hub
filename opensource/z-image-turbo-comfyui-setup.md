# Z-Image-Turbo ComfyUI 搭建指南

> 在国内网络环境下，从零开始将 Z-Image-Turbo 模型下载、转换并配置到 ComfyUI 的完整流程。

---

## 目录

1. [背景](#1-背景)
2. [方案对比](#2-方案对比)
3. [最终方案：魔搭下载 + 格式转换](#3-最终方案魔搭下载--格式转换)
4. [ComfyUI 配置](#4-comfyui-配置)
5. [使用说明](#5-使用说明)
6. [常见问题](#6-常见问题)

---

## 1. 背景

**Z-Image-Turbo** 是通义实验室（Tongyi-MAI）推出的高效图像生成模型，采用单流 Diffusion Transformer（DiT）架构，6B 参数，仅需 **8 步推理**即可生成高质量图片，可在 16G 显存设备上运行。

模型有两个来源：

| 来源 | 地址 | 格式 | 说明 |
|------|------|------|------|
| **官方原版** | [Tongyi-MAI/Z-Image-Turbo](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo) | Diffusers 格式 | 需要转换才能在 ComfyUI 使用 |
| **ComfyUI 预制版** | [Comfy-Org/z_image_turbo](https://huggingface.co/Comfy-Org/z_image_turbo) | ComfyUI 原生格式 | 开箱即用，但国内下载困难 |

---

## 2. 方案对比

### 方案 A：从 HuggingFace 直连下载 ❌ 不可行

```bash
pip install -U huggingface_hub
export HF_ENDPOINT=https://hf-mirror.com
huggingface-cli download Comfy-Org/z_image_turbo --local-dir ./z_image_turbo
```

**结果**：国内网络无法连接 huggingface.co，即使使用 hf-mirror.com，其 CDN（CloudFront/Xet Bridge）对大文件频繁超时，10 个文件中有 7 个反复断连，无法完成下载。

### 方案 B：从魔搭 ModelScope 下载 ✅ 可行

```bash
pip install modelscope
modelscope download --model Tongyi-MAI/Z-Image-Turbo --local_dir ./z_image_turbo
```

**结果**：魔搭国内镜像稳定，约 12 分钟下载完 26 GB（32 个文件），全程无断连。

### 结论

| 维度 | HuggingFace 直连 | hf-mirror | 魔搭 ModelScope |
|------|:-:|:-:|:-:|
| 连通性 | ❌ 被墙 | ⚠️ 镜像可达但 CDN 超时 | ✅ 稳定 |
| 大文件支持 | ❌ | ⚠️ 频繁断连 | ✅ 支持断点续传 |
| 下载速度 | — | 5~15 MB/s（不稳定） | 8~15 MB/s（稳定） |
| 格式 | ComfyUI 原生 | ComfyUI 原生 | Diffusers 格式需转换 |

---

## 3. 最终方案：魔搭下载 + 格式转换

### 3.1 安装依赖

```bash
pip install modelscope safetensors
```

### 3.2 下载模型

```bash
modelscope download --model Tongyi-MAI/Z-Image-Turbo --local_dir ./z_image_turbo
```

下载的文件结构：

```
z_image_turbo/
├── transformer/              ← 3 个分片（主模型，共 ~22.8 GB）
│   ├── diffusion_pytorch_model-00001-of-00003.safetensors  (9.29 GB)
│   ├── diffusion_pytorch_model-00002-of-00003.safetensors  (9.29 GB)
│   └── diffusion_pytorch_model-00003-of-00003.safetensors  (4.35 GB)
├── text_encoder/             ← 3 个分片（文本编码器，共 ~7.4 GB）
│   ├── model-00001-of-00003.safetensors  (3.69 GB)
│   ├── model-00002-of-00003.safetensors  (3.71 GB)
│   └── model-00003-of-00003.safetensors  (95 MB)
├── vae/                     ← VAE（即 Flux VAE，160 MB）
│   └── diffusion_pytorch_model.safetensors
├── tokenizer/               ← 分词器
└── z_image_convert_original_to_comfy.py  ← 官方转换脚本
```

### 3.3 转换主模型 → ComfyUI 格式

使用项目自带的转换脚本，将 diffusers 格式的 key 命名转换为 ComfyUI 认识的形式：

```bash
python z_image_convert_original_to_comfy.py \
  z_image_turbo_bf16.safetensors \
  transformer/diffusion_pytorch_model-00001-of-00003.safetensors \
  transformer/diffusion_pytorch_model-00002-of-00003.safetensors \
  transformer/diffusion_pytorch_model-00003-of-00003.safetensors
```

脚本做了三件事：

1. **合并分片**：将 3 个 shard 合成一个 12.3 GB 的完整模型
2. **重命名 key**：
   - `all_final_layer.2-1.` → `final_layer.`
   - `all_x_embedder.2-1.` → `x_embedder.`
   - `.attention.to_out.0.bias` → `.attention.out.bias`
   - `.attention.norm_k.weight` → `.attention.k_norm.weight`
   - `.attention.norm_q.weight` → `.attention.q_norm.weight`
   - `.attention.to_out.0.weight` → `.attention.out.weight`
3. **合并 QKV**：将分开的 Q/K/V 权重合并为 QKV 格式

输出文件：`z_image_turbo_bf16.safetensors`（约 12.3 GB）

### 3.4 合并文本编码器

ComfyUI 要求文本编码器为单文件 `qwen_3_4b.safetensors`，而魔搭版是 3 个分片。用 Python 合并：

```python
import safetensors.torch as st

shards = [
    'z_image_turbo/text_encoder/model-00001-of-00003.safetensors',
    'z_image_turbo/text_encoder/model-00002-of-00003.safetensors',
    'z_image_turbo/text_encoder/model-00003-of-00003.safetensors',
]

out = {}
for f in shards:
    sd = st.load_file(f)
    out.update(sd)

st.save_file(out, 'qwen_3_4b.safetensors')
```

输出文件：`qwen_3_4b.safetensors`（约 8.04 GB，398 个 key）

### 3.5 处理 VAE

魔搭的 VAE 配置显示 `"_name_or_path": "flux-dev"`，即它就是 **Flux VAE**。ComfyUI 的 Z-Image 加载器期望文件名是 `ae.safetensors`，直接重命名即可：

```bash
mv diffusion_pytorch_model.safetensors ae.safetensors
```

---

## 4. ComfyUI 配置

### 4.1 复制文件到 ComfyUI 目录

| 文件 | 源路径 | 目标路径 |
|------|--------|----------|
| 主模型 | `z_image_turbo/z_image_turbo_bf16.safetensors` | `ComfyUI/models/diffusion_models/` |
| 文本编码器 | `qwen_3_4b.safetensors`（合并后） | `ComfyUI/models/text_encoders/` |
| VAE | `z_image_turbo/vae/ae.safetensors`（已重命名） | `ComfyUI/models/vae/` |

### 4.2 最终目录结构

```
ComfyUI/models/
├── diffusion_models/
│   └── z_image_turbo_bf16.safetensors    (12.3 GB)
├── text_encoders/
│   └── qwen_3_4b.safetensors             (8.04 GB)
└── vae/
    └── ae.safetensors                     (160 MB)
```

> 注意：主模型**不是**放在 `checkpoints/`，而是放在 `diffusion_models/`。这是 ComfyUI 新版对不同架构模型的区分目录。

### 4.3 注意事项

- ComfyUI **已内置** Z-Image 支持（`comfy/supported_models.py` 中有 `ZImage` 和 `ZImagePixelSpace` 类），无需额外安装自定义节点
- 分词器 `qwen25_tokenizer/` 已内置于 ComfyUI 的 `comfy/text_encoders/` 中，无需额外下载
- 模型的 Node 节点 `TextEncodeZImageOmni` 已内置在 `comfy_extras/nodes_zimage.py` 中

---

## 5. 使用说明

### 5.1 基本设置

重启 ComfyUI 后：

- **加载模型**：使用 `Load Diffusion Model` 节点（或拖入官方工作流图片自动加载）
- **采样器**：推荐 `DPM++ 2M` 或 `DDIM`
- **步数**：**8 步**（蒸馏模型，不需要多步）
- **CFG**：**1.0**（蒸馏模型不使用 CFG）
- **VAE**：选择 `ae.safetensors`

### 5.2 工作流

官方工作流示例：
[ComfyUI Z-Image Examples](https://comfyanonymous.github.io/ComfyUI_examples/z_image/)

### 5.3 注意事项

- Z-Image-Turbo 是 **8 步蒸馏**模型，不要用 20+ 步数，不会提升质量
- 模型不支持 CFG，设 `cfg=1.0`
- 显存建议 ≥ 16 GB
- 支持 1024×1024 分辨率生成

---

## 6. 常见问题

### Q：ComfyUI 报"缺少模型"

**原因**：模型文件放在了 `checkpoints/` 目录，但 Z-Image 的 DiT 架构模型需要放在 `diffusion_models/`。

**解决**：移动到 `ComfyUI/models/diffusion_models/` 即可。

### Q：下载到一半断了怎么办？

**魔搭**天然支持断点续传，重新执行同样的命令会自动续传。

### Q：hf-mirror 一直超时

hf-mirror 的 CDN（CloudFront/Xet Bridge）对国内大文件传输不稳定。建议改用魔搭。

### Q：VAE 用哪个？

使用模型自带的 VAE（即 Flux VAE），重命名为 `ae.safetensors` 放入 `ComfyUI/models/vae/` 即可。

---

## 附录：完整命令速查

```bash
# 1. 安装依赖
pip install modelscope safetensors

# 2. 从魔搭下载模型
modelscope download --model Tongyi-MAI/Z-Image-Turbo --local_dir ./z_image_turbo

# 3. 转换主模型
cd z_image_turbo
python z_image_convert_original_to_comfy.py z_image_turbo_bf16.safetensors \
  transformer/diffusion_pytorch_model-00001-of-00003.safetensors \
  transformer/diffusion_pytorch_model-00002-of-00003.safetensors \
  transformer/diffusion_pytorch_model-00003-of-00003.safetensors

# 4. 合并文本编码器
python -c "
import safetensors.torch as st
shards = ['text_encoder/model-00001-of-00003.safetensors',
          'text_encoder/model-00002-of-00003.safetensors',
          'text_encoder/model-00003-of-00003.safetensors']
out = {}
for f in shards:
    out.update(st.load_file(f))
st.save_file(out, '../qwen_3_4b.safetensors')
"

# 5. 重命名 VAE
mv vae/diffusion_pytorch_model.safetensors ../ae.safetensors

# 6. 复制到 ComfyUI
cp z_image_turbo_bf16.safetensors /path/to/ComfyUI/models/diffusion_models/
cp qwen_3_4b.safetensors /path/to/ComfyUI/models/text_encoders/
cp ae.safetensors /path/to/ComfyUI/models/vae/
```

---

> **编写日期**：2026-06-09  
> **模型版本**：Z-Image-Turbo (6B, 8-step distilled)  
> **ComfyUI 版本**：内置 ZImage 支持  
> **测试环境**：Windows 11, Python 3.11, 国内网络环境
