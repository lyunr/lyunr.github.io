// 工具函数集合
class Utils {
    // 初始化数据文件
    static initDataFiles() {
        const dataFiles = {
            'users': [],
            'domains': [],
            'links': [],
            'cards': [],
            'config': {
                adminPassword: 'admin123', // 默认管理员密码
                cardLength: 16 // 卡密长度
            }
        };

        for (const [fileName, defaultData] of Object.entries(dataFiles)) {
            if (!localStorage.getItem(fileName)) {
                localStorage.setItem(fileName, JSON.stringify(defaultData));
            }
        }
    }

    // 获取数据
    static getData(fileName) {
        const data = localStorage.getItem(fileName);
        return data ? JSON.parse(data) : null;
    }

    // 保存数据
    static saveData(fileName, data) {
        localStorage.setItem(fileName, JSON.stringify(data));
    }

    // Base64编码
    static base64Encode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));
    }

    // Base64解码
    static base64Decode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    // 生成随机字符串
    static generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 格式化日期
    static formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }

    // 添加天数到日期
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    // 验证URL
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 获取当前时间戳
    static getCurrentTimestamp() {
        return new Date().getTime();
    }

    // 显示Toast消息
    static showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer') || (() => {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
            return container;
        })();

        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
        toast.role = 'alert';
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.style.marginBottom = '10px';

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// 初始化数据文件
Utils.initDataFiles();