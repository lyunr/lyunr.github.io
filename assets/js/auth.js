// 用户认证相关功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户是否已登录
    checkLoginStatus();
    
    // 登录表单提交
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            loginUser(username, password);
        });
    }
    
    // 注册表单提交
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }
            
            registerUser(username, password);
        });
    }
    
    // 退出按钮
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            logoutUser();
        });
    }
});

// 检查登录状态
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPath = window.location.pathname.split('/').pop();
    
    // 如果在登录/注册页但已登录，重定向到仪表盘
    if ((currentPath === 'index.html' || currentPath === 'register.html') && currentUser) {
        window.location.href = 'dashboard.html';
    }
    // 如果在需要登录的页面但未登录，重定向到登录页
    else if ((currentPath === 'dashboard.html' || currentPath === 'generate.html' || currentPath === 'admin.html') && !currentUser) {
        window.location.href = 'index.html';
    }
    // 如果在后台管理页但不是管理员，重定向到仪表盘
    else if (currentPath === 'admin.html' && currentUser && !currentUser.isAdmin) {
        window.location.href = 'dashboard.html';
    }
    // 显示当前用户名
    else if (currentUser && document.getElementById('usernameDisplay')) {
        document.getElementById('usernameDisplay').textContent = currentUser.username;
    }
}

// 用户登录
function loginUser(username, password) {
    fetch('data/users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // 存储当前用户信息
                localStorage.setItem('currentUser', JSON.stringify(user));
                // 重定向到仪表盘
                window.location.href = 'dashboard.html';
            } else {
                alert('用户名或密码错误');
            }
        })
        .catch(error => {
            console.error('登录失败:', error);
            alert('登录失败，请稍后再试');
        });
}

// 用户注册
function registerUser(username, password) {
    fetch('data/users.json')
        .then(response => response.json())
        .then(users => {
            // 检查用户名是否已存在
            if (users.some(u => u.username === username)) {
                alert('用户名已存在');
                return;
            }
            
            // 创建新用户
            const newUser = {
                id: generateId(),
                username: username,
                password: password,
                isAdmin: false,
                memberType: 'free',
                expiryDate: null,
                remainingCount: 0,
                createdAt: new Date().toISOString()
            };
            
            // 添加新用户到列表
            users.push(newUser);
            
            // 保存更新后的用户列表
            return saveData('users.json', users);
        })
        .then(() => {
            alert('注册成功，请登录');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('注册失败:', error);
            alert('注册失败，请稍后再试');
        });
}

// 用户退出
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// 生成ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// 保存数据到JSON文件（模拟）
function saveData(filename, data) {
    // 注意：GitHub Pages实际上无法直接写入文件
    // 这里只是模拟，实际应用中需要使用其他存储方案
    console.log(`模拟保存数据到 ${filename}:`, data);
    return Promise.resolve();
}
