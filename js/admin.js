// 强制验证管理员密码（不依赖用户系统）
document.addEventListener('DOMContentLoaded', () => {
    const storedPassword = Utils.getData('config').adminPassword;
    const inputPassword = prompt("请输入管理员密码：");
    
    if (inputPassword !== storedPassword) {
        alert("密码错误！");
        window.location.href = "index.html"; // 跳转回首页
        return;
    }
    
    // 密码正确则继续加载后台
    Admin.init();
});
// 管理员后台逻辑
class Admin {
    // 初始化
    static init() {
        if (!Auth.checkAdmin()) return;

        this.currentTab = 'dashboard';
        this.loadDashboard();
        this.bindEvents();
    }

    // 加载仪表盘
    static loadDashboard() {
        const users = Utils.getData('users');
        const links = Utils.getData('links');
        const cards = Utils.getData('cards');
        const domains = Utils.getData('domains');

        // 更新统计信息
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalLinks').textContent = links.length;
        document.getElementById('activeCards').textContent = cards.filter(c => !c.used).length;
        document.getElementById('totalDomains').textContent = domains.length;

        // 加载最近链接
        this.loadRecentLinks(links.slice(0, 5));
    }

    // 加载最近链接
    static loadRecentLinks(links) {
        const tbody = document.getElementById('recentLinksTable');
        tbody.innerHTML = '';

        links.forEach(link => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${link.username}</td>
                <td class="text-truncate" style="max-width: 200px;" title="${link.originalUrl}">${link.originalUrl}</td>
                <td class="text-truncate" style="max-width: 150px;" title="${link.generatedUrl}">${link.generatedUrl}</td>
                <td>${Utils.formatDate(link.createTime)}</td>
                <td>
                    <span class="badge ${link.status ? 'bg-success' : 'bg-danger'}">
                        ${link.status ? '有效' : '禁用'}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 加载防红域名
    static loadDomains() {
        const domains = Utils.getData('domains');
        const tbody = document.getElementById('domainsTable');
        tbody.innerHTML = '';

        domains.forEach(domain => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${domain.domain}</td>
                <td>
                    <span class="badge ${domain.status ? 'bg-success' : 'bg-secondary'}">
                        ${domain.status ? '启用' : '禁用'}
                    </span>
                </td>
                <td>${Utils.formatDate(domain.addTime)}</td>
                <td>
                    <button class="btn btn-sm ${domain.status ? 'btn-warning' : 'btn-success'} toggle-domain-btn" data-id="${domain.id}">
                        <i class="bi ${domain.status ? 'bi-slash-circle' : 'bi-check-circle'}"></i> ${domain.status ? '禁用' : '启用'}
                    </button>
                    <button class="btn btn-sm btn-danger delete-domain-btn" data-id="${domain.id}">
                        <i class="bi bi-trash"></i> 删除
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // 绑定按钮事件
        document.querySelectorAll('.toggle-domain-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleDomainStatus(btn.dataset.id));
        });

        document.querySelectorAll('.delete-domain-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteDomain(btn.dataset.id));
        });
    }

    // 切换域名状态
    static toggleDomainStatus(domainId) {
        const domains = Utils.getData('domains');
        const domainIndex = domains.findIndex(d => d.id === domainId);

        if (domainIndex !== -1) {
            domains[domainIndex].status = !domains[domainIndex].status;
            Utils.saveData('domains', domains);
            this.loadDomains();
            Utils.showToast('域名状态已更新');
        }
    }

    // 删除域名
    static deleteDomain(domainId) {
        if (!confirm('确定要删除这个域名吗？')) return;

        const domains = Utils.getData('domains');
        const domainIndex = domains.findIndex(d => d.id === domainId);

        if (domainIndex !== -1) {
            domains.splice(domainIndex, 1);
            Utils.saveData('domains', domains);
            this.loadDomains();
            Utils.showToast('域名已删除');
        }
    }

    // 添加域名
    static addDomain() {
        const domainName = document.getElementById('domainName').value.trim();
        const domainStatus = document.getElementById('domainStatus').checked;

        if (!domainName) {
            Utils.showToast('请输入域名', 'danger');
            return;
        }

        // 简单的域名格式验证
        if (!/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(domainName)) {
            Utils.showToast('请输入有效的域名', 'danger');
            return;
        }

        const domains = Utils.getData('domains');
        
        // 检查域名是否已存在
        if (domains.some(d => d.domain === domainName)) {
            Utils.showToast('域名已存在', 'danger');
            return;
        }

        // 添加新域名
        const newDomain = {
            id: Utils.generateRandomString(8),
            domain: domainName,
            status: domainStatus,
            addTime: Utils.getCurrentTimestamp()
        };

        domains.push(newDomain);
        Utils.saveData('domains', domains);

        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('addDomainModal'));
        modal.hide();

        // 刷新域名列表
        this.loadDomains();
        Utils.showToast('域名添加成功');
    }

