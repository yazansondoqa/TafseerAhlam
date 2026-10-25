/* ================================================================
   شريط بحث لاصق للجوال — يظهر أسفل الشاشة على الشاشات الصغيرة
   يوجّه البحث إلى الصفحة الرئيسية ثم يعرض النتائج فوراً.
   ================================================================ */
(function () {
    function init() {
        if (document.querySelector(".mobile-search-bar")) return;
        if (document.getElementById("mainSearch")) return; // الرئيسية فيها بحث بالفعل

        var form = document.createElement("form");
        form.className = "mobile-search-bar";
        form.setAttribute("role", "search");
        form.setAttribute("aria-label", "بحث سريع عن رمز");
        form.innerHTML =
            '<input type="search" name="q" placeholder="ابحث عن رمز في المنام..." ' +
            'autocomplete="off" aria-label="ابحث عن رمز في المنام">' +
            '<button type="submit" aria-label="ابحث">بحث</button>';

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var input = form.querySelector("input");
            var q = (input && input.value || "").trim();
            if (q.length < 2) {
                if (input) input.focus();
                return;
            }
            window.location.href = "/?q=" + encodeURIComponent(q);
        });

        document.body.appendChild(form);
        document.body.classList.add("has-mobile-search");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
