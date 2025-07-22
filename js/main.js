// 主页面逻辑
class Main {
    // 初始化
    static init() {
        this.bindEvents();
    }

    // 绑定事件
    static bindEvents() {
        // 生成表单提交
        document.getElementById('generateForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateLink();
        });

        // 复制链接按钮
        document.getElementById('copyLinkBtn')?.addEventListener('click', () => {
            this.copyToClipboard('generatedLink');
        });

        // 复制详情链接按钮
        document.getElementById('copyDetailLinkBtn')?.addEventListener('click', () => {
            this.copyToClipboard('detailGeneratedUrl');
        });
    }

    // 生成链接
    static generateLink() {
        if (!Auth.checkLogin()) {
            // 显示登录模态框
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
            return;
        }

        // 检查会员状态
        if (!Auth.checkVip()) {
            Utils.showToast('请先开通会员或使用卡密兑换', 'warning');
            return;
        }

        const targetUrl = document.getElementById('targetUrl').value.trim();
        const enableAntiRed = document.getElementById('antiRedSwitch').checked;

        if (!Utils.isValidUrl(targetUrl)) {
            Utils.showToast('请输入有效的URL', 'danger');
            return;
        }

        // 生成链接
        let generatedUrl = targetUrl;
        let antiRedDomain = '';

        if (enableAntiRed) {
            const domains = Utils.getData('domains').filter(d => d.status);
            if (domains.length > 0) {
                // 随机选择一个防红域名
                const randomDomain = domains[Math.floor(Math.random() * domains.length)];
                antiRedDomain = randomDomain.domain;
                
                // 生成防红链接
                const encodedUrl = Utils.base64Encode(targetUrl);
                generatedUrl = `https://${antiRedDomain}/?c=${encodedUrl}`;
            } else {
                Utils.showToast('没有可用的防红域名，已生成原始链接', 'warning');
            }
        }

        // 生成微信跳转链接
        const linkId = Utils.generateRandomString(8);
        const weixinRedirectUrl = `${window.location.origin}/templates/weixin-redirect.html?url=${encodeURIComponent(generatedUrl)}`;

        // 保存链接记录
        const links = Utils.getData('links');
        const newLink = {
            id: linkId,
            userId: Auth.currentUser.id,
            username: Auth.currentUser.username,
            originalUrl: targetUrl,
            generatedUrl: weixinRedirectUrl,
            antiRedDomain: antiRedDomain,
            createTime: Utils.getCurrentTimestamp(),
            status: true // 链接状态，true为有效
        };

        links.push(newLink);
        Utils.saveData('links', links);

        // 减少用户剩余次数（如果不是月卡用户）
        if (Auth.currentUser.expireTime < Utils.getCurrentTimestamp()) {
            Auth.useCount();
        }

        // 显示结果
        document.getElementById('generatedLink').value = weixinRedirectUrl;
        document.getElementById('qrCodeImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(weixinRedirectUrl)}`;
        document.getElementById('resultContainer').classList.remove('d-none');

        Utils.showToast('链接生成成功');
    }

    // 复制到剪贴板
    static copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        element.select();
        element.setSelectionRange(0, 99999);
        document.execCommand('copy');
        
        // 显示提示
        const originalText = element.value;
        element.value = '已复制到剪贴板！';
        setTimeout(() => {
            element.value = originalText;
        }, 1000);
        
        Utils.showToast('已复制到剪贴板');
    }
}

// 初始化主页面
document.addEventListener('DOMContentLoaded', () => {
    Main.init();
});