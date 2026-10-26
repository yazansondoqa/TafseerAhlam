/* ================================================================
   إعدادات الموقع — فسر حلمك
   الملف: js/config.js
   ----------------------------------------------------------------
   يجب تحميل هذا الملف في <head> قبل بقية السكربتات.
   لا يحتوي على أي مفاتيح سرية — كل القيم قابلة للنشر.
   ================================================================ */

const siteConfig = {

    /* اسم الموقع الظاهر في الواجهة */
    siteName: "فسر حلمك",

    /* العنوان الأساسي للموقع (بدون / في النهاية) */
    siteUrl: "https://www.tafseerahlam.store",

    /* ------- إعلانات Google AdSense -------
       ضع معرّف الناشر ومعرّفات الوحدات (slots) من لوحة AdSense.
       ترك أي slot فارغاً يعطّل تلك الوحدة تلقائياً. */
    adsense: {
        enabled: true,
        client: "ca-pub-4532516391740793", // معرّف الناشر
        slots: {
            header:     "2360733089", /* ← header unit (تك 1) */
            homeMiddle: "PASTE_HOME_SLOT", /* ← home middle unit (تك 2) */
            footer:     "PASTE_FOOTER_SLOT", /* ← footer unit (تك 3) */
            sidebar1:   "PASTE_SIDEBAR1_SLOT", /* ← sidebar 1 (تك 4) */
            sidebar2:   "PASTE_SIDEBAR2_SLOT", /* ← sidebar 2 (تك 5) */
            inSymbol:   "PASTE_SYMBOL_SLOT", /* ← symbol page (تك 6) */
            beforeFooter:"PASTE_BEFOREFOOTER_SLOT", /* ← before footer (تك 7) */
            everyThree: "PASTE_EVERY3_SLOT", /* ← every 3 symbols (تك 8) */
            letterBeforeFooter: "PASTE_LETTERFOOTER_SLOT", /* ← letter page (تك 9) */
            allLetters: "PASTE_ALLLETTERS_SLOT", /* ← all letters (تك 10) */
            stickyMobile: "PASTE_MOBILE_SLOT" /* ← sticky mobile (تك 11) */
        }
    },

    /* بيانات التواصل — تظهر في صفحة اتصل بنا */
    contact: {
        email: "admin@tafseerahlam.store",
        responseTime: "خلال 48 ساعة عمل",
        /* خدمة إرسال النماذج بدون خادم (FormSubmit).
           يجب تأكيد عنوان البريد مرة واحدة عند أول رسالة تصل. */
        formEndpoint: "https://formsubmit.co/ajax/admin@tafseerahlam.store",
        /* مفتاح reCAPTCHA v3 (الموقع) — اتركه فارغاً حتى تضيفه من لوحة Google.
           عند إضافته يُحمَّل السكربت ويُرسل الرمز مع النموذج تلقائياً. */
        recaptchaSiteKey: ""
    }
};

/* ----------------------------------------------------------------
   تعريف مصفوفة إعلانات AdSense.
   السكربت موجود بشكل ثابت داخل <head> في كل الصفحات،
   لذلك لا نضيفه مرة أخرى هنا حتى لا يتكرر تحميله مرتين.
   ---------------------------------------------------------------- */
(function () {
    var a = siteConfig.adsense;
    if (!a || !a.enabled || !a.client || a.client.indexOf("XXXXXXXX") !== -1) return;

    window.adsbygoogle = window.adsbygoogle || [];
})();
