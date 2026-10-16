/* ================================================================
   موقع تفسير الأحلام — المنطق الرئيسي
   ملف: js/app.js
   ----------------------------------------------------------------
   ملاحظة تقنية مهمة (إصلاح لعيب شائع):
   وسوم <script> التي تُحقن عبر innerHTML لا تُنفَّذ في المتصفح،
   لذلك لم تكن إعلانات أدسنس الديناميكية تعمل. هنا ننشئ عنصر
   <ins class="adsbygoogle"> ثم ندفعه يدوياً إلى مصفوفة adsbygoogle.
   ================================================================ */

/* ----------------------------------------------------------------
   0) أدوات مساعدة عامة
   ---------------------------------------------------------------- */

/** إزالة التشكيل وتوحيد الهمزات والألف والتاء المربوطة لتسهيل البحث */
function normalizeArabic(text) {
    if (!text) return "";
    return String(text)
        .replace(/[\u064B-\u0652\u0670\u0640]/g, "") // تشكيل + تطويل
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

/** إزالة الشرطات من نص عربي لجعله صالحاً في جزء من الرابط (slug) */
function toSlug(text) {
    return encodeURIComponent(text);
}

/** جلب عدد الرموز في حرف معيّن */
function countByLetter(letter) {
    return Object.values(dreamDatabase).filter(d => d.letter === letter).length;
}

/** جلب الرموز المرتبة لحرف معيّن */
function symbolsByLetter(letter) {
    return Object.entries(dreamDatabase)
        .filter(([, d]) => d.letter === letter)
        .sort((a, b) => a[0].localeCompare(b[0], "ar"));
}

/* ----------------------------------------------------------------
   1) الإعلانات — تحميل آمن + دفع صحيح لعناصر أدسنس
   ---------------------------------------------------------------- */

/** تحميل سكربت أدسنس الرسمي مرة واحدة إن كانت الإعلانات مفعّلة */
function loadAdsenseScript() {
    if (!siteConfig.adsense.enabled) return;
    if (document.querySelector('script[data-adsense-loader]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
        encodeURIComponent(siteConfig.adsense.client);
    s.crossOrigin = "anonymous";
    s.setAttribute("data-adsense-loader", "1");
    document.head.appendChild(s);
}

/** بناء كتلة إعلان (نائب إن كانت الإعلانات معطّلة، أو عنصر ins إن كانت مفعّلة)
 *  format: "horizontal" للبانرات القصيرة، "rectangle" للمحتوى، "auto" الافتراضي */
function buildAdBlock(slotId, extraClass, format) {
    const cls = "ad-zone " + (extraClass || "");
    const label = '<div class="ad-label">إعلان</div>';
    const fmt = format || "auto";
    const fwr = fmt === "auto" ? ' data-full-width-responsive="true"' : "";

    if (!siteConfig.adsense.enabled) {
        // نائب واضح يُعلم الزائر والمراجع أن هذا موضع إعلان مستقبلي
        return '<div class="' + cls + '" data-ad-type="' + escapeHtml(fmt) + '">' + label +
            '<div style="color:#9a8b7c;font-size:.85rem">مساحة إعلانية — تُفعَّل بعد قبول الموقع في أدسنس</div>' +
            '</div>';
    }

    return '<div class="' + cls + '" data-ad-type="' + escapeHtml(fmt) + '">' + label +
        '<ins class="adsbygoogle" style="display:block" ' +
        'data-ad-client="' + escapeHtml(siteConfig.adsense.client) + '" ' +
        'data-ad-slot="' + escapeHtml(slotId) + '" ' +
        'data-ad-format="' + escapeHtml(fmt) + '"' + fwr + '></ins>' +
        '</div>';
}

/** دفع كل عناصر أدسنس الجديدة الموجودة داخل عنصر معيّن */
function activateAds(root) {
    if (!siteConfig.adsense.enabled) return;
    const scope = root || document;
    scope.querySelectorAll("ins.adsbygoogle").forEach(ins => {
        if (ins.getAttribute("data-adsbygoogle-status")) return; // مُعالَج مسبقاً
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            /* تجاهل الأخطاء الصامتة لأدسنس */
        }
    });
}

/* ----------------------------------------------------------------
   2) قائمة الجوال
   ---------------------------------------------------------------- */
function toggleMenu() {
    const links = document.getElementById("navLinks");
    if (links) {
        const open = links.classList.toggle("show");
        document.querySelectorAll(".mobile-menu-btn").forEach(b =>
            b.setAttribute("aria-expanded", open ? "true" : "false"));
    }
}

/* ----------------------------------------------------------------
   3) صفحة الحرف — نقطة الدخول
   ---------------------------------------------------------------- */
function loadLetterPage() {
    const params = new URLSearchParams(window.location.search);
    const letter = params.get("letter");
    const symbol = params.get("symbol");
    const interpreterFilter = params.get("interpreter");

    renderLetterNavStrip(letter);
    renderPopularList();

    if (symbol && dreamDatabase[symbol]) {
        displaySymbol(symbol, interpreterFilter);
    } else if (letter) {
        displayLetter(letter);
    } else {
        displayAllLetters();
    }

    activateAds(document);
}

/* ----------------------------------------------------------------
   4) شريط تنقل الحروف (لاصق)
   ---------------------------------------------------------------- */
function renderLetterNavStrip(activeLetter) {
    const strip = document.getElementById("letterNavStrip");
    if (!strip) return;
    strip.innerHTML = arabicLetters.map(l =>
        '<a href="letter?letter=' + toSlug(l.char) + '"' +
        ' class="' + (l.char === activeLetter ? "active" : "") + '"' +
        ' title="حرف ' + escapeHtml(l.name) + '"' +
        ' aria-label="حرف ' + escapeHtml(l.name) + '">' + l.char + "</a>"
    ).join("");
}

/* ----------------------------------------------------------------
   5) قائمة الرموز الأكثر بحثاً
   ---------------------------------------------------------------- */
function renderPopularList() {
    const list = document.getElementById("popularList");
    if (!list) return;
    list.innerHTML = popularSymbols
        .filter(w => dreamDatabase[w])
        .map(w => '<li><a href="letter?symbol=' + toSlug(w) + '">' + escapeHtml(w) + "</a></li>")
        .join("");
}

/* ----------------------------------------------------------------
   6) شريط تصفية المفسّرين (يُعاد استخدامه في عدة مواضع)
   ---------------------------------------------------------------- */
function filterBarHtml() {
    let html = '<div class="letter-filter" role="group" aria-label="تصفية حسب المفسّر">';
    html += '<button type="button" class="filter-btn active" data-filter="all" onclick="filterInterp(\'all\', event)">الكل</button>';
    Object.keys(interpreters).forEach(key => {
        html += '<button type="button" class="filter-btn" data-filter="' + key +
            '" onclick="filterInterp(\'' + key + '\', event)">' +
            escapeHtml(interpreters[key].shortName) + "</button>";
    });
    html += "</div>";
    return html;
}

/* ----------------------------------------------------------------
   7) عرض رمز محدد
   ---------------------------------------------------------------- */
function displaySymbol(symbol, interpreterFilter) {
    const container = document.getElementById("letterContent");
    const data = dreamDatabase[symbol];
    if (!data) {
        container.innerHTML = '<p style="text-align:center;padding:40px">الرمز غير موجود.</p>';
        return;
    }

    const letterInfo = arabicLetters.find(l => l.char === data.letter);
    const interpretationsCount = Object.keys(data.interpretations).length;

    // تحديث عنوان الصفحة ووصفها (SEO)
    document.title = "تفسير رؤية " + symbol + " في المنام — " + siteConfig.siteName;
    setMetaDescription("تفسير رؤية " + symbol + " في المنام عند ابن سيرين والنابلسي وابن شاهين والإمام جعفر الصادق. " +
        interpretationsCount + " تفسيرات لرؤية " + symbol + " في الحلم.");
    setCanonical("letter?symbol=" + toSlug(symbol));
    injectJsonLd(symbol, interpretationsCount);

    let html = "";

    // مسار التنقل
    html += '<nav class="breadcrumbs" aria-label="مسار التنقل">' +
        '<a href="/">الرئيسية</a><span class="sep">›</span>' +
        '<a href="letter">تصفح بالحروف</a><span class="sep">›</span>' +
        '<a href="letter?letter=' + toSlug(data.letter) + '">حرف ' +
        escapeHtml(letterInfo ? letterInfo.name : data.letter) + '</a>' +
        '<span class="sep">›</span><span>' + escapeHtml(symbol) + "</span></nav>";

    // رأس الرمز
    html += '<header class="letter-header">' +
        '<div class="big-letter">' + escapeHtml(symbol) + "</div>" +
        '<h1 class="letter-name" style="font-size:1.35rem;color:var(--text-secondary)">تفسير رؤية ' +
        escapeHtml(symbol) + " في المنام</h1>" +
        '<div class="letter-count">' + interpretationsCount + " تفسيرات من المفسّرين</div>" +
        "</header>";

    html += filterBarHtml();

    // بطاقة الرمز
    html += '<article class="symbol-card" id="symbol-main">' +
        "<h3>" + escapeHtml(symbol) + "</h3>" +
        '<div class="symbol-divider"></div>';

    for (const [key, text] of Object.entries(data.interpretations)) {
        const interp = interpreters[key];
        if (!interp) continue;
        html += '<div class="interpretation" data-interpreter="' + key + '">' +
            '<div class="interpreter-name">' + escapeHtml(interp.name) +
            ' <span class="book-mini">— ' + escapeHtml(interp.book) + "</span></div>" +
            "<p>" + escapeHtml(text) + "</p></div>";
    }
    html += "</article>";

    // إعلان داخل الصفحة
    html += buildAdBlock(siteConfig.adsense.slots.inSymbol, "ad-middle", "rectangle");

    // رموز ذات صلة (من نفس الحرف)
    const related = symbolsByLetter(data.letter).filter(([w]) => w !== symbol);
    if (related.length > 0) {
        html += '<div class="section-header" style="margin-top:44px">' +
            '<h2 style="font-size:1.5rem">رموز من نفس الحرف</h2></div>';
        html += '<div class="letters-grid">';
        related.forEach(([w]) => {
            html += '<a href="letter?symbol=' + toSlug(w) + '" class="letter-btn">' +
                '<span style="font-size:1.05rem">' + escapeHtml(w) + "</span></a>";
        });
        html += "</div>";
    }

    // إعلان قبل الفوتر
    html += buildAdBlock(siteConfig.adsense.slots.beforeFooter, "ad-bottom", "horizontal");

    container.innerHTML = html;

    if (interpreterFilter && interpreters[interpreterFilter]) {
        const btn = document.querySelector('.filter-btn[data-filter="' + interpreterFilter + '"]');
        if (btn) activateFilter(btn, interpreterFilter);
    }
}

/* ----------------------------------------------------------------
   8) عرض جميع رموز حرف
   ---------------------------------------------------------------- */
function displayLetter(letter) {
    const container = document.getElementById("letterContent");
    const letterInfo = arabicLetters.find(l => l.char === letter);
    const symbols = symbolsByLetter(letter);

    document.title = "تفسير الأحلام حسب حرف " + (letterInfo ? letterInfo.name : letter) +
        " — " + siteConfig.siteName;
    setMetaDescription("تصفح تفسيرات الأحلام والرؤى التي تبدأ بحرف " +
        (letterInfo ? letterInfo.name : letter) + ". " + symbols.length +
        " رمزاً مع تفسيرات ابن سيرين والنابلسي وابن شاهين والإمام جعفر الصادق.");
    setCanonical("letter?letter=" + toSlug(letter));

    let html = "";

    html += '<nav class="breadcrumbs" aria-label="مسار التنقل">' +
        '<a href="/">الرئيسية</a><span class="sep">›</span>' +
        '<a href="letter">تصفح بالحروف</a><span class="sep">›</span>' +
        "<span>حرف " + escapeHtml(letterInfo ? letterInfo.name : letter) + "</span></nav>";

    html += '<header class="letter-header">' +
        '<div class="big-letter">' + escapeHtml(letter) + "</div>" +
        '<h1 class="letter-name">حرف ' + escapeHtml(letterInfo ? letterInfo.name : letter) + "</h1>" +
        '<div class="letter-count">' + symbols.length + " رمز متاح</div>" +
        "</header>";

    if (symbols.length === 0) {
        html += '<p style="text-align:center;padding:40px;color:var(--text-secondary)">' +
            "لا توجد رموز متاحة لهذا الحرف حالياً، ويمكن إضافتها لاحقاً في ملف js/data.js.</p>";
        container.innerHTML = html;
        return;
    }

    html += filterBarHtml();

    symbols.forEach(([word, data], idx) => {
        html += '<article class="symbol-card" id="symbol-' + idx + '">' +
            "<h3>" + escapeHtml(word) + "</h3>" +
            '<div class="symbol-divider"></div>';

        for (const [key, text] of Object.entries(data.interpretations)) {
            const interp = interpreters[key];
            if (!interp) continue;
            html += '<div class="interpretation" data-interpreter="' + key + '">' +
                '<div class="interpreter-name">' + escapeHtml(interp.name) + "</div>" +
                "<p>" + escapeHtml(text) + "</p></div>";
        }

        html += '<div style="margin-top:12px"><a class="btn btn-outline" style="margin-top:6px" href="letter?symbol=' +
            toSlug(word) + '">صفحة الرمز المفردة</a></div>';

        html += "</article>";

        // إعلان بعد كل 3 رموز (مع مراعاة حد أدسنس)
        if ((idx + 1) % 3 === 0 && idx !== symbols.length - 1) {
            html += buildAdBlock(siteConfig.adsense.slots.everyThree, "ad-middle", "rectangle");
        }
    });

    // إعلان قبل الفوتر
    html += buildAdBlock(siteConfig.adsense.slots.letterBeforeFooter, "ad-bottom", "horizontal");

    container.innerHTML = html;
}

/* ----------------------------------------------------------------
   9) عرض فهرس جميع الحروف
   ---------------------------------------------------------------- */
function displayAllLetters() {
    const container = document.getElementById("letterContent");

    document.title = "تصفح تفسير الأحلام حسب الحروف الأبجدية — " + siteConfig.siteName;
    setCanonical("letter");

    let html = '<header class="letter-header">' +
        '<div class="big-letter">أ — ي</div>' +
        '<h1 class="letter-name">تصفح جميع الحروف الأبجدية</h1>' +
        '<div class="letter-count">' + Object.keys(dreamDatabase).length + " رمزاً متاحاً</div>" +
        "</header>";

    html += '<div class="letters-grid">';
    arabicLetters.forEach(l => {
        html += '<a href="letter?letter=' + toSlug(l.char) + '" class="letter-btn">' +
            "<span>" + l.char + "</span><small>" + countByLetter(l.char) + " رمز</small></a>";
    });
    html += "</div>";

    html += buildAdBlock(siteConfig.adsense.slots.allLetters, "ad-middle", "rectangle");
    container.innerHTML = html;
}

/* ----------------------------------------------------------------
   10) تصفية حسب المفسّر
   ---------------------------------------------------------------- */
function activateFilter(btn, interpreter) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".interpretation").forEach(card => {
        const show = interpreter === "all" || card.dataset.interpreter === interpreter;
        card.style.display = show ? "" : "none";
    });
}

