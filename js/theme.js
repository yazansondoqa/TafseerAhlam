
/* ----------------------------------------------------------------
   16) الوضع الداكن — زر تبديل + تذكّر الاختيار
   ---------------------------------------------------------------- */
(function () {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
    }
})();

function toggleTheme() {
    var root = document.documentElement;
    var isDark = root.getAttribute("data-theme") === "dark";
    var next = isDark ? "light" : "dark";
    if (next === "light") {
        root.removeAttribute("data-theme");
    } else {
        root.setAttribute("data-theme", "dark");
    }
    try { localStorage.setItem("theme", next); } catch (e) {}
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
        btn.textContent = next === "dark" ? "☀️" : "🌙";
        btn.setAttribute("aria-label", next === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن");
    }
}

function setupThemeToggle() {
    var nav = document.querySelector(".navbar");
    if (!nav || document.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.textContent = isDark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن");
    btn.setAttribute("title", "تبديل الوضع الداكن");
    btn.addEventListener("click", toggleTheme);
    var menuBtn = nav.querySelector(".mobile-menu-btn");
    if (menuBtn) {
        nav.insertBefore(btn, menuBtn);
    } else {
        nav.appendChild(btn);
    }
}

document.addEventListener("DOMContentLoaded", setupThemeToggle);
