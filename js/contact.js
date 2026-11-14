/* ================================================================
   فسر حلمك — نموذج التواصل
   ----------------------------------------------------------------
   يرسل الرسالة إلى endpoint مضبوط في js/config.js، ويعرض بديلاً
   عبر برنامج البريد إذا تعذّر الإرسال الآلي.
   ================================================================ */
(function () {
    "use strict";

    function init() {
        var form = document.getElementById("contactForm");
        if (!form) return;

        var statusEl = document.getElementById("contactStatus");
        var submitBtn = document.getElementById("contactSubmit");
        var startedEl = document.getElementById("contactStartedAt");
        var nameEl = document.getElementById("contactName");
        var emailEl = document.getElementById("contactEmail");
        var subjectEl = document.getElementById("contactSubject");
        var messageEl = document.getElementById("contactMessage");

        if (startedEl) startedEl.value = String(Date.now());

        function setStatus(message, state, mailto) {
            if (!statusEl) return;
            statusEl.className = "form-status" + (state ? " " + state : "");
            statusEl.textContent = message || "";
            if (mailto) {
                var link = document.createElement("a");
                link.href = mailto;
                link.textContent = " إرسال عبر برنامج البريد";
                link.style.marginInlineStart = "6px";
                link.style.fontWeight = "700";
                statusEl.appendChild(link);
            }
        }

        function mailtoFor(name, email, subject, message) {
            var body = "الاسم: " + (name || "غير مذكور") + "\n" +
                "البريد: " + email + "\n" +
                "الموضوع: " + subject + "\n\n" +
                message + "\n\n— أُرسلت من موقع فسر حلمك";
            var address = (window.siteConfig && siteConfig.contact && siteConfig.contact.email) || "admin@tafseerahlam.store";
            return "mailto:" + address +
                "?subject=" + encodeURIComponent("[موقع فسر حلمك] " + subject) +
                "&body=" + encodeURIComponent(body);
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var honey = form.querySelector('[name="_honey"]');
            if (honey && honey.value) return;

            var name = nameEl ? nameEl.value.trim() : "";
            var email = emailEl ? emailEl.value.trim() : "";
            var subject = subjectEl ? subjectEl.value : "رسالة من الموقع";
            var message = messageEl ? messageEl.value.trim() : "";
            var fallback = mailtoFor(name, email, subject, message);

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                setStatus("اكتب بريداً إلكترونياً صحيحاً حتى نتمكن من الرد.", "err");
                if (emailEl) emailEl.focus();
                return;
            }

            if (message.length < 20) {
                setStatus("اكتب رسالة لا تقل عن 20 حرفاً.", "err");
                if (messageEl) messageEl.focus();
                return;
            }

            if (startedEl && Date.now() - parseInt(startedEl.value, 10) < 3000) {
                setStatus("انتظر لحظة قصيرة ثم أعد المحاولة.", "err");
                return;
            }

            var endpoint = window.siteConfig && siteConfig.contact && siteConfig.contact.formEndpoint;
            if (!endpoint) {
                setStatus("يمكنك إرسال رسالتك مباشرة عبر برنامج البريد:", "err", fallback);
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "جارٍ الإرسال...";
            }
            setStatus("جارٍ إرسال رسالتك...", "ok");

            fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    "الاسم": name || "غير مذكور",
                    "البريد": email,
                    "الموضوع": subject,
                    "الرسالة": message,
                    "_subject": "[موقع فسر حلمك] " + subject,
                    "_template": "table",
                    "_captcha": "false"
                })
            }).then(function (response) {
                return response.json().catch(function () { return {}; }).then(function (data) {
                    if (!response.ok) throw new Error("send-failed");
                    if (data && (data.success === true || data.success === "true")) return;
                    throw new Error("send-failed");
                });
            }).then(function () {
                setStatus("تم إرسال رسالتك. نشكرك على تواصلك، وسنحاول الرد خلال 48 ساعة عمل.", "ok");
                form.reset();
                if (startedEl) startedEl.value = String(Date.now());
            }).catch(function () {
                setStatus("تعذّر الإرسال الآلي الآن. يمكنك إرسال الرسالة عبر برنامج البريد:", "err", fallback);
            }).finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "إرسال الرسالة";
                }
            });
        });

        var params = new URLSearchParams(window.location.search);
        var subjectParam = params.get("subject");
        if (subjectParam && subjectEl) {
            var option = Array.prototype.find.call(subjectEl.options, function (item) {
                return item.value === subjectParam;
            });
            if (option) subjectEl.value = subjectParam;
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
