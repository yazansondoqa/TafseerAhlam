/* ================================================================
   تسجيل Service Worker + زر تثبيت التطبيق (PWA)
   ================================================================ */
(function () {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("/sw.js").catch(function () {
                /* التسجيل غير متاح — لا يؤثر على عمل الموقع */
            });
        });
    }

    var deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    function showInstallButton() {
        if (document.getElementById("pwaInstallBtn")) return;
        var btn = document.createElement("button");
        btn.id = "pwaInstallBtn";
        btn.type = "button";
        btn.className = "pwa-install-btn";
        btn.textContent = "تثبيت التطبيق";
        btn.setAttribute("aria-label", "تثبيت الموقع كتطبيق على الجهاز");
        btn.addEventListener("click", function () {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function () {
                deferredPrompt = null;
                btn.remove();
            });
        });
        document.body.appendChild(btn);
    }

    window.addEventListener("appinstalled", function () {
        var btn = document.getElementById("pwaInstallBtn");
        if (btn) btn.remove();
        deferredPrompt = null;
    });
})();
