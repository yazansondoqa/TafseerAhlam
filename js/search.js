/* ================================================================
   موقع تفسير الأحلام — محرك البحث الفوري
   ملف: js/search.js
   ----------------------------------------------------------------
   مزايا هذه النسخة:
   - تطبيع الحروف العربية: البحث عن "اسد" يجد "أسد"، و"شجره" يجد "شجرة".
   - نتائج على شكل روابط حقيقية (أفضل لمحركات البحث وإمكانية الوصول).
   - ترتيب ذكي: مطابقة أول الكلمة أولاً ثم الاحتواء.
   - تنقّل بالأسهم بين النتائج.
   ================================================================ */

/** تطبيع نص للبحث (يعتمد على normalizeArabic من app.js) */
function searchKey(text) {
    return normalizeArabic(text);
}

/**
 * البحث في قاعدة البيانات.
 * @param {string} query نص البحث
 * @param {number} limit أقصى عدد نتائج
 */
function searchInDatabase(query, limit) {
    const max = limit || 12;
    const q = searchKey(query);
    if (!q) return [];

    const scored = [];

    for (const [word, data] of Object.entries(dreamDatabase)) {
        const key = searchKey(word);
        let score = -1;

        if (key === q) {
            score = 100;                 // مطابقة تامة
        } else if (key.startsWith(q)) {
            score = 80 - (key.length - q.length); // تبدأ بالنص
        } else if (key.includes(q)) {
            score = 50 - key.indexOf(q);          // تحتوي النص
        } else {
            // مطابقة كلمات التفسير (بحث ثانوي داخل النصوص)
            const inText = Object.values(data.interpretations || {})
                .some(t => searchKey(t).includes(q));
            if (inText) score = 10;
        }

        if (score >= 0) {
            scored.push({
                word,
                letter: data.letter,
                count: Object.keys(data.interpretations || {}).length,
                score
            });
        }
    }

    return scored
        .sort((a, b) => (b.score - a.score) || a.word.localeCompare(b.word, "ar"))
        .slice(0, max);
}

/** توجيه المستخدم إلى صفحة الرمز */
function goToSymbol(word) {
    window.location.href = "letter?symbol=" + encodeURIComponent(word);
}

/** بناء HTML لنتيجة بحث كرابط (يعمل بلوحة المفاتيح) */
function resultItemHtml(r, index) {
    return '<a class="result-item" id="search-result-' + index + '" role="option"' +
        ' href="letter?symbol=' + encodeURIComponent(r.word) + '">' +
        "<span>" + escapeHtml(r.word) + "</span>" +
        '<span class="badge">' + r.count + " تفسير</span></a>";
}

/** البحث الفوري أثناء الكتابة */
function liveSearch(query) {
    const resultsContainer = document.getElementById("searchResults");
    if (!resultsContainer) return;

    const input = document.getElementById("mainSearch");
    if (input) input.setAttribute("aria-expanded", query && query.length >= 2 ? "true" : "false");

    if (!query || searchKey(query).length < 2) {
        resultsContainer.innerHTML = "";
        return;
    }

    const results = searchInDatabase(query);

    if (results.length === 0) {
        resultsContainer.innerHTML =
            '<div class="no-result" role="status">لا توجد نتائج مطابقة لبحثك. جرّب كلمة أخرى مثل: أسد، بحر، مفتاح.</div>';
        return;
    }

    resultsContainer.innerHTML = results
        .map((r, i) => resultItemHtml(r, i))
        .join("");
}

/** تنفيذ البحث عند الضغط على زر البحث أو Enter */
function performSearch() {
    const input = document.getElementById("mainSearch");
    if (!input) return;
    const q = input.value.trim();
    if (searchKey(q).length < 2) {
        input.focus();
        return;
    }
    const results = searchInDatabase(q);
    if (results.length > 0) {
        goToSymbol(results[0].word);
    } else {
        liveSearch(q); // إظهار رسالة "لا توجد نتائج"
    }
}

/* ----------------------------------------------------------------
   ربط أحداث البحث (كتابة فورية + Enter + أسهم لوحة المفاتيح)
   ---------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("mainSearch");
    if (!input) return;

    let debounce;
    input.addEventListener("input", function () {
        clearTimeout(debounce);
        debounce = setTimeout(() => liveSearch(input.value), 160);
    });

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        } else if (e.key === "ArrowDown") {
            const first = document.querySelector("#searchResults .result-item");
            if (first) { e.preventDefault(); first.focus(); }
        } else if (e.key === "Escape") {
            const box = document.getElementById("searchResults");
            if (box) box.innerHTML = "";
        }
    });

    // إغلاق النتائج عند النقر خارجها
    document.addEventListener("click", function (e) {
        const box = document.getElementById("searchResults");
        if (!box) return;
        if (!box.contains(e.target) && e.target !== input) box.innerHTML = "";
    });
});
