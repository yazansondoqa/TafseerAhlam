/* ================================================================
   فسر حلمك — البحث الفوري في فهرس الرموز الثابت
   الملف: js/search.js
   ----------------------------------------------------------------
   يعتمد على js/site-index.js الذي يُولَّد مع الصفحات الثابتة.
   لا يحتاج إلى تحميل قاعدة البيانات الكاملة في المتصفح.
   ================================================================ */

function searchKey(text) {
    return normalizeArabic(text);
}

/** إرجاع جميع مدخلات البحث من الفهرس الثابت */
function searchEntries() {
    if (!window.siteIndex || !window.siteIndex.symbols) return [];
    return Object.keys(window.siteIndex.symbols).map(function (word) {
        const entry = window.siteIndex.symbols[word];
        return {
            word: word,
            url: entry.url,
            letter: entry.letter,
            count: entry.count || 0
        };
    });
}

/**
 * البحث في فهرس الرموز.
 * @param {string} query نص البحث
 * @param {number} limit أقصى عدد نتائج
 */
function searchInDatabase(query, limit) {
    const max = limit || 12;
    const q = searchKey(query);
    if (!q) return [];

    const scored = [];
    searchEntries().forEach(function (entry) {
        const key = searchKey(entry.word);
        let score = -1;

        if (key === q) {
            score = 100;
        } else if (key.startsWith(q)) {
            score = 80 - (key.length - q.length);
        } else if (key.includes(q)) {
            score = 50 - key.indexOf(q);
        }

        if (score >= 0) {
            entry.score = score;
            scored.push(entry);
        }
    });

    return scored
        .sort(function (a, b) {
            return (b.score - a.score) || a.word.localeCompare(b.word, "ar");
        })
        .slice(0, max);
}

/** توجيه المستخدم إلى صفحة الرمز */
function goToSymbol(word) {
    window.location.href = (window.symbolUrl ? window.symbolUrl(word) : "/letters/");
}

/** بناء HTML لنتيجة بحث كرابط */
function resultItemHtml(r, index) {
    return '<a class="result-item" id="search-result-' + index + '" role="option"' +
        ' href="' + escapeHtml(r.url) + '">' +
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

    resultsContainer.innerHTML = results.map(resultItemHtml).join("");
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
        liveSearch(q);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("mainSearch");
    if (!input) return;

    let debounce;
    input.addEventListener("input", function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () { liveSearch(input.value); }, 160);
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

    document.addEventListener("click", function (e) {
        const box = document.getElementById("searchResults");
        if (!box) return;
        if (!box.contains(e.target) && e.target !== input) box.innerHTML = "";
    });

    const params = new URLSearchParams(window.location.search);
    const initialQuery = (params.get("q") || "").trim();
    if (initialQuery.length >= 2) {
        input.value = initialQuery;
        liveSearch(initialQuery);
        input.focus();
    }
});
