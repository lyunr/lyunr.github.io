// 用户中心逻辑
class UserCenter {
    // 初始化
    static init() {
        if (!Auth.checkLogin()) return;

        this.loadUserInfo();
        this.loadUserLinks();
        this.bindEvents();
    }

    // 加载用户信息
    static loadUserInfo() {
        const user = Auth.currentUser;
        document.getElementById('usernameDisplay').textContent = user.username;

        // 更新会员状态
        const now = Utils.getCurrentTimestamp();
        if (user.expireTime > now) {
            document.getElementById('userStatus').textContent = 'VIP会员';
            document.getElementById('userStatus').className = 'badge bg-success';
            document.getElementById('expireDate').textContent = Utils.formatDate(user.expireTime);
        } else if (user.remainingCount > 0) {
            document.getElementById('userStatus').textContent = '次卡用户';
            document.getElementById('userStatus').className = 'badge bg-info';
            document.getElementById('expireDate').textContent = '按次使用';
        } else {
            document.getElementById('userStatus').textContent = '免费用户';
            document.getElementById('userStatus').className = 'badge bg-secondary';
            document.getElementById('expireDate').textContent = '未开通';
        }

        document.getElementById('remainingCount').textContent = user.remainingCount;
    }

    // 加载用户链接
    static loadUserLinks() {
        const links = Utils.getData('links')
            .filter(link => link.userId === Auth.currentUser.id)
            .sort((a, b) => b.createTime - a.createTime);

        const tbody = document.getElementById('linksTableBody');
        tbody.innerHTML = '';

        if (links.length === 0) {
            document.getElementById('noLinksMessage').classList.remove('d-none');
            document.getElementById('paginationNav').classList.add('d-none');
            return;
        }

        document.getElementById('noLinksMessage').classList.add('d-none');
        document.getElementById('paginationNav').classList.remove('d-none');

        links.forEach(link => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-truncate" style="max-width: 200px;" title="${link.originalUrl}">${link.originalUrl}</td>
                <td class="text-truncate" style="max-width: 150px;" title="${link.generatedUrl}">${link.generatedUrl}</td>
                <td>${Utils.formatDate(link.createTime)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-link-btn" data-id="${link.id}">
                        <i class="bi bi-eye"></i> 查看
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // 绑定查看按钮事件
        document.querySelectorAll('.view-link-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showLinkDetail(btn.dataset.id));
        });
    }

    // 显示链接详情
    static showLinkDetail(linkId) {
        const links = Utils.getData('links');
        const link = links.find(l => l.id === linkId);

        if (!link) return;

        document.getElementById('detailOriginalUrl').value = link.originalUrl;
        document.getElementById('detailGeneratedUrl').value = link.generatedUrl;
        document.getElementById('detailQrCode').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link.generatedUrl)}`;

        const modal = new bootstrap.Modal(document.getElementById('linkDetailModal'));
        modal.show();
    }

    // 绑定事件
    static bindEvents() {
        // 卡密兑换表单提交
        document.getElementById('redeemForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.redeemCard();
        });

        // 退出按钮
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }

    // 兑换卡密
    static redeemCard() {
        const cardKey = document.getElementById('cardKey').value.trim();
        const cards = Utils.getData('cards');
        const cardIndex = cards.findIndex(c => c.key === cardKey && !c.used);

        if (cardIndex === -1) {
            Utils.showToast('卡密无效或已被使用', 'danger');
            return;
        }

        const card = cards[cardIndex];
        const users = Utils.getData('users');
        const userIndex = users.findIndex(u => u.id === Auth.currentUser.id);

        if (userIndex === -1) {
            Utils.showToast('用户不存在', 'danger');
            return;
        }

        const now = Utils.getCurrentTimestamp();

        // 根据卡密类型更新用户信息
        if (card.type === 'month') {
            // 月卡 - 延长到期时间
            const currentExpire = users[userIndex].expireTime > now ? users[userIndex].expireTime : now;
            users[userIndex].expireTime = Utils.addDays(currentExpire, 30).getTime();
            users[userIndex].remainingCount = 0;
        } else if (card.type === 'count') {
            // 次卡 - 增加剩余次数
            users[userIndex].remainingCount += card.count;
            // 如果用户是月卡且未过期，不修改到期时间
            if (users[userIndex].expireTime < now) {
                users[userIndex].expireTime = 0;
            }
        }

        // 标记卡密为已使用
        cards[cardIndex].used = true;
        cards[cardIndex].usedBy = Auth.currentUser.username;
        cards[cardIndex].usedTime = now;

        // 保存数据
        Utils.saveData('cards', cards);
        Utils.saveData('users', users);

        // 更新当前用户信息
        Auth.currentUser = users[userIndex];
        Auth.saveCurrentUser();

        // 更新UI
        this.loadUserInfo();
        document.getElementById('cardKey').value = '';

        Utils.showToast('卡密兑换成功');
    }
}

// 初始化用户中心
document.addEventListener('DOMContentLoaded', () => {
    UserCenter.init();
});