function filterInterp(interpreter, event) {
    let btn = (event && event.currentTarget) ? event.currentTarget : null;
    if (!btn) btn = document.querySelector('.filter-btn[data-filter="' + interpreter + '"]');
    activateFilter(btn, interpreter);
}

/* ----------------------------------------------------------------
   11) أدوات SEO: وصف + canonical + بيانات منظّمة
   ---------------------------------------------------------------- */
function setMetaDescription(content) {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
}

function setCanonical(pathAndQuery) {
    const base = siteConfig.siteUrl.replace(/\/$/, "");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
    }
    link.setAttribute("href", base + "/" + pathAndQuery);
}

function injectJsonLd(symbol, count) {
    const old = document.getElementById("symbol-jsonld");
    if (old) old.remove();
    const base = siteConfig.siteUrl.replace(/\/$/, "");
    const data = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "تفسير رؤية " + symbol + " في المنام",
        "inLanguage": "ar",
        "about": symbol,
        "description": "تفسير رؤية " + symbol + " في المنام عند " +
            Object.values(interpreters).map(i => i.shortName).join(" و") + ".",
        "url": base + "/letter?symbol=" + toSlug(symbol),
        "publisher": { "@type": "Organization", "name": siteConfig.siteName }
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "symbol-jsonld";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
}

