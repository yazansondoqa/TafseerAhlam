/* ================================================================
   إعدادات الموقع — فسر حلمك
   الملف: js/config.js
   ----------------------------------------------------------------
   يُحمَّل في <head> قبل بقية السكربتات. لا يحتوي على مفاتيح سرية.
   ================================================================ */

const siteConfig = {
    siteName: "فسر حلمك",
    siteUrl: "https://www.tafseerahlam.store",
    lastUpdated: "2026-11-14",

    /* ------- إعلانات Google AdSense -------
       الإعلانات معطّلة أثناء مراجعة الموقع.
       لا تُفعَّل إلا بعد قبول AdSense وبعد مراجعة سياسات المحتوى. */
    adsense: {
        enabled: false,
        client: "ca-pub-4532516391740793",
        slots: {}
    },

    contact: {
        email: "admin@tafseerahlam.store",
        responseTime: "خلال 48 ساعة عمل",
        formEndpoint: "https://formsubmit.co/ajax/admin@tafseerahlam.store",
        recaptchaSiteKey: ""
    }
};
