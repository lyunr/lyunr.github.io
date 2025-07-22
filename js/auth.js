// 认证模块
class Auth {
    // 初始化认证系统
    static init() {
        this.currentUser = null;
        this.loadCurrentUser();
        this.bindEvents();
        this.updateUI();
    }

    // 绑定所有事件监听器
    static bindEvents() {
        // 登录表单提交
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // 注册表单提交
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.register();
            });
        }

        // 退出按钮
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // 管理员退出按钮
        const adminLogoutBtn = document.getElementById('adminLogoutBtn');
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // 从sessionStorage加载当前用户
    static loadCurrentUser() {
        const userData = sessionStorage.getItem('currentUser');
        try {
            this.currentUser = userData ? JSON.parse(userData) : null;
        } catch (e) {
            console.error("解析用户数据失败:", e);
            this.currentUser = null;
        }
    }

    // 保存当前用户到sessionStorage
    static saveCurrentUser() {
        if (this.currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }

    // 更新UI显示状态
    static updateUI() {
        const loginNavItem = document.getElementById('loginNavItem');
        const userNavItem = document.getElementById('userNavItem');
        const adminLink = document.getElementById('adminLink');

        if (loginNavItem && userNavItem && adminLink) {
            if (this.currentUser) {
                loginNavItem.classList.add('d-none');
                userNavItem.classList.remove('d-none');
                
                // 仅管理员显示后台入口
                adminLink.style.display = this.currentUser.username === 'admin' ? 'block' : 'none';
            } else {
                loginNavItem.classList.remove('d-none');
                userNavItem.classList.add('d-none');
                adminLink.style.display = 'none';
            }
        }
    }

    // 处理用户登录
    static login() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            Utils.showToast('请输入用户名和密码', 'danger');
            return false;
        }

        const users = Utils.getData('users');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            this.updateUI();
            
            // 关闭登录模态框
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
            }
            
            Utils.showToast(`欢迎回来，${username}`);
            return true;
        } else {
            Utils.showToast('用户名或密码错误', 'danger');
            return false;
        }
    }

    // 处理用户注册
    static register() {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 验证输入
        if (!username || !password || !confirmPassword) {
            Utils.showToast('请填写所有字段', 'danger');
            return false;
        }

        if (password !== confirmPassword) {
            Utils.showToast('两次输入的密码不一致', 'danger');
            return false;
        }

        if (username.length < 3 || username.length > 20) {
            Utils.showToast('用户名长度需在3-20个字符之间', 'danger');
            return false;
        }

        if (password.length < 6) {
            Utils.showToast('密码长度至少6个字符', 'danger');
            return false;
        }

        const users = Utils.getData('users');
        
        // 检查用户名是否已存在
        if (users.some(u => u.username === username)) {
            Utils.showToast('用户名已存在', 'danger');
            return false;
        }

        // 创建新用户
        const newUser = {
            id: Utils.generateRandomString(16),
            username,
            password,
            registerTime: Utils.getCurrentTimestamp(),
            isAdmin: false,
            expireTime: 0,
            remainingCount: 0,
            lastLoginTime: Utils.getCurrentTimestamp()
        };

        users.push(newUser);
        Utils.saveData('users', users);

        // 自动登录
        this.currentUser = newUser;
        this.saveCurrentUser();
        this.updateUI();

        // 关闭注册模态框
        const registerModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (registerModal) {
            registerModal.hide();
        }

        Utils.showToast('注册成功！');
        return true;
    }

    // 处理用户退出
    static logout() {
        this.currentUser = null;
        this.saveCurrentUser();
        this.updateUI();
        
        // 如果是管理员页面，跳转到首页
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        } else {
            window.location.reload();
        }
    }

    // 检查登录状态
    static checkLogin(redirectToLogin = true) {
        if (!this.currentUser) {
            if (redirectToLogin && !window.location.pathname.includes('admin.html')) {
                window.location.href = 'index.html';
            }
            return false;
        }
        return true;
    }

    // 检查管理员权限（修改后无跳转）
    static checkAdmin() {
        return (
            this.currentUser && 
            this.currentUser.username === 'admin'
        );
    }

    // 检查VIP状态
    static checkVip() {
        if (!this.checkLogin(false)) return false;
        
        const now = Utils.getCurrentTimestamp();
        return this.currentUser.expireTime > now || this.currentUser.remainingCount > 0;
    }

    // 使用次数（次卡用户）
    static useCount() {
        if (!this.checkVip()) return false;
        
        const users = Utils.getData('users');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1 && users[userIndex].remainingCount > 0) {
            users[userIndex].remainingCount--;
            Utils.saveData('users', users);
            
            // 更新当前用户数据
            this.currentUser.remainingCount--;
            this.saveCurrentUser();
            
            return true;
        }
        return false;
    }
}

// 初始化认证系统
if (typeof bootstrap !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        Auth.init();
    });
}
