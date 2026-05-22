<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>开发者工具箱 - 实用工具集合</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Noto+Serif+SC:wght@400;700&family=ZCOOL+XiaoWei&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=Liu+Jian+Mao+Cao&family=Long+Cang&family=ZCOOL+KuaiLe&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #1a1d23;
            --sidebar-bg: #15171c;
            --card-bg: #1e2129;
            --card-border: #2a2d35;
            --text: #e0e0e0;
            --text-secondary: #a0a4b0;
            --accent: #6c8cff;
            --accent-hover: #8ba3ff;
            --accent-glow: rgba(108, 140, 255, 0.25);
            --danger: #ff6b7a;
            --success: #5cdb8b;
            --warning: #ffb347;
            --input-bg: #252830;
            --input-border: #33363f;
            --radius: 12px;
            --radius-sm: 8px;
            --shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
            --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--bg);
            color: var(--text);
            display: flex;
            height: 100vh;
            overflow: hidden;
            user-select: none;
        }

        /* ========== 侧边栏 ========== */
        .sidebar {
            width: 220px;
            min-width: 220px;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--card-border);
            display: flex;
            flex-direction: column;
            z-index: 10;
            overflow-y: auto;
            padding: 8px 0;
            transition: transform var(--transition);
        }
        .sidebar-header {
            padding: 20px 20px 16px;
            border-bottom: 1px solid var(--card-border);
            margin-bottom: 4px;
            flex-shrink: 0;
        }
        .sidebar-header .logo {
            font-size: 1.3em;
            font-weight: 700;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #6c8cff, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .sidebar-header .subtitle {
            font-size: 0.75em;
            color: var(--text-secondary);
            margin-top: 2px;
        }
        .nav-list {
            list-style: none;
            flex: 1;
            padding: 0 10px;
        }
        .nav-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px 14px;
            margin: 2px 0;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--transition);
            font-size: 0.9em;
            color: var(--text-secondary);
            position: relative;
            font-weight: 400;
        }
        .nav-item:hover {
            background: #252830;
            color: #d0d4e0;
        }
        .nav-item.active {
            background: var(--accent);
            color: #fff;
            font-weight: 500;
            box-shadow: 0 4px 15px var(--accent-glow);
        }
        .nav-icon {
            font-size: 1.2em;
            width: 26px;
            text-align: center;
            flex-shrink: 0;
        }
        .sidebar-footer {
            padding: 12px 20px;
            border-top: 1px solid var(--card-border);
            font-size: 0.7em;
            color: var(--text-secondary);
            flex-shrink: 0;
            text-align: center;
        }

        /* ========== 主内容区 ========== */
        .main-content {
            flex: 1;
            overflow-y: auto;
            padding: 28px 32px;
            display: flex;
            flex-direction: column;
            gap: 0;
        }
        .tool-panel {
            display: none;
            flex-direction: column;
            gap: 20px;
            animation: fadeSlideIn 0.35s ease;
        }
        .tool-panel.active {
            display: flex;
        }
        @keyframes fadeSlideIn {
            from {
                opacity: 0;
                transform: translateY(14px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .tool-header {
            margin-bottom: 4px;
        }
        .tool-header h2 {
            font-size: 1.6em;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .tool-header p {
            color: var(--text-secondary);
            font-size: 0.85em;
            margin-top: 4px;
        }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: var(--radius);
            padding: 22px 24px;
            box-shadow: var(--shadow);
            transition: all var(--transition);
        }
        .card-row {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .card-row>* {
            flex: 1;
            min-width: 200px;
        }
        label {
            display: block;
            font-size: 0.8em;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 6px;
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }
        input[type="text"],
        input[type="number"],
        input[type="url"],
        textarea,
        select {
            width: 100%;
            padding: 10px 14px;
            background: var(--input-bg);
            border: 1px solid var(--input-border);
            border-radius: var(--radius-sm);
            color: var(--text);
            font-size: 0.9em;
            font-family: 'Noto Sans SC', 'Consolas', 'Monaco', monospace;
            transition: border var(--transition);
            outline: none;
        }
        input:focus,
        textarea:focus,
        select:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px var(--accent-glow);
        }
        textarea {
            resize: vertical;
            min-height: 100px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.85em;
            line-height: 1.5;
        }
        select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a0a4b0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 36px;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-weight: 500;
            font-size: 0.9em;
            transition: all var(--transition);
            font-family: inherit;
            letter-spacing: 0.3px;
        }
        .btn-primary {
            background: var(--accent);
            color: #fff;
            box-shadow: 0 4px 14px var(--accent-glow);
        }
        .btn-primary:hover {
            background: var(--accent-hover);
            box-shadow: 0 6px 20px rgba(108, 140, 255, 0.4);
            transform: translateY(-1px);
        }
        .btn-primary:active {
            transform: scale(0.97);
        }
        .btn-outline {
            background: transparent;
            border: 1px solid var(--input-border);
            color: var(--text);
        }
        .btn-outline:hover {
            border-color: var(--accent);
            color: var(--accent);
        }
        .btn-sm {
            padding: 6px 14px;
            font-size: 0.78em;
            border-radius: 6px;
        }
        .btn-xs {
            padding: 4px 10px;
            font-size: 0.7em;
            border-radius: 5px;
        }
        .btn-danger {
            background: var(--danger);
            color: #fff;
        }
        .btn-success {
            background: var(--success);
            color: #1a1d23;
        }
        .result-area {
            background: #1a1c22;
            border: 1px solid var(--input-border);
            border-radius: var(--radius-sm);
            padding: 16px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.85em;
            line-height: 1.6;
            min-height: 60px;
            white-space: pre-wrap;
            word-break: break-all;
            color: #c8ccd6;
            max-height: 400px;
            overflow-y: auto;
        }
        .tag {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.75em;
            font-weight: 500;
            margin: 2px 4px;
        }
        .tag-accent {
            background: var(--accent-glow);
            color: var(--accent);
        }
        .tag-success {
            background: rgba(92, 219, 139, 0.2);
            color: var(--success);
        }
        .tag-warning {
            background: rgba(255, 179, 71, 0.2);
            color: var(--warning);
        }
        .tag-danger {
            background: rgba(255, 107, 122, 0.2);
            color: var(--danger);
        }
        .flex-center {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .mt-2 {
            margin-top: 12px;
        }
        .mt-3 {
            margin-top: 18px;
        }
        .mb-2 {
            margin-bottom: 12px;
        }
        .text-sm {
            font-size: 0.8em;
            color: var(--text-secondary);
        }
        .text-center {
            text-align: center;
        }

        /* 色标点 */
        .color-stop-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
            flex-wrap: wrap;
        }
        .color-stop-row input[type="color"] {
            width: 40px;
            height: 34px;
            border: 2px solid var(--input-border);
            border-radius: 6px;
            cursor: pointer;
            background: transparent;
            padding: 2px;
        }
        .color-stop-row input[type="range"] {
            flex: 1;
            min-width: 80px;
        }
        .gradient-preview {
            width: 100%;
            height: 140px;
            border-radius: var(--radius-sm);
            border: 2px dashed var(--input-border);
            transition: all 0.3s;
        }

        /* 骰子3D */
        .dice-scene {
            perspective: 600px;
            width: 120px;
            height: 120px;
            margin: 0 auto;
        }
        .dice-cube {
            width: 100px;
            height: 100px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.1, 1);
            margin: 10px auto;
        }
        .dice-cube.rolling {
            animation: diceRoll 0.7s ease-out;
        }
        @keyframes diceRoll {
            0% {
                transform: rotateX(0) rotateY(0) rotateZ(0);
            }
            30% {
                transform: rotateX(520deg) rotateY(380deg) rotateZ(200deg);
            }
            60% {
                transform: rotateX(800deg) rotateY(640deg) rotateZ(400deg);
            }
            85% {
                transform: rotateX(940deg) rotateY(780deg) rotateZ(500deg);
            }
            100% {
                transform: rotateX(900deg) rotateY(720deg) rotateZ(480deg);
            }
        }
        .dice-face {
            position: absolute;
            width: 100px;
            height: 100px;
            background: #fff;
            border: 3px solid #333;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: 900;
            color: #222;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.08);
        }
        .dice-face.front {
            transform: translateZ(50px);
        }
        .dice-face.back {
            transform: rotateY(180deg) translateZ(50px);
        }
        .dice-face.right {
            transform: rotateY(90deg) translateZ(50px);
        }
        .dice-face.left {
            transform: rotateY(-90deg) translateZ(50px);
        }
        .dice-face.top {
            transform: rotateX(90deg) translateZ(50px);
        }
        .dice-face.bottom {
            transform: rotateX(-90deg) translateZ(50px);
        }

        /* 艺术字预览 */
        .art-text-preview {
            padding: 30px;
            text-align: center;
            min-height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            background: #1a1c22;
            overflow: hidden;
            word-break: break-all;
        }

        /* 响应式 */
        @media (max-width: 768px) {
            body {
                flex-direction: column;
            }
            .sidebar {
                width: 100%;
                min-width: 100%;
                flex-direction: row;
                overflow-x: auto;
                padding: 8px 6px;
                flex-shrink: 0;
                border-right: none;
                border-bottom: 1px solid var(--card-border);
                gap: 2px;
            }
            .sidebar-header,
            .sidebar-footer {
                display: none;
            }
            .nav-list {
                display: flex;
                flex-direction: row;
                gap: 2px;
                padding: 0;
            }
            .nav-item {
                white-space: nowrap;
                padding: 8px 12px;
                font-size: 0.78em;
                gap: 5px;
                flex-shrink: 0;
                border-radius: 20px;
            }
            .nav-icon {
                font-size: 1em;
                width: auto;
            }
            .main-content {
                padding: 16px;
                overflow-y: auto;
            }
            .card-row {
                flex-direction: column;
            }
            .dice-scene {
                width: 90px;
                height: 90px;
            }
            .dice-cube {
                width: 70px;
                height: 70px;
            }
            .dice-face {
                width: 70px;
                height: 70px;
                font-size: 28px;
                border-radius: 10px;
            }
            .dice-face.front {
                transform: translateZ(35px);
            }
            .dice-face.back {
                transform: rotateY(180deg) translateZ(35px);
            }
            .dice-face.right {
                transform: rotateY(90deg) translateZ(35px);
            }
            .dice-face.left {
                transform: rotateY(-90deg) translateZ(35px);
            }
            .dice-face.top {
                transform: rotateX(90deg) translateZ(35px);
            }
            .dice-face.bottom {
                transform: rotateX(-90deg) translateZ(35px);
            }
        }
    </style>
</head>
<body>

    <!-- ==================== 侧边栏 ==================== -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="logo">🛠️ 开发者工具箱</div>
            <div class="subtitle">实用工具集合</div>
        </div>
        <ul class="nav-list">
            <li class="nav-item active" data-tool="random-data">
                <span class="nav-icon">🎲</span>随机数据生成
            </li>
            <li class="nav-item" data-tool="api-test">
                <span class="nav-icon">⚡</span>API响应测试
            </li>
            <li class="nav-item" data-tool="sql-format">
                <span class="nav-icon">📝</span>SQL格式化
            </li>
            <li class="nav-item" data-tool="font-preview">
                <span class="nav-icon">🔤</span>字体预览
            </li>
            <li class="nav-item" data-tool="gradient">
                <span class="nav-icon">🌈</span>渐变生成器
            </li>
            <li class="nav-item" data-tool="art-text">
                <span class="nav-icon">✨</span>艺术字生成器
            </li>
            <li class="nav-item" data-tool="bmi">
                <span class="nav-icon">⚖️</span>BMI计算器
            </li>
            <li class="nav-item" data-tool="dice-lottery">
                <span class="nav-icon">🎯</span>骰子/抽签
            </li>
        </ul>
        <div class="sidebar-footer">v1.0 · 纯前端工具集</div>
    </aside>

    <!-- ==================== 主内容区 ==================== -->
    <main class="main-content" id="mainContent">

        <!-- 1. 随机测试数据生成 -->
        <div class="tool-panel active" id="tool-random-data">
            <div class="tool-header">
                <h2>🎲 随机测试数据生成</h2>
                <p>快速生成中文姓名、手机号等测试数据</p>
            </div>
            <div class="card">
                <div class="card-row">
                    <div style="flex:1;min-width:180px;">
                        <label>生成数量</label>
                        <input type="number" id="rd-count" value="10" min="1" max="100" style="width:100%;">
                    </div>
                    <div style="flex:1;min-width:180px;">
                        <label>数据类型</label>
                        <select id="rd-type">
                            <option value="both">姓名 + 手机号</option>
                            <option value="name">仅姓名</option>
                            <option value="phone">仅手机号</option>
                        </select>
                    </div>
                    <div style="display:flex;align-items:flex-end;gap:8px;flex:1;min-width:140px;">
                        <button class="btn-primary" onclick="generateRandomData()" style="width:100%;">🎲 生成数据</button>
                    </div>
                </div>
                <div class="mt-2">
                    <div class="flex-center mb-2">
                        <span class="text-sm">生成结果：</span>
                        <button class="btn-outline btn-xs" onclick="copyResult('rd-result')">📋 复制全部</button>
                        <button class="btn-outline btn-xs" onclick="exportCSV()">📥 导出CSV</button>
                    </div>
                    <div class="result-area" id="rd-result">点击"生成数据"按钮开始生成...</div>
                </div>
            </div>
        </div>

        <!-- 2. API响应时间测试 -->
        <div class="tool-panel" id="tool-api-test">
            <div class="tool-header">
                <h2>⚡ API响应时间测试</h2>
                <p>测试任意API端点的响应时间（支持CORS的API可直接测试）</p>
            </div>
            <div class="card">
                <div class="flex-center mb-2" style="gap:10px;">
                    <input type="url" id="api-url" value="https://api.github.com" placeholder="输入API URL..." style="flex:1;">
                    <select id="api-method" style="width:100px;">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                    </select>
                    <button class="btn-primary" onclick="testAPI()">🚀 发送请求</button>
                </div>
                <div class="flex-center mb-2" style="gap:6px;">
                    <span class="text-sm">快捷测试：</span>
                    <button class="btn-outline btn-xs" onclick="document.getElementById('api-url').value='https://api.github.com';testAPI();">GitHub API</button>
                    <button class="btn-outline btn-xs" onclick="document.getElementById('api-url').value='https://httpbin.org/get';testAPI();">httpbin</button>
                    <button class="btn-outline btn-xs" onclick="document.getElementById('api-url').value='https://jsonplaceholder.typicode.com/posts/1';testAPI();">JSONPlaceholder</button>
                </div>
                <div class="result-area" id="api-result">等待测试...</div>
                <div id="api-timing" class="mt-2 flex-center" style="gap:12px;"></div>
            </div>
        </div>

        <!-- 3. SQL格式化 -->
        <div class="tool-panel" id="tool-sql-format">
            <div class="tool-header">
                <h2>📝 SQL格式化</h2>
                <p>美化压缩的SQL语句，使其更易阅读</p>
            </div>
            <div class="card">
                <label>输入SQL语句</label>
                <textarea id="sql-input" rows="6" placeholder="例如：SELECT id,name,age FROM users WHERE age>18 ORDER BY id DESC LIMIT 10;">SELECT u.id,u.name,o.order_date,o.amount FROM users u INNER JOIN orders o ON u.id=o.user_id WHERE u.status='active' AND o.amount>100 GROUP BY u.id ORDER BY o.order_date DESC LIMIT 50;</textarea>
                <div class="flex-center mt-2" style="gap:10px;">
                    <button class="btn-primary" onclick="formatSQL()">🔧 格式化</button>
                    <button class="btn-outline" onclick="document.getElementById('sql-input').value='';">清空</button>
                    <button class="btn-outline btn-sm" onclick="minifySQL()">压缩SQL</button>
                    <span class="text-sm">（压缩可还原为单行）</span>
                </div>
                <label class="mt-2">格式化结果</label>
                <div class="result-area" id="sql-result">等待格式化...</div>
                <button class="btn-outline btn-xs mt-2" onclick="copyResult('sql-result')">📋 复制结果</button>
            </div>
        </div>

        <!-- 4. 字体预览 -->
        <div class="tool-panel" id="tool-font-preview">
            <div class="tool-header">
                <h2>🔤 字体预览</h2>
                <p>在线预览不同字体的效果，支持系统字体与Google Fonts中文字体</p>
            </div>
            <div class="card">
                <label>输入预览文字</label>
                <input type="text" id="font-text" value="天地玄黄 宇宙洪荒" placeholder="输入要预览的文字...">
                <label class="mt-2">选择字体</label>
                <select id="font-select" onchange="updateFontPreview()">
                    <optgroup label="📌 Google Fonts 中文字体">
                        <option value="'Noto Sans SC', sans-serif">Noto Sans SC (思源黑体)</option>
                        <option value="'Noto Serif SC', serif">Noto Serif SC (思源宋体)</option>
                        <option value="'ZCOOL XiaoWei', serif">ZCOOL XiaoWei (站酷小薇)</option>
                        <option value="'Ma Shan Zheng', cursive">Ma Shan Zheng (马山正)</option>
                        <option value="'Zhi Mang Xing', cursive">Zhi Mang Xing (志莽行)</option>
                        <option value="'Liu Jian Mao Cao', cursive">Liu Jian Mao Cao (柳建毛草)</option>
                        <option value="'Long Cang', cursive">Long Cang (龙藏)</option>
                        <option value="'ZCOOL KuaiLe', cursive">ZCOOL KuaiLe (站酷快乐)</option>
                    </optgroup>
                    <optgroup label="💻 系统中文字体">
                        <option value="'Microsoft YaHei', '微软雅黑', sans-serif">微软雅黑</option>
                        <option value="'SimSun', '宋体', serif">宋体</option>
                        <option value="'SimHei', '黑体', sans-serif">黑体</option>
                        <option value="'KaiTi', '楷体', serif">楷体</option>
                        <option value="'FangSong', '仿宋', serif">仿宋</option>
                        <option value="'STXingkai', '华文行楷', cursive">华文行楷</option>
                    </optgroup>
                    <optgroup label="🌐 英文/通用字体">
                        <option value="'Inter', 'Roboto', sans-serif">Inter / Roboto</option>
                        <option value="'Georgia', 'Times New Roman', serif">Georgia</option>
                        <option value="'Courier New', 'Consolas', monospace">Courier New (等宽)</option>
                        <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                    </optgroup>
                </select>
                <label class="mt-2">字号</label>
                <div class="flex-center" style="gap:10px;">
                    <input type="range" id="font-size-slider" min="16" max="120" value="48" oninput="updateFontPreview()" style="flex:1;">
                    <span id="font-size-label" style="min-width:50px;text-align:right;">48px</span>
                </div>
                <div class="art-text-preview mt-2" id="font-preview-area" style="font-size:48px;font-family:'Noto Sans SC',sans-serif;">
                    天地玄黄 宇宙洪荒
                </div>
            </div>
        </div>

        <!-- 5. 渐变生成器 -->
        <div class="tool-panel" id="tool-gradient">
            <div class="tool-header">
                <h2>🌈 CSS渐变生成器</h2>
                <p>可视化生成线性/径向渐变CSS代码</p>
            </div>
            <div class="card">
                <div class="card-row">
                    <div style="flex:1;min-width:150px;">
                        <label>渐变类型</label>
                        <select id="grad-type" onchange="updateGradient()">
                            <option value="linear">线性渐变 (linear)</option>
                            <option value="radial">径向渐变 (radial)</option>
                        </select>
                    </div>
                    <div style="flex:1;min-width:150px;">
                        <label>角度 (线性渐变)</label>
                        <input type="range" id="grad-angle" min="0" max="360" value="135" oninput="updateGradient()" style="width:100%;">
                        <span class="text-sm" id="grad-angle-label">135°</span>
                    </div>
                </div>
                <label class="mt-2">色标 <button class="btn-outline btn-xs" onclick="addColorStop()">+ 添加色标</button></label>
                <div id="color-stops-container">
                    <div class="color-stop-row">
                        <input type="color" value="#6c8cff" onchange="updateGradient()">
                        <input type="range" min="0" max="100" value="0" oninput="updateGradient()" style="flex:1;">
                        <span class="text-sm" style="min-width:35px;">0%</span>
                        <button class="btn-danger btn-xs" onclick="removeColorStop(this)" style="flex-shrink:0;">✕</button>
                    </div>
                    <div class="color-stop-row">
                        <input type="color" value="#a78bfa" onchange="updateGradient()">
                        <input type="range" min="0" max="100" value="100" oninput="updateGradient()" style="flex:1;">
                        <span class="text-sm" style="min-width:35px;">100%</span>
                        <button class="btn-danger btn-xs" onclick="removeColorStop(this)" style="flex-shrink:0;">✕</button>
                    </div>
                </div>
                <div class="gradient-preview mt-2" id="gradient-preview"></div>
                <label class="mt-2">CSS代码</label>
                <div class="result-area" id="grad-css-output">background: linear-gradient(135deg, #6c8cff 0%, #a78bfa 100%);</div>
                <button class="btn-outline btn-xs mt-2" onclick="copyResult('grad-css-output')">📋 复制CSS</button>
            </div>
        </div>

        <!-- 6. 艺术字生成器 -->
        <div class="tool-panel" id="tool-art-text">
            <div class="tool-header">
                <h2>✨ 艺术字生成器</h2>
                <p>使用CSS特效生成炫酷艺术字</p>
            </div>
            <div class="card">
                <label>输入文字</label>
                <input type="text" id="art-text-input" value="精彩世界" oninput="updateArtText()" placeholder="输入文字...">
                <label class="mt-2">艺术字样式</label>
                <select id="art-style" onchange="updateArtText()">
                    <option value="rainbow">🌈 彩虹渐变</option>
                    <option value="neon">💡 霓虹发光</option>
                    <option value="threed">🧊 3D立体</option>
                    <option value="metal">🪙 金属质感</option>
                    <option value="stroke">🖊️ 描边文字</option>
                    <option value="fire">🔥 火焰效果</option>
                    <option value="ice">❄️ 冰霜效果</option>
                    <option value="shadow">👤 重影叠影</option>
                </select>
                <label class="mt-2">字号</label>
                <input type="range" id="art-size-slider" min="24" max="140" value="64" oninput="updateArtText()" style="width:100%;">
                <span class="text-sm" id="art-size-label">64px</span>
                <div class="art-text-preview mt-2" id="art-text-preview" style="font-size:64px;font-weight:900;">
                    精彩世界
                </div>
                <button class="btn-outline btn-xs mt-2" onclick="copyArtTextCSS()">📋 复制CSS样式</button>
            </div>
        </div>

        <!-- 7. BMI计算器 -->
        <div class="tool-panel" id="tool-bmi">
            <div class="tool-header">
                <h2>⚖️ BMI计算器</h2>
                <p>输入身高体重，计算身体质量指数（BMI）</p>
            </div>
            <div class="card">
                <div class="card-row">
                    <div style="flex:1;min-width:150px;">
                        <label>身高 (cm)</label>
                        <input type="number" id="bmi-height" value="170" min="50" max="250" step="0.1" oninput="calcBMI()">
                    </div>
                    <div style="flex:1;min-width:150px;">
                        <label>体重 (kg)</label>
                        <input type="number" id="bmi-weight" value="65" min="20" max="300" step="0.1" oninput="calcBMI()">
                    </div>
                </div>
                <div class="mt-3 text-center" id="bmi-result-card" style="padding:20px;border-radius:var(--radius-sm);background:#1a1c22;">
                    <div style="font-size:3em;font-weight:900;" id="bmi-value">22.5</div>
                    <div id="bmi-category" class="tag tag-success" style="font-size:1em;">正常范围</div>
                    <div class="text-sm mt-2" id="bmi-range">健康BMI范围：18.5 ~ 24.0</div>
                </div>
                <div class="mt-2 text-sm text-center" style="color:var(--text-secondary);">
                    <span>偏瘦 &lt;18.5</span> &nbsp;|&nbsp;
                    <span style="color:#5cdb8b;">正常 18.5-24</span> &nbsp;|&nbsp;
                    <span style="color:#ffb347;">偏胖 24-28</span> &nbsp;|&nbsp;
                    <span style="color:#ff6b7a;">肥胖 ≥28</span>
                </div>
            </div>
        </div>

        <!-- 8. 骰子/抽签模拟器 -->
        <div class="tool-panel" id="tool-dice-lottery">
            <div class="tool-header">
                <h2>🎯 骰子 & 抽签模拟器</h2>
                <p>掷骰子或抽取运势签文</p>
            </div>
            <div class="card-row">
                <!-- 骰子 -->
                <div class="card text-center" style="flex:1;min-width:220px;">
                    <h3 style="margin-bottom:12px;">🎲 骰子模拟器</h3>
                    <div class="dice-scene">
                        <div class="dice-cube" id="diceCube">
                            <div class="dice-face front">⚀</div>
                            <div class="dice-face back">⚁</div>
                            <div class="dice-face right">⚂</div>
                            <div class="dice-face left">⚃</div>
                            <div class="dice-face top">⚄</div>
                            <div class="dice-face bottom">⚅</div>
                        </div>
                    </div>
                    <div style="font-size:1.4em;font-weight:700;margin:8px 0;" id="dice-result-num">1</div>
                    <button class="btn-primary" onclick="rollDice()" id="dice-roll-btn">🎯 掷骰子</button>
                    <div class="text-sm mt-2" id="dice-history">历史记录：—</div>
                </div>
                <!-- 抽签 -->
                <div class="card text-center" style="flex:1;min-width:220px;">
                    <h3 style="margin-bottom:12px;">🏮 运势抽签</h3>
                    <div style="font-size:4em;margin:10px 0;" id="lottery-icon">🏮</div>
                    <div style="font-size:1.3em;font-weight:700;" id="lottery-level">点击抽签</div>
                    <div class="text-sm mt-1" id="lottery-desc" style="color:var(--text-secondary);min-height:40px;"></div>
                    <button class="btn-primary" onclick="drawLottery()" id="lottery-btn">🏮 抽一支签</button>
                    <div class="text-sm mt-2" id="lottery-history">历史记录：—</div>
                </div>
            </div>
        </div>

    </main>

    <script>
        // ==================== 导航切换 ====================
        const navItems = document.querySelectorAll('.nav-item');
        const toolPanels = document.querySelectorAll('.tool-panel');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const toolId = item.dataset.tool;
                toolPanels.forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById('tool-' + toolId);
                if (targetPanel) targetPanel.classList.add('active');
                // 滚动主内容区到顶部
                document.getElementById('mainContent').scrollTop = 0;
            });
        });

        // ==================== 工具函数 ====================
        function copyResult(elementId) {
            const el = document.getElementById(elementId);
            const text = el.textContent || el.innerText;
            navigator.clipboard.writeText(text).then(() => {
                showToast('✅ 已复制到剪贴板');
            }).catch(() => {
                // 回退方案
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showToast('✅ 已复制到剪贴板');
            });
        }

        function showToast(msg) {
            let toast = document.getElementById('global-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'global-toast';
                toast.style.cssText = `
                    position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:9999;
                    background:#333;color:#fff;padding:10px 22px;border-radius:25px;font-size:0.85em;
                    pointer-events:none;transition:all 0.4s ease;opacity:0;
                    box-shadow:0 8px 30px rgba(0,0,0,0.5);
                `;
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.opacity = '1';
            toast.style.bottom = '30px';
            clearTimeout(toast._timeout);
            toast._timeout = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.bottom = '50px';
            }, 1800);
        }

        // ==================== 1. 随机测试数据生成 ====================
        const surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦',
            '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水',
            '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任',
            '袁', '柳', '邓', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬',
            '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄'
        ];
        const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明',
            '超', '秀兰', '霞', '平', '刚', '桂英', '文', '华', '飞', '玉兰', '斌', '玲', '建国', '建华', '秀珍', '志强', '志明',
            '海燕', '博文', '宇轩', '子涵', '雨桐', '梓豪', '一鸣', '天佑', '浩宇', '欣怡', '诗涵', '思远', '逸飞', '若曦', '沐辰',
            '星辰', '乐天', '安琪', '瑞霖', '晓峰', '雅琴', '云飞', '雪晴', '梦瑶', '昊天'
        ];

        function randomName() {
            const surname = surnames[Math.floor(Math.random() * surnames.length)];
            const given = givenNames[Math.floor(Math.random() * givenNames.length)];
            return surname + given;
        }

        function randomPhone() {
            const prefixes = ['130', '131', '132', '133', '135', '136', '137', '138', '139', '150', '151', '152', '153',
                '155', '156', '157', '158', '159', '176', '177', '178', '180', '181', '182', '183', '185', '186', '187',
                '188', '189', '191', '193', '195', '196', '197', '198', '199'
            ];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            let suffix = '';
            for (let i = 0; i < 8; i++) {
                suffix += Math.floor(Math.random() * 10);
            }
            return prefix + suffix;
        }

        function generateRandomData() {
            const count = Math.min(Math.max(parseInt(document.getElementById('rd-count').value) || 10, 1), 100);
            const type = document.getElementById('rd-type').value;
            const lines = [];
            for (let i = 0; i < count; i++) {
                const name = randomName();
                const phone = randomPhone();
                if (type === 'both') lines.push(`${i+1}. ${name}  |  ${phone}`);
                else if (type === 'name') lines.push(`${i+1}. ${name}`);
                else lines.push(`${i+1}. ${phone}`);
            }
            document.getElementById('rd-result').textContent = lines.join('\n');
            showToast(`✅ 已生成 ${count} 条数据`);
        }

        function exportCSV() {
            const count = Math.min(Math.max(parseInt(document.getElementById('rd-count').value) || 10, 1), 100);
            const type = document.getElementById('rd-type').value;
            let csv = '';
            if (type === 'both') csv = '序号,姓名,手机号\n';
            else if (type === 'name') csv = '序号,姓名\n';
            else csv = '序号,手机号\n';
            for (let i = 0; i < count; i++) {
                const name = randomName();
                const phone = randomPhone();
                if (type === 'both') csv += `${i+1},${name},${phone}\n`;
                else if (type === 'name') csv += `${i+1},${name}\n`;
                else csv += `${i+1},${phone}\n`;
            }
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test_data.csv';
            a.click();
            URL.revokeObjectURL(url);
            showToast('📥 CSV已下载');
        }

        // 初始生成
        generateRandomData();

        // ==================== 2. API响应时间测试 ====================
        async function testAPI() {
            const url = document.getElementById('api-url').value.trim();
            const method = document.getElementById('api-method').value;
            const resultArea = document.getElementById('api-result');
            const timingArea = document.getElementById('api-timing');

            if (!url) {
                resultArea.textContent = '⚠️ 请输入API URL';
                return;
            }
            resultArea.textContent = '⏳ 正在请求...';
            timingArea.innerHTML = '';

            const startTime = performance.now();
            const dnsStart = performance.now();
            try {
                const fetchOptions = { method };
                if (method === 'POST') {
                    fetchOptions.headers = { 'Content-Type': 'application/json' };
                    fetchOptions.body = JSON.stringify({ test: true, timestamp: Date.now() });
                }
                const response = await fetch(url, fetchOptions);
                const fetchEnd = performance.now();
                const totalTime = (fetchEnd - startTime).toFixed(2);
                const status = response.status;
                const statusText = response.statusText;
                const contentType = response.headers.get('content-type') || 'unknown';
                const contentLength = response.headers.get('content-length') || '未知';
                let bodyPreview = '';
                try {
                    const clone = response.clone();
                    const text = await clone.text();
                    bodyPreview = text.substring(0, 800);
                    if (text.length > 800) bodyPreview += '\n... (内容被截断)';
                } catch (e) {
                    bodyPreview = '(无法读取响应体)';
                }

                let statusTag = 'tag-success';
                if (status >= 400) statusTag = 'tag-danger';
                else if (status >= 300) statusTag = 'tag-warning';

                resultArea.textContent =
                    `✅ 请求成功\n\n📡 状态码: ${status} ${statusText}\n📋 Content-Type: ${contentType}\n📦 Content-Length: ${contentLength} bytes\n⏱️ 总耗时: ${totalTime} ms\n\n--- 响应预览 ---\n${bodyPreview}`;

                timingArea.innerHTML = `
                    <span class="tag tag-accent">⏱️ 总耗时: ${totalTime} ms</span>
                    <span class="tag ${statusTag}">状态: ${status}</span>
                    <span class="tag tag-accent">方法: ${method}</span>
                `;
            } catch (err) {
                const fetchEnd = performance.now();
                const totalTime = (fetchEnd - startTime).toFixed(2);
                resultArea.textContent =
                    `❌ 请求失败\n\n⏱️ 耗时: ${totalTime} ms\n🔴 错误: ${err.message}\n\n💡 提示：\n- 检查URL是否正确\n- 目标API可能不支持CORS跨域请求\n- 尝试使用支持CORS的公共API（如GitHub API、httpbin等）\n- 本地开发可配置代理绕过CORS`;
                timingArea.innerHTML = `<span class="tag tag-danger">❌ 失败</span><span class="tag tag-warning">耗时: ${totalTime} ms</span>`;
            }
        }

        // ==================== 3. SQL格式化 ====================
        function formatSQL() {
            const input = document.getElementById('sql-input').value.trim();
            if (!input) {
                document.getElementById('sql-result').textContent = '⚠️ 请输入SQL语句';
                return;
            }
            const formatted = sqlFormatter(input);
            document.getElementById('sql-result').textContent = formatted;
        }

        function minifySQL() {
            const input = document.getElementById('sql-input').value.trim();
            if (!input) return;
            const minified = input.replace(/\s+/g, ' ').trim();
            document.getElementById('sql-input').value = minified;
            document.getElementById('sql-result').textContent = '已压缩为单行（在输入框中查看）';
            showToast('✅ SQL已压缩');
        }

        function sqlFormatter(sql) {
            // 移除多余空白
            sql = sql.replace(/\s+/g, ' ').trim();
            // 主要关键字前换行
            const mainKeywords = [
                'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
                'LIMIT', 'OFFSET', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN',
                'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE',
                'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
                'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT', 'WITH', 'AS'
            ];
            // 对关键字进行排序，长的优先匹配
            const sortedKeywords = [...mainKeywords].sort((a, b) => b.length - a.length);

            // 使用占位符保护字符串和括号内容
            const protectedItems = [];
            // 保护字符串
            sql = sql.replace(/'[^']*'/g, match => {
                protectedItems.push(match);
                return `__STR${protectedItems.length-1}__`;
            });
            sql = sql.replace(/"[^"]*"/g, match => {
                protectedItems.push(match);
                return `__STR${protectedItems.length-1}__`;
            });
            // 保护括号内子查询（简单处理）
            sql = sql.replace(/\([^()]+\)/g, match => {
                if (match.includes('SELECT') || match.includes('select')) {
                    protectedItems.push(match);
                    return `__SUB${protectedItems.length-1}__`;
                }
                return match;
            });

            // 在关键字前添加换行
            for (const kw of sortedKeywords) {
                const regex = new RegExp(`\\b(${kw.replace(/\s+/g, '\\s+')})\\b`, 'gi');
                sql = sql.replace(regex, '\n$1');
            }

            // 逗号后换行
            sql = sql.replace(/,\s*/g, ',\n    ');

            // 清理多余换行
            sql = sql.replace(/\n{3,}/g, '\n\n');
            sql = sql.replace(/^\n+/, '');

            // 缩进处理
            const lines = sql.split('\n');
            const formattedLines = [];
            let indentLevel = 0;
            const indentStr = '    ';

            for (let line of lines) {
                line = line.trim();
                if (!line) {
                    formattedLines.push('');
                    continue;
                }
                const upperLine = line.toUpperCase();
                // 减少缩进的关键字
                if (/^(FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|UNION|UNION ALL|EXCEPT|INTERSECT|\))/i.test(
                        upperLine)) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                if (/^(INNER JOIN|LEFT JOIN|RIGHT JOIN|OUTER JOIN|FULL JOIN|CROSS JOIN|JOIN|ON)/i.test(upperLine)) {
                    indentLevel = 1;
                }
                formattedLines.push(indentStr.repeat(Math.max(0, indentLevel)) + line);
                // 增加缩进的关键字
                if (/^(SELECT|INSERT INTO|UPDATE|SET|CREATE TABLE|ALTER TABLE|WITH|VALUES|\(\s*SELECT)/i.test(upperLine)) {
                    indentLevel = Math.min(4, indentLevel + 1);
                }
                if (/^(FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN)/i.test(upperLine)) {
                    indentLevel = Math.min(4, indentLevel + 1);
                }
            }

            let result = formattedLines.join('\n');
            // 恢复受保护的内容
            for (let i = protectedItems.length - 1; i >= 0; i--) {
                result = result.replace(`__STR${i}__`, protectedItems[i]);
                result = result.replace(`__SUB${i}__`, protectedItems[i]);
            }

            return result;
        }

        // ==================== 4. 字体预览 ====================
        function updateFontPreview() {
            const text = document.getElementById('font-text').value || '天地玄黄 宇宙洪荒';
            const font = document.getElementById('font-select').value;
            const size = document.getElementById('font-size-slider').value;
            const previewArea = document.getElementById('font-preview-area');
            previewArea.textContent = text;
            previewArea.style.fontFamily = font;
            previewArea.style.fontSize = size + 'px';
            document.getElementById('font-size-label').textContent = size + 'px';
        }
        document.getElementById('font-text').addEventListener('input', updateFontPreview);
        updateFontPreview();

        // ==================== 5. 渐变生成器 ====================
        function updateGradient() {
            const type = document.getElementById('grad-type').value;
            const angle = document.getElementById('grad-angle').value;
            document.getElementById('grad-angle-label').textContent = angle + '°';
            const rows = document.querySelectorAll('#color-stops-container .color-stop-row');
            const stops = [];
            rows.forEach(row => {
                const color = row.querySelector('input[type="color"]').value;
                const pos = row.querySelector('input[type="range"]').value;
                const posLabel = row.querySelector('span.text-sm');
                if (posLabel) posLabel.textContent = pos + '%';
                stops.push({ color, pos: parseInt(pos) });
            });
            stops.sort((a, b) => a.pos - b.pos);
            const stopStrings = stops.map(s => `${s.color} ${s.pos}%`).join(', ');
            let css;
            if (type === 'linear') {
                css = `background: linear-gradient(${angle}deg, ${stopStrings});`;
            } else {
                css = `background: radial-gradient(circle, ${stopStrings});`;
            }
            document.getElementById('grad-css-output').textContent = css;
            document.getElementById('gradient-preview').style.cssText = css;
        }

        function addColorStop() {
            const container = document.getElementById('color-stops-container');
            const row = document.createElement('div');
            row.className = 'color-stop-row';
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            row.innerHTML = `
                <input type="color" value="${randomColor}" onchange="updateGradient()">
                <input type="range" min="0" max="100" value="50" oninput="updateGradient()" style="flex:1;">
                <span class="text-sm" style="min-width:35px;">50%</span>
                <button class="btn-danger btn-xs" onclick="removeColorStop(this)" style="flex-shrink:0;">✕</button>
            `;
            container.appendChild(row);
            updateGradient();
        }

        function removeColorStop(btn) {
            const container = document.getElementById('color-stops-container');
            const rows = container.querySelectorAll('.color-stop-row');
            if (rows.length <= 2) {
                showToast('⚠️ 至少保留2个色标');
                return;
            }
            btn.closest('.color-stop-row').remove();
            updateGradient();
        }
        updateGradient();

        // ==================== 6. 艺术字生成器 ====================
        const artStylesCSS = {
            rainbow: (size) => `
                font-size: ${size}px; font-weight: 900;
                background: linear-gradient(135deg, #ff6b6b, #ffb347, #5cdb8b, #6c8cff, #a78bfa, #ff6b9d);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                background-clip: text; color: transparent;
                animation: rainbowShift 3s ease-in-out infinite;
                @keyframes rainbowShift { 0%,100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(30deg); } }
            `,
            neon: (size) => `
                font-size: ${size}px; font-weight: 900; color: #fff;
                text-shadow: 0 0 10px #ff6b9d, 0 0 20px #ff6b9d, 0 0 40px #ff3d7f, 0 0 80px #ff3d7f, 0 0 120px #c0392b;
                letter-spacing: 3px;
            `,
            threed: (size) => `
                font-size: ${size}px; font-weight: 900; color: #e8e8e8;
                text-shadow: 1px 1px 0 #bbb, 2px 2px 0 #aaa, 3px 3px 0 #999, 4px 4px 0 #888, 5px 5px 0 #777, 6px 6px 0 #666, 7px 7px 8px rgba(0,0,0,0.4);
                letter-spacing: 2px;
            `,
            metal: (size) => `
                font-size: ${size}px; font-weight: 900;
                background: linear-gradient(180deg, #e8e8e8 0%, #b0b0b0 30%, #e0e0e0 50%, #8a8a8a 70%, #c0c0c0 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                background-clip: text; color: transparent;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5), -1px -1px 2px rgba(255,255,255,0.3);
                letter-spacing: 2px;
            `,
            stroke: (size) => `
                font-size: ${size}px; font-weight: 900; color: #fff;
                -webkit-text-stroke: 3px #333; text-stroke: 3px #333;
                paint-order: stroke fill;
                letter-spacing: 2px;
            `,
            fire: (size) => `
                font-size: ${size}px; font-weight: 900;
                background: linear-gradient(0deg, #ff0000, #ff4d00, #ff8c00, #ffcc00);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                background-clip: text; color: transparent;
                text-shadow: 0 0 20px rgba(255,100,0,0.6), 0 0 40px rgba(255,50,0,0.4);
                letter-spacing: 2px;
            `,
            ice: (size) => `
                font-size: ${size}px; font-weight: 900;
                background: linear-gradient(180deg, #e0f7ff 0%, #80d8ff 30%, #40c4ff 60%, #0091ea 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                background-clip: text; color: transparent;
                text-shadow: 0 0 15px rgba(100,200,255,0.7), 0 0 30px rgba(0,150,255,0.5), 0 4px 8px rgba(0,0,50,0.3);
                letter-spacing: 2px;
            `,
            shadow: (size) => `
                font-size: ${size}px; font-weight: 900; color: #fff;
                text-shadow: 3px 3px 0 rgba(108,140,255,0.8), 6px 6px 0 rgba(167,139,250,0.6), 9px 9px 0 rgba(255,107,154,0.4), 12px 12px 8px rgba(0,0,0,0.3);
                letter-spacing: 2px;
            `,
        };

        function updateArtText() {
            const text = document.getElementById('art-text-input').value || '精彩世界';
            const style = document.getElementById('art-style').value;
            const size = document.getElementById('art-size-slider').value;
            const preview = document.getElementById('art-text-preview');
            preview.textContent = text;
            preview.style.cssText = artStylesCSS[style](size);
            document.getElementById('art-size-label').textContent = size + 'px';
        }
        document.getElementById('art-text-input').addEventListener('input', updateArtText);
        updateArtText();

        function copyArtTextCSS() {
            const style = document.getElementById('art-style').value;
            const size = document.getElementById('art-size-slider').value;
            const css = artStylesCSS[style](size).replace(/\n\s*/g, ' ').trim();
            navigator.clipboard.writeText(css).then(() => showToast('✅ CSS样式已复制'));
        }

        // ==================== 7. BMI计算器 ====================
        function calcBMI() {
            const heightCm = parseFloat(document.getElementById('bmi-height').value) || 170;
            const weight = parseFloat(document.getElementById('bmi-weight').value) || 65;
            const heightM = heightCm / 100;
            const bmi = weight / (heightM * heightM);
            const bmiRounded = bmi.toFixed(1);
            document.getElementById('bmi-value').textContent = bmiRounded;

            let category, tagClass, color;
            if (bmi < 18.5) {
                category = '偏瘦';
                tagClass = 'tag-warning';
                color = '#ffb347';
            } else if (bmi < 24) {
                category = '正常范围';
                tagClass = 'tag-success';
                color = '#5cdb8b';
            } else if (bmi < 28) {
                category = '偏胖';
                tagClass = 'tag-warning';
                color = '#ffb347';
            } else {
                category = '肥胖';
                tagClass = 'tag-danger';
                color = '#ff6b7a';
            }
            const catEl = document.getElementById('bmi-category');
            catEl.textContent = category;
            catEl.className = 'tag ' + tagClass;
            catEl.style.fontSize = '1em';
            document.getElementById('bmi-value').style.color = color;
            document.getElementById('bmi-range').textContent =
                `健康BMI范围：18.5 ~ 24.0 | 你的BMI：${bmiRounded}`;
        }
        calcBMI();

        // ==================== 8. 骰子/抽签模拟器 ====================
        const diceRotations = {
            1: 'rotateX(0deg) rotateY(0deg)',
            2: 'rotateY(180deg)',
            3: 'rotateY(-90deg)',
            4: 'rotateY(90deg)',
            5: 'rotateX(-90deg)',
            6: 'rotateX(90deg)',
        };
        const diceFaces = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };
        let diceHistoryArr = [];

        function rollDice() {
            const cube = document.getElementById('diceCube');
            const btn = document.getElementById('dice-roll-btn');
            btn.disabled = true;
            const result = Math.floor(Math.random() * 6) + 1;
            // 添加滚动动画
            cube.classList.remove('rolling');
            void cube.offsetWidth;
            cube.classList.add('rolling');
            // 动画结束后设置最终位置
            setTimeout(() => {
                cube.classList.remove('rolling');
                cube.style.transform = diceRotations[result];
                document.getElementById('dice-result-num').textContent = result + ' ' + diceFaces[result];
                diceHistoryArr.unshift(result);
                if (diceHistoryArr.length > 10) diceHistoryArr.pop();
                document.getElementById('dice-history').textContent =
                    '历史：' + diceHistoryArr.map(r => diceFaces[r]).join(' ');
                btn.disabled = false;
            }, 750);
        }

        // 抽签
        const lotteryPool = [
            { level: '上上签', icon: '🌟', desc: '大吉大利，万事如意，前程似锦，好运连连！', color: '#ffb347' },
            { level: '上签', icon: '✨', desc: '运势亨通，心想事成，努力必有回报。', color: '#ffcc00' },
            { level: '上签', icon: '💫', desc: '贵人相助，机遇在望，宜把握良机。', color: '#ffcc00' },
            { level: '中签', icon: '🍀', desc: '平平淡淡，稳扎稳打，守得云开见月明。', color: '#5cdb8b' },
            { level: '中签', icon: '🌿', desc: '虽有波折，终能化解，保持平常心。', color: '#5cdb8b' },
            { level: '中签', icon: '🌸', desc: '时机未到，稍安勿躁，静待花开。', color: '#5cdb8b' },
            { level: '下签', icon: '🌧️', desc: '略有阻滞，需谨慎行事，注意人际关系。', color: '#ffb347' },
            { level: '下签', icon: '💨', desc: '风雨将至，宜低调内敛，避免口舌之争。', color: '#ffb347' },
            { level: '下下签', icon: '⚡', desc: '运势低迷，诸事不宜，建议韬光养晦。', color: '#ff6b7a' },
        ];
        let lotteryHistoryArr = [];

        function drawLottery() {
            const btn = document.getElementById('lottery-btn');
            btn.disabled = true;
            const iconEl = document.getElementById('lottery-icon');
            const levelEl = document.getElementById('lottery-level');
            const descEl = document.getElementById('lottery-desc');
            // 摇晃动画
            let shakeCount = 0;
            const shakeInterval = setInterval(() => {
                const temp = lotteryPool[Math.floor(Math.random() * lotteryPool.length)];
                iconEl.textContent = temp.icon;
                iconEl.style.transform = `rotate(${(Math.random()-0.5)*30}deg) scale(1.1)`;
                shakeCount++;
            }, 100);
            setTimeout(() => {
                clearInterval(shakeInterval);
                iconEl.style.transform = 'rotate(0deg) scale(1)';
                const result = lotteryPool[Math.floor(Math.random() * lotteryPool.length)];
                iconEl.textContent = result.icon;
                levelEl.textContent = result.level;
                levelEl.style.color = result.color;
                descEl.textContent = result.desc;
                lotteryHistoryArr.unshift(result.level);
                if (lotteryHistoryArr.length > 8) lotteryHistoryArr.pop();
                document.getElementById('lottery-history').textContent =
                    '历史：' + lotteryHistoryArr.join(' → ');
                btn.disabled = false;
                showToast('🏮 ' + result.level + '！');
            }, 1200);
        }

        // ==================== 初始化 ====================
        // 默认加载随机数据
        generateRandomData();
        // 设置骰子初始状态
        document.getElementById('diceCube').style.transform = diceRotations[1];
        document.getElementById('dice-result-num').textContent = '1 ⚀';

        console.log('🛠️ 开发者工具箱已就绪！');
        console.log('  包含工具：随机数据生成 | API测试 | SQL格式化 | 字体预览 | 渐变生成器 | 艺术字 | BMI计算 | 骰子/抽签');
    </script>
</body>
</html>