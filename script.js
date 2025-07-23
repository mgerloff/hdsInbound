const END_REGEX = /(chat has ended!?|customer has left the chat)/i;

function startEndPoll() {
    const INTERVAL = 400;
    const SEARCH_TIMEOUT = 10000;
    const start = Date.now();
    let iframeFound = false;

    const timer = setInterval(() => {
        const iframe = document.querySelector('iframe[id^="amazon-connect-chat-widget-iframe"]');
        if (!iframe) {
            if (!iframeFound && Date.now() - start > SEARCH_TIMEOUT) {
                clearInterval(timer);
            }
            return;
        }

        iframeFound = true;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        const txt = doc.body?.innerText || "";
        if (END_REGEX.test(txt)) {
            clearInterval(timer);
            setTimeout(() => location.reload(), 1200);
        }
    }, INTERVAL);
}

function isWithinBusinessHours() {
    const now = new Date();
    const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const day = eastern.getDay();
    const hour = eastern.getHours();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}

window.onload = function () {
    const formWrapper     = document.getElementById("formWrapper");
    const form            = document.getElementById("chatForm");
    const toggleContainer = document.getElementById("chatToggleContainer");
    const chatToggle      = document.getElementById("chatToggle");
    const minimizeBtn     = document.getElementById("minimizeBtn");

    if (!isWithinBusinessHours()) {
        formWrapper && (formWrapper.style.display = "none");
        toggleContainer && (toggleContainer.style.display = "none");
        return;
    }

    chatToggle.addEventListener("click", () => {
        const formVisible = formWrapper.style.display === "block";
        formWrapper.style.display = formVisible ? "none" : "block";
        if (minimizeBtn) minimizeBtn.style.display = formVisible ? "none" : "inline";
        toggleContainer.classList.toggle("open", !formVisible);
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const department = document.getElementById("department").value;
        const name       = document.getElementById("name").value;
        const email      = document.getElementById("email").value;
        const invoice    = document.getElementById("invoice").value;
        const question   = document.getElementById("question").value;

        formWrapper.style.display = "none";
        toggleContainer.style.display = "none";

        (function(w, d, x, id){
            const s = d.createElement('script');
            s.src='https://sharecare-hds-dev-p3f.my.connect.aws/connectwidget/static/amazon-connect-chat-interface-client.js';
            s.async=1; s.id=id;
            d.getElementsByTagName('head')[0].appendChild(s);
            w[x] = w[x] || function(){ (w[x].ac = w[x].ac || []).push(arguments) };
        })(window, document, 'amazon_connect', '5b13b062-7453-441f-82bb-1217aa9bc919');

        amazon_connect('styles', {
            iconType: 'CHAT',
            openChat:  { color: '#ffffff', backgroundColor: '#123456' },
            closeChat: { color: '#ffffff', backgroundColor: '#123456' }
        });
        amazon_connect('snippetId', 'QVFJREFIaFg3VVJ2dFRXb2IrUUdndUkvUzRJMnRnQ1NJL3Erc1JKT0lFQ3lCQlNlUEFFNWJjR1psVzREczdZQ3BhYzIxMk9VQUFBQWJqQnNCZ2txaGtpRzl3MEJCd2FnWHpCZEFnRUFNRmdHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFNUGErMWNxbkd1dEJhVTZGK0FnRVFnQ3NNZ1kwWm5oK0kwY3dUL2haS2RUeXZoOTJYQVN5OHJQYVcxK0RaT3JSdUxaNzFvYVBFOCtBcng4R0k6Om12MUZJZjU3MFp1NmpRcWVVd1dzdDZLZURHSDBPVjVzSllFR0ZaYndnRG5iOFl1V0x0ZitxU242YVJ5OTBCbWRTRFRZUytGcWFUb1dKdEV2VHdLQ3cxcXRWNVZ4U0hZTVBia3dCSU4wcURPUFNVZG05eGNmVktBTFhHNUhVenR2RFA5Rk14d29kVjlUV0ZHQ1l6SytmVjBzVWhtTXl3cz0=');
        amazon_connect('contactAttributes', { department, name, email, invoice, question });
        amazon_connect('supportedMessagingContentTypes', [
            'text/plain','text/markdown',
            'application/vnd.amazonaws.connect.message.interactive',
            'application/vnd.amazonaws.connect.message.interactive.response'
        ]);

        startEndPoll();

        setTimeout(() => {
            const widget = document.querySelector('[class*="acWidgetContainer"]');
            if (widget) widget.style.display = "block";
            widget?.querySelector("button")?.click();
        }, 800);
    });
};
