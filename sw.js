// 文件名：sw.js
const CACHE_NAME = 'page-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add('/proxy.html'))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 拦截特定路径的请求
  if (url.pathname.startsWith('/proxy/')) {
    event.respondWith(
      fetch(decodeURIComponent(url.pathname.slice(7)))
        .then(response => response.text())
        .then(html => {
          // 动态修改所有链接和资源路径
          const processed = html
            .replace(/href="\//g, `href="${url.origin}/`)
            .replace(/src="\//g, `src="${url.origin}/`);
          return new Response(processed, {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
