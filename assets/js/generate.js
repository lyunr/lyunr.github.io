document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // 加载防红域名
    loadDomains();
    
    // 表单提交
    document.getElementById('generateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generateLinks();
    });
    
    // 防红开关变化
    document.getElementById('antiRed').addEventListener('change', function() {
        document.getElementById('domainSelectGroup').style.display = 
            this.checked ? 'block' : 'none';
    });
});

// 加载防红域名
function loadDomains() {
    fetch('data/domains.json')
        .then(response => response.json())
        .then(domains => {
            const domainSelect = document.getElementById('domain');
            domainSelect.innerHTML = '';
            
            domains.forEach(domain => {
                const option = document.createElement('option');
                option.value = domain;
                option.textContent = domain;
                domainSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('加载域名失败:', error);
        });
}

// 生成链接
function generateLinks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // 检查用户权限
    if (currentUser.memberType === 'free' && currentUser.remainingCount <= 0) {
        alert('您的生成次数已用完，请购买会员或兑换次卡');
        return;
    }
    
    const originalUrl = document.getElementById('originalUrl').value;
    const useAntiRed = document.getElementById('antiRed').checked;
    const domain = useAntiRed ? document.getElementById('domain').value : null;
    
    // 生成防红链接
    let antiRedUrl = '';
    if (useAntiRed && domain) {
        const encodedUrl = btoa(encodeURIComponent(originalUrl));
        antiRedUrl = `${domain}?c=${encodedUrl}`;
    } else {
        antiRedUrl = originalUrl;
    }
    
    // 生成防拦截链接
    const antiBlockUrl = generateAntiBlockLink(antiRedUrl);
    
    // 显示结果
    document.getElementById('antiRedUrl').value = antiRedUrl;
    document.getElementById('antiBlockUrl').value = antiBlockUrl;
    
    // 生成二维码
    generateQRCode(antiBlockUrl);
    
    // 显示结果卡片
    document.getElementById('resultCard').style.display = 'block';
    
    // 保存链接记录
    saveLinkRecord(currentUser.id, originalUrl, antiRedUrl, antiBlockUrl);
    
    // 更新用户剩余次数（如果是次卡用户）
    if (currentUser.memberType === 'count') {
        updateUserRemainingCount(currentUser.id, currentUser.remainingCount - 1);
    }
}

// 生成防拦截链接
function generateAntiBlockLink(targetUrl) {
    // 在实际应用中，这里应该生成一个HTML文件并返回其URL
    // 由于GitHub Pages的限制，我们只能模拟这个过程
    return `${window.location.origin}/redirect.html?url=${encodeURIComponent(targetUrl)}`;
}

// 生成二维码
function generateQRCode(url) {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" 
             alt="二维码" class="img-fluid">
        <p>扫描二维码访问链接</p>
    `;
}

// 保存链接记录
function saveLinkRecord(userId, originalUrl, antiRedUrl, antiBlockUrl) {
    fetch('data/links.json')
        .then(response => response.json())
        .then(links => {
            const newLink = {
                id: generateId(),
                userId: userId,
                originalUrl: originalUrl,
                antiRedUrl: antiRedUrl,
                antiBlockUrl: antiBlockUrl,
                createdAt: new Date().toISOString()
            };
            
            links.push(newLink);
            return saveData('links.json', links);
        })
        .catch(error => {
            console.error('保存链接记录失败:', error);
        });
}

// 更新用户剩余次数
function updateUserRemainingCount(userId, newCount) {
    fetch('data/users.json')
        .then(response => response.json())
        .then(users => {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex].remainingCount = newCount;
                
                // 更新本地存储的当前用户信息
                const currentUser = users[userIndex];
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                return saveData('users.json', users);
            }
        })
        .catch(error => {
            console.error('更新用户剩余次数失败:', error);
        });
}
