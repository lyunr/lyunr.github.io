// 工具类
class Utils {
    static initDataFiles() {
        // 检查是否已经初始化过
        if (localStorage.getItem('_initialized') === 'true') {
            return;
        }

        const defaultData = {
            'users': [{
                id: 'admin-default',
                username: 'admin',
                password: 'admin123',
                registerTime: Date.now(),
                isAdmin: true,
                expireTime: 0,
                remainingCount: 0
            }],
            'domains': [],
            'links': [],
            'cards': [],
            'config': {
                adminPassword: 'admin123',
                cardLength: 16,
                version: '1.0.1'
            }
        };

        Object.entries(defaultData).forEach(([key, value]) => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        });

        // 标记已初始化
        localStorage.setItem('_initialized', 'true');
    }

    // 获取数据
    static getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : (Array.isArray(defaultData[key]) ? [] : {});
        } catch (e) {
            console.error(`解析${key}数据失败:`, e);
            return Array.isArray(defaultData[key]) ? [] : {};
        }
    }

    // 保存数据
    static saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`保存${key}数据失败:`, e);
            return false;
        }
    }

    // Base64编码
    static base64Encode(str) {
        try {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
                return String.fromCharCode(parseInt(p1, 16));
            }));
        } catch (e) {
            console.error("Base64编码失败:", e);
            return '';
        }
    }

    // Base64解码
    static base64Decode(str) {
        try {
            return decodeURIComponent(atob(str).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            console.error("Base64解码失败:", e);
            return '';
        }
    }

    // 生成随机字符串
    static generateRandomString(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 格式化日期
    static formatDate(timestamp) {
        if (!timestamp || isNaN(timestamp)) return '未知时间';
        
        try {
            const date = new Date(parseInt(timestamp));
            if (isNaN(date.getTime())) return '无效日期';
            
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } catch (e) {
            console.error("日期格式化失败:", e);
            return '日期错误';
        }
    }

    // 获取当前时间戳
    static getCurrentTimestamp() {
        return new Date().getTime();
    }

    // 显示Toast通知
    static showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer') || (() => {
            const div = document.createElement('div');
            div.id = 'toastContainer';
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.right = '20px';
            div.style.zIndex = '9999';
            document.body.appendChild(div);
            return div;
        })();

        const toast = document.createElement('div');
        toast.className = `toast show align-items-center text-white bg-${type}`;
        toast.style.marginBottom = '10px';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        container.appendChild(toast);
        
        // 自动移除Toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 验证URL格式
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 添加天数到日期
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    // 简单加密（用于密码存储）
    static encrypt(str, salt = 'SALT_123') {
        try {
            return btoa(encodeURIComponent(str + salt).split('').reverse().join(''));
        } catch (e) {
            console.error("加密失败:", e);
            return str;
        }
    }

    // 简单解密
    static decrypt(encryptedStr, salt = 'SALT_123') {
        try {
            const decoded = atob(encryptedStr).split('').reverse().join('');
            return decodeURIComponent(decoded).replace(salt, '');
        } catch (e) {
            console.error("解密失败:", e);
            return encryptedStr;
        }
    }
}

// 初始化数据文件
Utils.initDataFiles();