/* ----------------------------------------------------------------
   12) إعلانات الجوال اللاصقة + أزرار إغلاق الإعلانات + زر العودة للأعلى
   ---------------------------------------------------------------- */

/** إغلاق صندوق إعلان وإخفائه */
function hideAdZone(zone) {
    if (!zone) return;
    zone.style.display = "none";
    if (zone.classList.contains("ad-sticky-mobile")) {
        document.body.classList.remove("has-sticky-ad");
    }
}

/** مفتاح تخزين حالة الإغلاق للجلسة */
function adCloseKey(zone) {
    const slot = zone.getAttribute("data-ad-slot");
    return slot ? "ad-closed:" + slot : null;
}

/** إغلاق الإعلان عند الضغط على زر ✕ */
function closeAd(btn) {
    const zone = btn.closest(".ad-zone, .sidebar-ad, .ad-sticky-mobile");
    if (!zone) return;
    hideAdZone(zone);
    try {
        const key = adCloseKey(zone);
        if (key) sessionStorage.setItem(key, "1");
    } catch (e) { /* تجاهل */ }
}

/** إضافة زر إغلاق (✕) لكل صناديق الإعلانات داخل نطاق معيّن */
function setupAdCloseButtons(root) {
    const scope = root || document;
    scope.querySelectorAll(".ad-zone, .sidebar-ad, .ad-sticky-mobile").forEach(zone => {
        if (zone.dataset.adDismissible === "1") return; // مضاف مسبقاً
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ad-close";
        btn.setAttribute("aria-label", "إغلاق الإعلان");
        btn.setAttribute("title", "إغلاق الإعلان");
        btn.textContent = "✕";
        btn.addEventListener("click", function () { closeAd(this); });
        zone.appendChild(btn);
        zone.dataset.adDismissible = "1";
    });
}

