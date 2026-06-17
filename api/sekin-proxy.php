<?php
// Seekin API 转发代理
// 部署到网站根目录：https://www.xkitbox.xyz/api/sekin-proxy.php
// 前端改为请求这个同域名地址，彻底绕过 CORS

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['code' => '0405', 'msg' => '仅支持 POST 请求']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$url = $input['url'] ?? '';

if (!$url) {
    http_response_code(400);
    echo json_encode(['code' => '0400', 'msg' => '缺少 url 参数']);
    exit;
}

// 生成鉴权签名
$lang = 'zh';
$secretKey = '3HT8hjE79L';
$timestamp = (int)(microtime(true) * 1000);
$payload = 'url=' . $url;
$raw = $lang . $timestamp . $secretKey . $payload;
$sign = hash('sha256', $raw);

// 请求 Seekin API
$ch = curl_init('https://api.seekin.ai/ikool/media/download');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(['url' => $url]),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'lang: zh',
        'sign: ' . $sign,
        'timestamp: ' . $timestamp,
        'origin: https://www.seekin.ai',
        'referer: https://www.seekin.ai/',
        'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    http_response_code(502);
    echo json_encode(['code' => '0502', 'msg' => 'API 请求失败', 'http_code' => $httpCode]);
    exit;
}

echo $response;
