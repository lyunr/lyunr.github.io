// 认证模块
class Auth {
    static init() {
        this.currentUser = null;
        this.loadCurrentUser();
        this.bindEvents();
        this.updateUI();
    }

    static bindEvents() {
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    static loadCurrentUser() {
        const userData = sessionStorage.getItem('currentUser');
        this.currentUser = userData ? JSON.parse(userData) : null;
    }

    static saveCurrentUser() {
        if (this.currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }

    static updateUI() {
        if (!document.getElementById('loginNavItem')) return;
        
        const loginItem = document.getElementById('loginNavItem');
        const userItem = document.getElementById('userNavItem');
        
        if (this.currentUser) {
            loginItem.classList.add('d-none');
            userItem.classList.remove('d-none');
        } else {
            loginItem.classList.remove('d-none');
            userItem.classList.add('d-none');
        }
    }

    static login() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = Utils.getData('users');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            this.updateUI();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            
            Utils.showToast('登录成功');
            return true;
        } else {
            Utils.showToast('用户名或密码错误', 'danger');
            return false;
        }
    }

    static register() {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            Utils.showToast('两次密码不一致', 'danger');
            return false;
        }

        const users = Utils.getData('users');
        
        if (users.some(u => u.username === username)) {
            Utils.showToast('用户名已存在', 'danger');
            return false;
        }

        const newUser = {
            id: Utils.generateRandomString(16),
            username,
            password,
            registerTime: Utils.getCurrentTimestamp(),
            isAdmin: false,
            expireTime: 0,
            remainingCount: 0
        };

        users.push(newUser);
        Utils.saveData('users', users);

        this.currentUser = newUser;
        this.saveCurrentUser();
        this.updateUI();

        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();

        Utils.showToast('注册成功');
        return true;
    }

    static logout() {
        this.currentUser = null;
        this.saveCurrentUser();
        this.updateUI();
        window.location.reload();
    }

    static checkLogin() {
        return !!this.currentUser;
    }

    static checkAdmin() {
        return (
            this.currentUser && 
            this.currentUser.username === 'admin'
        );
    }

    static checkVip() {
        if (!this.checkLogin()) return false;
        const now = Utils.getCurrentTimestamp();
        return this.currentUser.expireTime > now || this.currentUser.remainingCount > 0;
    }

    static useCount() {
        if (!this.checkVip()) return false;
        
        const users = Utils.getData('users');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].remainingCount--;
            Utils.saveData('users', users);
            this.currentUser.remainingCount--;
            this.saveCurrentUser();
            return true;
        }
        return false;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
