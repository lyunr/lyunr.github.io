document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // 检查是否是管理员
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // 初始化标签页
    initAdminTabs();
    
    // 加载防红域名
    loadDomainsForAdmin();
    
    // 添加域名表单提交
    document.getElementById('addDomainForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewDomain();
    });
    
    // 卡密类型变化
    document.getElementById('cardType').addEventListener('change', function() {
        document.getElementById('cardValueUnit').textContent = 
            this.value === 'month' ? '天' : '次';
    });
    
    // 生成卡密表单提交
    document.getElementById('generateCardForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generateCardKeys();
    });
    
    // 加载卡密列表
    loadCardKeys();
});

// 初始化管理标签页
function initAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加active类到当前标签
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 加载防红域名（管理员）
function loadDomainsForAdmin() {
    fetch('data/domains.json')
        .then(response => response.json())
        .then(domains => {
            const tableBody = document.getElementById('domainsTableBody');
            tableBody.innerHTML = '';
            
            domains.forEach(domain => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${domain}</td>
                    <td>
                        <button class="btn btn-danger delete-domain" data-domain="${domain}">删除</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // 添加删除事件
            document.querySelectorAll('.delete-domain').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteDomain(this.getAttribute('data-domain'));
                });
            });
        })
        .catch(error => {
            console.error('加载域名失败:', error);
        });
}

// 添加新域名
function addNewDomain() {
    const newDomain = document.getElementById('newDomain').value.trim();
    
    if (!newDomain) {
        alert('请输入域名');
        return;
    }
    
    fetch('data/domains.json')
        .then(response => response.json())
        .then(domains => {
            // 检查域名是否已存在
            if (domains.includes(newDomain)) {
                alert('该域名已存在');
                return;
            }
            
            // 添加新域名
            domains.push(newDomain);
            
            // 保存
            return saveData('domains.json', domains);
        })
        .then(() => {
            alert('添加成功');
            document.getElementById('newDomain').value = '';
            loadDomainsForAdmin();
        })
        .catch(error => {
            console.error('添加域名失败:', error);
            alert('添加域名失败');
        });
}

// 删除域名
function deleteDomain(domain) {
    if (!confirm(`确定要删除域名 ${domain} 吗？`)) {
        return;
    }
    
    fetch('data/domains.json')
        .then(response => response.json())
        .then(domains => {
            // 过滤掉要删除的域名
            const updatedDomains = domains.filter(d => d !== domain);
            
            // 保存
            return saveData('domains.json', updatedDomains);
        })
        .then(() => {
            alert('删除成功');
            loadDomainsForAdmin();
        })
        .catch(error => {
            console.error('删除域名失败:', error);
            alert('删除域名失败');
        });
}

// 生成卡密
function generateCardKeys() {
    const cardType = document.getElementById('cardType').value;
    const cardValue = parseInt(document.getElementById('cardValue').value);
    const cardQuantity = parseInt(document.getElementById('cardQuantity').value);
    
    if (cardValue <= 0 || cardQuantity <= 0) {
        alert('请输入有效的值');
        return;
    }
    
    fetch('data/cards.json')
        .then(response => response.json())
        .then(cards => {
            const newCards = [];
            
            for (let i = 0; i < cardQuantity; i++) {
                newCards.push({
                    key: generateCardKey(),
                    type: cardType,
                    value: cardValue,
                    isUsed: false,
                    usedBy: null,
                    usedAt: null,
                    createdAt: new Date().toISOString()
                });
            }
            
            // 添加新卡密
            cards.push(...newCards);
            
            // 保存
            return saveData('cards.json', cards);
        })
        .then(() => {
            alert(`成功生成 ${cardQuantity} 张卡密`);
            loadCardKeys();
        })
        .catch(error => {
            console.error('生成卡密失败:', error);
            alert('生成卡密失败');
        });
}

// 生成卡密（随机字符串）
function generateCardKey() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 加载卡密列表
function loadCardKeys() {
    fetch('data/cards.json')
        .then(response => response.json())
        .then(cards => {
            const tableBody = document.getElementById('cardsTableBody');
            tableBody.innerHTML = '';
            
            cards.forEach(card => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${card.key}</td>
                    <td>${card.type === 'month' ? '月卡' : '次卡'}</td>
                    <td>${card.value} ${card.type === 'month' ? '天' : '次'}</td>
                    <td>${card.isUsed ? '已使用' : '未使用'}</td>
                    <td>${card.usedBy || '-'}</td>
                    <td>
                        ${!card.isUsed ? `<button class="btn btn-danger delete-card" data-key="${card.key}">删除</button>` : ''}
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // 添加删除事件
            document.querySelectorAll('.delete-card').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteCardKey(this.getAttribute('data-key'));
                });
            });
        })
        .catch(error => {
            console.error('加载卡密失败:', error);
        });
}

// 删除卡密
function deleteCardKey(key) {
    if (!confirm(`确定要删除卡密 ${key} 吗？`)) {
        return;
    }
    
    fetch('data/cards.json')
        .then(response => response.json())
        .then(cards => {
            // 过滤掉要删除的卡密
            const updatedCards = cards.filter(c => c.key !== key);
            
            // 保存
            return saveData('cards.json', updatedCards);
        })
        .then(() => {
            alert('删除成功');
            loadCardKeys();
        })
        .catch(error => {
            console.error('删除卡密失败:', error);
            alert('删除卡密失败');
        });
}
