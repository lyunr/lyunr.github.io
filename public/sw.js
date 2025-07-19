const CACHE_NAME = 'anti-block-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(['/proxy.html']))
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // 代理请求处理
  if (url.pathname.startsWith('/proxy/')) {
    e.respondWith(
      fetch(decodeURIComponent(url.pathname.slice(7)))
        .then(res => res.text())
        .then(html => {
          // 替换资源路径防止泄露真实域名
          return new Response(
            html.replace(/src="\//g, 'src="https://lyunr.github.io/'),
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
  }
});
