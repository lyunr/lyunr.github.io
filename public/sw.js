const CACHE_NAME = 'proxy-cache-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(['/proxy.html']))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 处理代理请求
  if (url.pathname.startsWith('/proxy/')) {
    event.respondWith(
      fetch(decodeURIComponent(url.pathname.slice(7)))
        .then(res => res.text())
        .then(html => new Response(html, {
          headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store'
          }
        }))
    );
  } else {
    event.respondWith(
      caches.match(event.request) || fetch(event.request)
    );
  }
});