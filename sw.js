const CACHE_NAME = 'anti-redirect-v1';

// 安装时缓存关键文件
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll([
                '/',
                '/index.html',
                '/proxy.html'
            ]))
    );
});

// 拦截所有请求
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // 处理代理请求（如 /proxy/https://example.com）
    if (url.pathname.startsWith('/proxy/')) {
        event.respondWith(
            fetch(decodeURIComponent(url.pathname.slice(7)))
                .then(response => {
                    // 克隆响应以修改内容
                    const cloned = response.clone();
                    return cloned.text().then(html => {
                        // 替换所有相对路径为绝对路径
                        const processed = html
                            .replace(/href="\//g, `href="${url.origin}/`)
                            .replace(/src="\//g, `src="${url.origin}/`);
                        return new Response(processed, {
                            headers: response.headers
                        });
                    });
                })
                .catch(() => new Response('无法加载目标页面'))
        );
    } else {
        // 其他请求走缓存
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});

// 清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.map(key => 
                key !== CACHE_NAME && caches.delete(key)
            ))
        )
    );
});
