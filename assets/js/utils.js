// 复制文本到剪贴板
document.addEventListener('DOMContentLoaded', function() {
    // 复制按钮事件
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input) {
                input.select();
                document.execCommand('copy');
                
                // 显示复制成功提示
                const originalText = this.textContent;
                this.textContent = '已复制';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }
        });
    });
});

// 生成ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// 模拟保存数据到JSON文件
function saveData(filename, data) {
    // 注意：GitHub Pages实际上无法直接写入文件
    // 这里只是模拟，实际应用中需要使用其他存储方案
    console.log(`模拟保存数据到 ${filename}:`, data);
    return Promise.resolve();
}
