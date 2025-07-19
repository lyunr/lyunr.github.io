const CACHE_NAME = 'proxy-v1';

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // 处理代理请求
    if (url.pathname.startsWith('/proxy/')) {
        event.respondWith(
            fetch(decodeURIComponent(url.pathname.slice(7)))
                .then(res => res.text())
                .then(html => {
                    // 替换所有相对路径为绝对路径
                    const processed = html
                        .replace(/href="\//g, `href="${url.origin}/`)
                        .replace(/src="\//g, `src="${url.origin}/`);
                    return new Response(processed, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
        );
    }
});
