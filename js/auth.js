// 认证模块
class Auth {
    // 初始化
    static init() {
        this.currentUser = null;
        this.loadCurrentUser();
        this.bindEvents();
        this.updateUI();
    }

    // 绑定事件
    static bindEvents() {
        // 登录表单提交
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // 注册表单提交
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        // 退出按钮
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // 管理员退出按钮
        document.getElementById('adminLogoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    // 加载当前用户
    static loadCurrentUser() {
        const userData = sessionStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // 保存当前用户
    static saveCurrentUser() {
        if (this.currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }

    // 更新UI
    static updateUI() {
        // 主页面UI
        if (document.getElementById('loginNavItem')) {
            if (this.currentUser) {
                document.getElementById('loginNavItem').classList.add('d-none');
                document.getElementById('userNavItem').classList.remove('d-none');
                
                // 如果是管理员，显示管理员链接
                if (this.currentUser.username === 'admin') {
                    document.getElementById('adminLink').style.display = 'block';
                }
            } else {
                document.getElementById('loginNavItem').classList.remove('d-none');
                document.getElementById('userNavItem').classList.add('d-none');
                document.getElementById('adminLink').style.display = 'none';
            }
        }
    }

    // 登录
    static login() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = Utils.getData('users');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            this.updateUI();
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();

            Utils.showToast('登录成功');
            
            // 如果是管理员且当前是管理员页面，刷新页面
            if (this.currentUser.username === 'admin' && window.location.pathname.includes('admin.html')) {
                window.location.reload();
            }
            
            return true;
        } else {
            Utils.showToast('用户名或密码错误', 'danger');
            return false;
        }
    }

    // 注册
    static register() {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            Utils.showToast('两次密码不一致', 'danger');
            return false;
        }

        if (username.length < 3 || username.length > 20) {
            Utils.showToast('用户名长度应在3-20个字符之间', 'danger');
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

        // 添加新用户
        const newUser = {
            id: Utils.generateRandomString(16),
            username,
            password,
            registerTime: Utils.getCurrentTimestamp(),
            isAdmin: false,
            expireTime: 0, // 0表示未开通会员
            remainingCount: 0, // 剩余次数
            lastLoginTime: Utils.getCurrentTimestamp()
        };

        users.push(newUser);
        Utils.saveData('users', users);

        // 自动登录
        this.currentUser = newUser;
        this.saveCurrentUser();
        this.updateUI();

        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();

        Utils.showToast('注册成功');
        return true;
    }

    // 退出
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
            if (redirectToLogin) {
                window.location.href = 'index.html';
            }
            return false;
        }
        return true;
    }

    // 检查管理员权限
    static checkAdmin() {
        if (!this.checkLogin()) return false;
        
        if (this.currentUser.username !== 'admin') {
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    }

    // 检查会员状态
    static checkVip() {
        if (!this.checkLogin()) return false;
        
        const now = Utils.getCurrentTimestamp();
        if (this.currentUser.expireTime > now || this.currentUser.remainingCount > 0) {
            return true;
        }
        
        return false;
    }

    // 使用次数
    static useCount() {
        if (!this.checkLogin()) return false;
        
        if (this.currentUser.remainingCount > 0) {
            const users = Utils.getData('users');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].remainingCount--;
                Utils.saveData('users', users);
                
                // 更新当前用户信息
                this.currentUser.remainingCount--;
                this.saveCurrentUser();
                
                return true;
            }
        }
        
        return false;
    }
}

// 初始化认证模块
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});