    // 加载链接管理
    static loadLinks(page = 1, search = '') {
        let links = Utils.getData('links');
        
        // 搜索功能
        if (search) {
            const searchLower = search.toLowerCase();
            links = links.filter(link => 
                link.originalUrl.toLowerCase().includes(searchLower) || 
                link.generatedUrl.toLowerCase().includes(searchLower) ||
                link.username.toLowerCase().includes(searchLower)
            );
        }
        
        // 排序 - 最新的在前面
        links.sort((a, b) => b.createTime - a.createTime);
        
        // 分页
        const pageSize = 10;
        const totalPages = Math.ceil(links.length / pageSize);
        const paginatedLinks = links.slice((page - 1) * pageSize, page * pageSize);
        
        // 渲染表格
        const tbody = document.getElementById('allLinksTable');
        tbody.innerHTML = '';
        
        paginatedLinks.forEach(link => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="link-checkbox" value="${link.id}"></td>
                <td>${link.username}</td>
                <td class="text-truncate" style="max-width: 200px;" title="${link.originalUrl}">${link.originalUrl}</td>
                <td class="text-truncate" style="max-width: 150px;" title="${link.generatedUrl}">${link.generatedUrl}</td>
                <td>${Utils.formatDate(link.createTime)}</td>
                <td>
                    <span class="badge ${link.status ? 'bg-success' : 'bg-danger'}">
                        ${link.status ? '有效' : '禁用'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm ${link.status ? 'btn-warning' : 'btn-success'} toggle-link-btn" data-id="${link.id}">
                        <i class="bi ${link.status ? 'bi-slash-circle' : 'bi-check-circle'}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-link-btn" data-id="${link.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // 绑定按钮事件
        document.querySelectorAll('.toggle-link-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleLinkStatus(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-link-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteLink(btn.dataset.id));
        });
        
        // 渲染分页
        this.renderPagination('linksPagination', page, totalPages, (newPage) => {
            this.loadLinks(newPage, search);
        });
        
        // 更新全选复选框状态
        document.getElementById('selectAllLinks').checked = false;
        document.getElementById('selectAllLinks').addEventListener('change', (e) => {
            document.querySelectorAll('.link-checkbox').forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }
    
    // 切换链接状态
    static toggleLinkStatus(linkId) {
        const links = Utils.getData('links');
        const linkIndex = links.findIndex(l => l.id === linkId);
        
        if (linkIndex !== -1) {
            links[linkIndex].status = !links[linkIndex].status;
            Utils.saveData('links', links);
            this.loadLinks();
            Utils.showToast('链接状态已更新');
        }
    }
    
    // 删除链接
    static deleteLink(linkId) {
        if (!confirm('确定要删除这个链接吗？此操作不可撤销！')) return;
        
        const links = Utils.getData('links');
        const linkIndex = links.findIndex(l => l.id === linkId);
        
        if (linkIndex !== -1) {
            links.splice(linkIndex, 1);
            Utils.saveData('links', links);
            this.loadLinks();
            Utils.showToast('链接已删除');
        }
    }
    
    // 批量禁用链接
    static batchDisableLinks() {
        const selectedLinks = Array.from(document.querySelectorAll('.link-checkbox:checked')).map(cb => cb.value);
        
        if (selectedLinks.length === 0) {
            Utils.showToast('请至少选择一个链接', 'warning');
            return;
        }
        
        if (!confirm(`确定要禁用选中的 ${selectedLinks.length} 个链接吗？`)) return;
        
        const links = Utils.getData('links');
        let updatedCount = 0;
        
        selectedLinks.forEach(linkId => {
            const linkIndex = links.findIndex(l => l.id === linkId);
            if (linkIndex !== -1 && links[linkIndex].status) {
                links[linkIndex].status = false;
                updatedCount++;
            }
        });
        
        if (updatedCount > 0) {
            Utils.saveData('links', links);
            this.loadLinks();
            Utils.showToast(`已禁用 ${updatedCount} 个链接`);
        } else {
            Utils.showToast('没有链接被禁用', 'info');
        }
    }
    
    // 加载卡密管理
    static loadCards(page = 1, search = '', filter = 'all') {
        let cards = Utils.getData('cards');
        
        // 搜索功能
        if (search) {
            const searchLower = search.toLowerCase();
            cards = cards.filter(card => 
                card.key.toLowerCase().includes(searchLower) || 
                (card.usedBy && card.usedBy.toLowerCase().includes(searchLower))
            );
        }
        
        // 筛选功能
        if (filter === 'unused') {
            cards = cards.filter(card => !card.used);
        } else if (filter === 'used') {
            cards = cards.filter(card => card.used);
        }
        
        // 排序 - 最新的在前面
        cards.sort((a, b) => (b.generateTime || 0) - (a.generateTime || 0));
        
        // 分页
        const pageSize = 10;
        const totalPages = Math.ceil(cards.length / pageSize);
        const paginatedCards = cards.slice((page - 1) * pageSize, page * pageSize);
        
        // 渲染表格
        const tbody = document.getElementById('cardsTable');
        tbody.innerHTML = '';
        
        paginatedCards.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-truncate" style="max-width: 200px;" title="${card.key}">${card.key}</td>
                <td>
                    <span class="badge ${card.type === 'month' ? 'bg-primary' : 'bg-info'}">
                        ${card.type === 'month' ? '月卡' : `次卡 (${card.count}次)`}
                    </span>
                </td>
                <td>
                    <span class="badge ${card.used ? 'bg-success' : 'bg-secondary'}">
                        ${card.used ? '已使用' : '未使用'}
                    </span>
                </td>
                <td>${Utils.formatDate(card.generateTime)}</td>
                <td>${card.usedBy || '-'}</td>
                <td>${card.usedTime ? Utils.formatDate(card.usedTime) : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-card-btn" data-id="${card.key}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // 绑定按钮事件
        document.querySelectorAll('.delete-card-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteCard(btn.dataset.id));
        });
        
        // 渲染分页
        this.renderPagination('cardsPagination', page, totalPages, (newPage) => {
            this.loadCards(newPage, search, filter);
        });
    }
    
    // 删除卡密
    static deleteCard(cardKey) {
        if (!confirm('确定要删除这个卡密吗？此操作不可撤销！')) return;
        
        const cards = Utils.getData('cards');
        const cardIndex = cards.findIndex(c => c.key === cardKey);
        
        if (cardIndex !== -1) {
            cards.splice(cardIndex, 1);
            Utils.saveData('cards', cards);
            this.loadCards();
            Utils.showToast('卡密已删除');
        }
    }
    
    // 生成卡密
    static generateCards() {
        const cardType = document.getElementById('cardType').value;
        const cardCount = cardType === 'count' ? parseInt(document.getElementById('cardCount').value) : 0;
        const cardAmount = parseInt(document.getElementById('cardAmount').value);
        const cardPrefix = document.getElementById('cardPrefix').value.trim();
        
        if (cardAmount < 1 || cardAmount > 100) {
            Utils.showToast('生成数量应在1-100之间', 'danger');
            return;
        }
        
        if (cardType === 'count' && (cardCount < 1 || cardCount > 1000)) {
            Utils.showToast('使用次数应在1-1000之间', 'danger');
            return;
        }
        
        const config = Utils.getData('config');
        const cardLength = config.cardLength || 16;
        const cards = Utils.getData('cards');
        const newCards = [];
        const now = Utils.getCurrentTimestamp();
        
        for (let i = 0; i < cardAmount; i++) {
            let cardKey;
            let exists;
            
            // 确保卡密唯一
            do {
                cardKey = cardPrefix + Utils.generateRandomString(cardLength - cardPrefix.length);
                exists = cards.some(c => c.key === cardKey) || newCards.some(c => c.key === cardKey);
            } while (exists);
            
            newCards.push({
                key: cardKey,
                type: cardType,
                count: cardType === 'count' ? cardCount : 0,
                generateTime: now,
                used: false,
                usedBy: null,
                usedTime: null
            });
        }
        
        // 添加到卡密列表
        cards.push(...newCards);
        Utils.saveData('cards', cards);
        
        // 显示生成结果
        this.showGeneratedCards(newCards);
    }
    
    // 显示生成的卡密
    static showGeneratedCards(cards) {
        document.getElementById('generatedCardsCount').textContent = cards.length;
        
        const tbody = document.getElementById('generatedCardsTable');
        tbody.innerHTML = '';
        
        cards.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-truncate" style="max-width: 250px;" title="${card.key}">${card.key}</td>
                <td>${card.type === 'month' ? '月卡 (30天)' : `次卡 (${card.count}次)`}</td>
            `;
            tbody.appendChild(tr);
        });
        
        // 关闭生成模态框
        const generateModal = bootstrap.Modal.getInstance(document.getElementById('generateCardsModal'));
        generateModal.hide();
        
        // 显示结果模态框
        const resultModal = new bootstrap.Modal(document.getElementById('cardsResultModal'));
        resultModal.show();
    }
    
    // 复制所有卡密
    static copyAllCards() {
        const cards = Array.from(document.querySelectorAll('#generatedCardsTable td:first-child')).map(td => td.title);
        navigator.clipboard.writeText(cards.join('\n'))
            .then(() => Utils.showToast('已复制所有卡密到剪贴板'))
            .catch(() => Utils.showToast('复制失败', 'danger'));
    }
    
    // 导出卡密为TXT文件
    static exportCards() {
        const cards = Utils.getData('cards');
        const unusedCards = cards.filter(card => !card.used);
        
        if (unusedCards.length === 0) {
            Utils.showToast('没有可导出的未使用卡密', 'warning');
            return;
        }
        
        const cardText = unusedCards.map(card => 
            `${card.key} | ${card.type === 'month' ? '月卡 (30天)' : `次卡 (${card.count}次)`}`
        ).join('\n');
        
        const blob = new Blob([cardText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `卡密_${Utils.formatDate(new Date()).replace(/[: ]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 下载生成的卡密
    static downloadGeneratedCards() {
        const cards = Array.from(document.querySelectorAll('#generatedCardsTable td:first-child')).map(td => td.title);
        const cardText = cards.join('\n');
        
        const blob = new Blob([cardText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `生成卡密_${Utils.formatDate(new Date()).replace(/[: ]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 加载用户管理
    static loadUsers(page = 1, search = '') {
        let users = Utils.getData('users');
        
        // 搜索功能
        if (search) {
            const searchLower = search.toLowerCase();
            users = users.filter(user => 
                user.username.toLowerCase().includes(searchLower)
            );
        }
        
        // 排序 - 最新的在前面
        users.sort((a, b) => b.registerTime - a.registerTime);
        
        // 分页
        const pageSize = 10;
        const totalPages = Math.ceil(users.length / pageSize);
        const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);
        
        // 渲染表格
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = '';
        
        paginatedUsers.forEach(user => {
            const now = Utils.getCurrentTimestamp();
            const isVip = user.expireTime > now || user.remainingCount > 0;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    ${user.username}
                    ${user.username === 'admin' ? '<span class="badge bg-danger ms-1">管理员</span>' : ''}
                </td>
                <td>${Utils.formatDate(user.registerTime)}</td>
                <td>
                    <span class="badge ${isVip ? 'bg-success' : 'bg-secondary'}">
                        ${isVip ? 'VIP' : '免费'}
                    </span>
                </td>
                <td>${user.expireTime > now ? Utils.formatDate(user.expireTime) : '未开通'}</td>
                <td>${user.remainingCount}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}" ${user.username === 'admin' ? 'disabled' : ''}>
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // 绑定按钮事件
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', () => this.deleteUser(btn.dataset.id));
            }
        });
        
        // 渲染分页
        this.renderPagination('usersPagination', page, totalPages, (newPage) => {
            this.loadUsers(newPage, search);
        });
    }
    
    // 删除用户
    static deleteUser(userId) {
        if (!confirm('确定要删除这个用户吗？此操作将同时删除该用户生成的所有链接！')) return;
        
        const users = Utils.getData('users');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            const username = users[userIndex].username;
            
            // 删除用户
            users.splice(userIndex, 1);
            Utils.saveData('users', users);
            
            // 删除该用户生成的链接
            const links = Utils.getData('links');
            const userLinks = links.filter(l => l.userId === userId);
            
            if (userLinks.length > 0) {
                const remainingLinks = links.filter(l => l.userId !== userId);
                Utils.saveData('links', remainingLinks);
            }
            
            this.loadUsers();
            Utils.showToast(`用户 ${username} 已删除`);
        }
    }
    
    // 修改管理员密码
    static changeAdminPassword() {
        const currentPassword = document.getElementById('currentAdminPassword').value;
        const newPassword = document.getElementById('newAdminPassword').value;
        const confirmPassword = document.getElementById('confirmAdminPassword').value;
        
        if (newPassword !== confirmPassword) {
            Utils.showToast('两次输入的新密码不一致', 'danger');
            return;
        }
        
        if (newPassword.length < 6) {
            Utils.showToast('新密码长度至少6个字符', 'danger');
            return;
        }
        
        const config = Utils.getData('config');
        
        if (config.adminPassword !== currentPassword) {
            Utils.showToast('当前密码不正确', 'danger');
            return;
        }
        
        // 更新管理员密码
        config.adminPassword = newPassword;
        Utils.saveData('config', config);
        
        // 更新用户表中的管理员密码
        const users = Utils.getData('users');
        const adminUser = users.find(u => u.username === 'admin');
        
        if (adminUser) {
            adminUser.password = newPassword;
            Utils.saveData('users', users);
        }
        
        // 清空表单
        document.getElementById('currentAdminPassword').value = '';
        document.getElementById('newAdminPassword').value = '';
        document.getElementById('confirmAdminPassword').value = '';
        
        Utils.showToast('管理员密码已更新');
    }
    
    // 备份数据
    static backupData() {
        const dataToBackup = {
            users: Utils.getData('users'),
            domains: Utils.getData('domains'),
            links: Utils.getData('links'),
            cards: Utils.getData('cards'),
            config: Utils.getData('config')
        };
        
        const blob = new Blob([JSON.stringify(dataToBackup)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `数据备份_${Utils.formatDate(new Date()).replace(/[: ]/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 恢复数据
    static restoreData() {
        const fileInput = document.getElementById('restoreDataInput');
        fileInput.value = ''; // 清除之前的选择
        fileInput.click();
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!confirm('确定要恢复数据吗？这将覆盖当前所有数据！')) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // 验证数据格式
                    if (!data.users || !data.domains || !data.links || !data.cards || !data.config) {
                        throw new Error('数据格式不正确');
                    }
                    
                    // 保存恢复的数据
                    Utils.saveData('users', data.users);
                    Utils.saveData('domains', data.domains);
                    Utils.saveData('links', data.links);
                    Utils.saveData('cards', data.cards);
                    Utils.saveData('config', data.config);
                    
                    Utils.showToast('数据恢复成功，页面将刷新');
                    setTimeout(() => window.location.reload(), 1000);
                } catch (error) {
                    console.error(error);
                    Utils.showToast('数据恢复失败：文件格式不正确', 'danger');
                }
            };
            reader.readAsText(file);
        });
    }
    
    // 渲染分页
    static renderPagination(containerId, currentPage, totalPages, callback) {
        const pagination = document.getElementById(containerId);
        pagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // 上一页按钮
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#">上一页</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) callback(currentPage - 1);
        });
        pagination.appendChild(prevLi);
        
        // 页码按钮
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLi.addEventListener('click', (e) => {
                e.preventDefault();
                callback(i);
            });
            pagination.appendChild(pageLi);
        }
        
        // 下一页按钮
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#">下一页</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) callback(currentPage + 1);
        });
        pagination.appendChild(nextLi);
    }
    
    // 绑定事件
    static bindEvents() {
        // 标签页切换
        document.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-bs-target');
                this.currentTab = targetTab.replace('#', '').replace('Tab', '');
                
                // 加载对应标签页的内容
                switch (this.currentTab) {
                    case 'dashboard':
                        this.loadDashboard();
                        break;
                    case 'domains':
                        this.loadDomains();
                        break;
                    case 'links':
                        this.loadLinks();
                        break;
                    case 'cards':
                        this.loadCards();
                        break;
                    case 'users':
                        this.loadUsers();
                        break;
                }
            });
        });
        
        // 保存域名按钮
        document.getElementById('saveDomainBtn')?.addEventListener('click', () => {
            this.addDomain();
        });
        
        // 链接搜索按钮
        document.getElementById('linkSearchBtn')?.addEventListener('click', () => {
            const search = document.getElementById('linkSearchInput').value.trim();
            this.loadLinks(1, search);
        });
        
        // 链接搜索输入框回车事件
        document.getElementById('linkSearchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const search = document.getElementById('linkSearchInput').value.trim();
                this.loadLinks(1, search);
            }
        });
        
        // 批量禁用链接按钮
        document.getElementById('batchDisableLinksBtn')?.addEventListener('click', () => {
            this.batchDisableLinks();
        });
        
        // 卡密搜索按钮
        document.getElementById('cardSearchBtn')?.addEventListener('click', () => {
            const search = document.getElementById('cardSearchInput').value.trim();
            this.loadCards(1, search);
        });
        
        // 卡密搜索输入框回车事件
        document.getElementById('cardSearchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const search = document.getElementById('cardSearchInput').value.trim();
                this.loadCards(1, search);
            }
        });
        
        // 卡密筛选按钮
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                const search = document.getElementById('cardSearchInput').value.trim();
                this.loadCards(1, search, filter);
            });
        });
        
        // 生成卡密按钮
        document.getElementById('generateCardsBtn')?.addEventListener('click', () => {
            this.generateCards();
        });
        
        // 卡密类型切换
        document.getElementById('cardType')?.addEventListener('change', (e) => {
            document.getElementById('cardCountContainer').style.display = e.target.value === 'count' ? 'block' : 'none';
        });
        
        // 复制所有卡密按钮
        document.getElementById('copyAllCardsBtn')?.addEventListener('click', () => {
            this.copyAllCards();
        });
        
        // 下载卡密按钮
        document.getElementById('downloadCardsBtn')?.addEventListener('click', () => {
            this.downloadGeneratedCards();
        });
        
        // 导出卡密按钮
        document.getElementById('exportCardsBtn')?.addEventListener('click', () => {
            this.exportCards();
        });
        
        // 用户搜索按钮
        document.getElementById('userSearchBtn')?.addEventListener('click', () => {
            const search = document.getElementById('userSearchInput').value.trim();
            this.loadUsers(1, search);
        });
        
        // 用户搜索输入框回车事件
        document.getElementById('userSearchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const search = document.getElementById('userSearchInput').value.trim();
                this.loadUsers(1, search);
            }
        });
        
        // 修改管理员密码表单
        document.getElementById('changeAdminPasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changeAdminPassword();
        });
        
        // 备份数据按钮
        document.getElementById('backupDataBtn')?.addEventListener('click', () => {
            this.backupData();
        });
        
        // 恢复数据按钮
        document.getElementById('restoreDataBtn')?.addEventListener('click', () => {
            this.restoreData();
        });
    }
}

// 初始化管理员后台
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});
