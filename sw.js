/* ================================================================
   فسر حلمك — Service Worker
   استراتيجية:
   - صفحات HTML: الشبكة أولاً ثم النسخة المخزّنة (حتى تظهر التحديثات).
   - الأصول الثابتة (CSS/JS/صور/خطوط): النسخة المخزّنة أولاً.
   - عند انقطاع الشبكة: صفحة رئيسية مخزّنة كبديل.
   ================================================================ */

const CACHE_NAME = "tafseer-ahlam-v1";
const OFFLINE_URL = "/index.html";

const PRECACHE = [
    "/",
    "/index.html",
    "/letter",
    "/articles",
    "/categories",
    "/css/style.css",
    "/css/responsive.css",
    "/css/features.css",
    "/js/config.js",
    "/js/app.js",
    "/js/search.js",
    "/js/bookmark_feature.js",
    "/js/theme.js",
    "/js/mobile_search.js",
    "/js/data.js",
    "/js/data_extra.js",
    "/js/data_v2.js",
    "/js/data_v3.js",
    "/manifest.json",
    "/assets/icon-192.png",
    "/assets/icon-512.png",
    "/assets/favicon.svg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE).catch(() => null))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    // صفحات HTML: الشبكة أولاً
    const acceptsHtml = req.headers.get("accept") && req.headers.get("accept").includes("text/html");
    if (acceptsHtml || url.pathname.endsWith(".html")) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
                    return res;
                })
                .catch(() => caches.match(req).then((cached) => cached || caches.match(OFFLINE_URL)))
        );
        return;
    }

    // أصول ثابتة: المخزّن أولاً
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req).then((res) => {
                if (res && res.status === 200 && res.type === "basic") {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
                }
                return res;
            });
        })
    );
});
