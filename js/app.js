/* ================================================================
   فسر حلمك — أدوات الواجهة العامة
   ----------------------------------------------------------------
   هذا الملف لا يحمّل أي إعلانات ولا يعتمد على قاعدة بيانات الرموز.
   صفحات الموقع الثابتة تحتاجه فقط للقائمة والوصول إلى الأعلى.
   ================================================================ */

/** إزالة التشكيل وتوحيد الهمزات والألف والتاء المربوطة لتسهيل البحث */
function normalizeArabic(text) {
    if (!text) return "";
    return String(text)
        .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

/** ترميز آمن للنص قبل إدراجه في HTML */
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/** فتح/إغلاق قائمة الجوال */
function toggleMenu() {
    const links = document.getElementById("navLinks");
    if (!links) return;
    const open = links.classList.toggle("show");
    document.querySelectorAll(".mobile-menu-btn").forEach(function (b) {
        b.setAttribute("aria-expanded", open ? "true" : "false");
    });
}

/** زر العودة إلى الأعلى */
function setupBackToTop() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
        btn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/** تعبئة العناصر المشتركة (عدّاد الرموز وسنة الحقوق) */
function hydrateCommonElements() {
    const statEl = document.getElementById("statSymbols");
    if (statEl) {
        const count = (window.siteIndex && window.siteIndex.count) ? window.siteIndex.count : 176;
        statEl.textContent = count;
    }
    const yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = "2026";
}

document.addEventListener("DOMContentLoaded", function () {
    hydrateCommonElements();
    setupBackToTop();
});
