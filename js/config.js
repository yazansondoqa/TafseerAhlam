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
            header:     "1111111111", // أعلى الصفحة — جميع الصفحات
            homeMiddle: "2222222222", // الوحدة 1 — الرئيسية
            footer:     "3333333333", // أسفل — جميع الصفحات
            sidebar1:   "4444444444", // الوحدة 1 — الشريط الجانبي
            sidebar2:   "5555555555", // الوحدة 2 — الشريط الجانبي
            inSymbol:   "6666666666", // الوحدة — صفحة الرمز
            beforeFooter:"7777777777", // قبل التذييل
            everyThree: "8888888888", // بعد كل 3 رموز
            letterBeforeFooter: "9999999999", // قبل التذييل في صفحة الحرف
            allLetters: "1010101010", // صفحة الحروف
            stickyMobile: "1212121212" // الشريط السفلي للجوال
        }
    },

    /* بيانات التواصل — تظهر في صفحة اتصل بنا */
    contact: {
        email: "tafseerahlam@gmail.com",
        responseTime: "خلال 48 ساعة عمل"
    }
};

/* ----------------------------------------------------------------
   تحميل سكربت AdSense تلقائياً بعد التأكد من الإعدادات.
   لا تعدّل هذا الجزء — فهو يتحقق من وجود المعرّف قبل التحميل.
   ---------------------------------------------------------------- */
(function () {
    var a = siteConfig.adsense;
    if (!a || !a.enabled || !a.client || a.client.indexOf("XXXXXXXX") !== -1) return;

    window.adsbygoogle = window.adsbygoogle || [];

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
        encodeURIComponent(a.client);
    s.crossOrigin = "anonymous";
    s.setAttribute("data-adsense-loader", "1");
    (document.head || document.documentElement).appendChild(s);
})();
