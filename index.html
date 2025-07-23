<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高级链接防护系统</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary-color: #4361ee;
            --secondary-color: #3f37c9;
            --accent-color: #4895ef;
            --light-color: #f8f9fa;
            --dark-color: #212529;
        }
        
        body {
            background-color: #f5f7fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .card {
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            border: none;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            font-weight: 600;
            border-bottom: none;
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }
        
        .btn-primary:hover {
            background-color: var(--secondary-color);
            border-color: var(--secondary-color);
        }
        
        .form-control {
            border-radius: 8px;
            padding: 12px 15px;
            border: 1px solid #e0e0e0;
        }
        
        .form-control:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
        }
        
        .result-box {
            background-color: white;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid var(--accent-color);
        }
        
        /* 所有链接都保持单行显示 */
        .link-display {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .link-text {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 8px;
            background-color: #f8f9fa;
            border-radius: 6px;
        }
        
        .copy-icon {
            cursor: pointer;
            transition: all 0.2s;
            margin-left: 10px;
        }
        
        .copy-icon:hover {
            transform: scale(1.1);
            color: var(--primary-color);
        }
        
        /* 操作按钮样式 */
        .action-buttons {
            display: flex;
            gap: 10px;
        }
        
        .action-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .action-btn:hover {
            transform: translateY(-2px);
        }
        
        .copy-btn {
            background-color: #e9ecef;
            color: var(--dark-color);
            border: 1px solid #dee2e6;
        }
        
        .copy-btn:hover {
            background-color: #dee2e6;
            color: var(--dark-color);
        }
        
        .open-btn {
            background-color: var(--accent-color);
            color: white;
            border: 1px solid var(--accent-color);
        }
        
        .open-btn:hover {
            background-color: #3a7bc8;
            color: white;
        }
        
        .qr-code-container {
            background-color: white;
            padding: 15px;
            border-radius: 10px;
            display: inline-block;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px;
            background-color: rgba(67, 97, 238, 0.05);
            border-radius: 8px;
        }
        
        .step-number {
            width: 30px;
            height: 30px;
            background-color: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
        }
        
        .switch-container {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
            margin-right: 10px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: var(--primary-color);
        }
        
        input:focus + .slider {
            box-shadow: 0 0 1px var(--primary-color);
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
    </style>
</head>
<body>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-header d-flex align-items-center">
                        <i class="bi bi-shield-lock me-2" style="font-size: 1.5rem;"></i>
                        <h4 class="mb-0">高级链接防护系统</h4>
                    </div>
                    <div class="card-body">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div>
                                <h5 class="mb-1">输入目标链接</h5>
                                <p class="mb-0 text-muted">请输入您需要保护的目标网址</p>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <input type="url" class="form-control" id="targetUrl" placeholder="https://example.com" required>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">2</div>
                            <div>
                                <h5 class="mb-1">防红保护</h5>
                                <p class="mb-0 text-muted">开启后可以防止链接变红失效</p>
                            </div>
                        </div>
                        
                        <div class="switch-container mb-3">
                            <label class="switch">
                                <input type="checkbox" id="antiRedSwitch" checked>
                                <span class="slider"></span>
                            </label>
                            <span>开启防红保护</span>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">3</div>
                            <div>
                                <h5 class="mb-1">生成防护链接</h5>
                                <p class="mb-0 text-muted">点击下方按钮生成防护链接</p>
                            </div>
                        </div>
                        
                        <button id="generateBtn" class="btn btn-primary w-100 py-3 fw-bold">
                            <i class="bi bi-magic me-2"></i>生成防护链接
                        </button>
                    </div>
                </div>
                
                <div id="resultsSection" style="display: none;">
                    <div class="card mb-4">
                        <div class="card-header d-flex align-items-center">
                            <i class="bi bi-link-45deg me-2" style="font-size: 1.5rem;"></i>
                            <h4 class="mb-0">生成结果</h4>
                        </div>
                        <div class="card-body">
                            <div class="mb-4">
                                <h5 class="mb-3"><i class="bi bi-link text-primary me-2"></i>原始链接</h5>
                                <div class="result-box">
                                    <div class="link-display">
                                        <div class="link-text" id="originalUrl"></div>
                                        <i class="bi bi-clipboard copy-icon" data-target="originalUrl"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-4" id="antiRedResultContainer">
                                <h5 class="mb-3"><i class="bi bi-shield-check text-success me-2"></i>防红链接</h5>
                                <div class="result-box">
                                    <div class="link-display">
                                        <div class="link-text" id="antiRedUrl"></div>
                                        <i class="bi bi-clipboard copy-icon" data-target="antiRedUrl"></i>
                                    </div>
                                    <div class="action-buttons">
                                        <button class="action-btn copy-btn" data-target="antiRedUrl">
                                            <i class="bi bi-clipboard"></i>复制链接
                                        </button>
                                        <button class="action-btn open-btn" data-target="antiRedUrl">
                                            <i class="bi bi-box-arrow-up-right"></i>打开链接
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <h5 class="mb-3"><i class="bi bi-wechat text-success me-2"></i>防微信拦截链接</h5>
                                <div class="result-box">
                                    <div class="link-display">
                                        <div class="link-text" id="antiBlockUrl"></div>
                                        <i class="bi bi-clipboard copy-icon" data-target="antiBlockUrl"></i>
                                    </div>
                                    <div class="action-buttons">
                                        <button class="action-btn copy-btn" data-target="antiBlockUrl">
                                            <i class="bi bi-clipboard"></i>复制链接
                                        </button>
                                        <button class="action-btn open-btn" data-target="antiBlockUrl">
                                            <i class="bi bi-box-arrow-up-right"></i>打开链接
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <h5 class="mb-3"><i class="bi bi-qr-code-scan text-info me-2"></i>二维码</h5>
                                <div class="text-center">
                                    <div class="qr-code-container mb-3">
                                        <img id="qrCodeImg" src="" alt="二维码">
                                    </div>
                                    <p class="text-muted">扫描二维码访问防微信拦截链接</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 存储完整URL
            const fullUrls = {
                originalUrl: '',
                antiRedUrl: '',
                antiBlockUrl: ''
            };
            
            // 生成随机三位数
            function generateRandomNumber() {
                return Math.floor(Math.random() * 900) + 100; // 100-999
            }
            
            // Base64编码
            function base64Encode(str) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, 
                    function(match, p1) {
                        return String.fromCharCode('0x' + p1);
                    }));
            }
            
            // 生成防红链接
            function generateAntiRedUrl(targetUrl) {
                const randomNum = generateRandomNumber();
                const urlWithRandom = targetUrl.includes('?') 
                    ? `${targetUrl}&rnd=${randomNum}`
                    : `${targetUrl}?rnd=${randomNum}`;
                const base64Url = base64Encode(urlWithRandom);
                return `http://laicai.66ghz.com/c.htm?c=${base64Url}`;
            }
            
            // 生成防微信拦截链接
            function generateAntiBlockUrl(targetUrl) {
                return `${window.location.origin}/fz.html?url=${encodeURIComponent(targetUrl)}`;
            }
            
            // 复制到剪贴板
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('链接已复制到剪贴板');
                }).catch(err => {
                    console.error('复制失败:', err);
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    alert('链接已复制到剪贴板');
                });
            }
            
            // 打开链接
            function openUrl(url) {
                window.open(url, '_blank');
            }
            
            // 绑定按钮事件
            document.addEventListener('click', function(e) {
                // 复制图标按钮
                if (e.target.classList.contains('copy-icon')) {
                    const targetId = e.target.getAttribute('data-target');
                    copyToClipboard(fullUrls[targetId]);
                }
                
                // 复制按钮
                if (e.target.closest('.copy-btn')) {
                    const btn = e.target.closest('.copy-btn');
                    const targetId = btn.getAttribute('data-target');
                    copyToClipboard(fullUrls[targetId]);
                }
                
                // 打开按钮
                if (e.target.closest('.open-btn')) {
                    const btn = e.target.closest('.open-btn');
                    const targetId = btn.getAttribute('data-target');
                    openUrl(fullUrls[targetId]);
                }
            });
            
            // 生成按钮点击事件
            document.getElementById('generateBtn').addEventListener('click', function() {
                const targetUrl = document.getElementById('targetUrl').value.trim();
                
                if (!targetUrl) {
                    alert('请输入目标链接');
                    return;
                }
                
                try {
                    new URL(targetUrl);
                } catch (e) {
                    alert('请输入有效的URL，例如: https://example.com');
                    return;
                }
                
                // 存储并显示原始链接
                fullUrls.originalUrl = targetUrl;
                document.getElementById('originalUrl').textContent = targetUrl;
                
                // 生成防红链接
                const isAntiRedEnabled = document.getElementById('antiRedSwitch').checked;
                if (isAntiRedEnabled) {
                    fullUrls.antiRedUrl = generateAntiRedUrl(targetUrl);
                    document.getElementById('antiRedUrl').textContent = fullUrls.antiRedUrl;
                    document.getElementById('antiRedResultContainer').style.display = 'block';
                } else {
                    document.getElementById('antiRedResultContainer').style.display = 'none';
                }
                
                // 生成防微信拦截链接
                const finalUrl = isAntiRedEnabled ? fullUrls.antiRedUrl : targetUrl;
                fullUrls.antiBlockUrl = generateAntiBlockUrl(finalUrl);
                document.getElementById('antiBlockUrl').textContent = fullUrls.antiBlockUrl;
                
                // 生成二维码
                document.getElementById('qrCodeImg').src = 
                    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrls.antiBlockUrl)}`;
                
                // 显示结果区域
                document.getElementById('resultsSection').style.display = 'block';
                document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
            });
        });
    </script>
</body>
</html>