/** إخفاء الإعلانات التي أغلقها الزائر في هذه الجلسة */
function restoreClosedAds() {
    document.querySelectorAll(".ad-zone, .sidebar-ad, .ad-sticky-mobile").forEach(zone => {
        try {
            const key = adCloseKey(zone);
            if (key && sessionStorage.getItem(key) === "1") hideAdZone(zone);
        } catch (e) { /* تجاهل */ }
    });
}

function setupStickyMobileAd() {
    if (!siteConfig.adsense.enabled) return;
    if (document.querySelector(".ad-sticky-mobile")) return;
    const div = document.createElement("div");
    div.className = "ad-sticky-mobile";
    div.setAttribute("data-ad-slot", "stickyMobile");
    div.setAttribute("data-ad-type", "horizontal");
    div.innerHTML = '<div class="ad-label">إعلان</div>' +
        '<ins class="adsbygoogle" style="display:block" ' +
        'data-ad-client="' + escapeHtml(siteConfig.adsense.client) + '" ' +
        'data-ad-slot="' + escapeHtml(siteConfig.adsense.slots.stickyMobile) + '" ' +
        'data-ad-format="horizontal"></ins>';
    document.body.appendChild(div);
    document.body.classList.add("has-sticky-ad");
    activateAds(div);
}

function setupBackToTop() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        btn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ----------------------------------------------------------------
   13) تعبئة عناصر الصفحة الرئيسية المشتركة (إعلانات + إحصاءات)
   ---------------------------------------------------------------- */
function hydrateCommonElements() {
    // إعلانات ثابتة موجودة في HTML (علوي/سفلي) تُدفع عبر activateAds
    activateAds(document);

    // عدّاد الرموز في الصفحة الرئيسية
    const statEl = document.getElementById("statSymbols");
    if (statEl) statEl.textContent = Object.keys(dreamDatabase).length;

    // قائمة الرموز الأكثر بحثاً (إن وُجدت في الصفحة)
    renderPopularList();
}

/* ----------------------------------------------------------------
   14) الإقلاع
   ---------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    loadAdsenseScript();
    hydrateCommonElements();
    setupBackToTop();
    setupStickyMobileAd();

    if (document.getElementById("letterContent")) {
        loadLetterPage();
    }

    // إضافة أزرار إغلاق الإعلانات ثم تطبيق ما أغلقه الزائر سابقاً في الجلسة
    setupAdCloseButtons(document);
    restoreClosedAds();
});
