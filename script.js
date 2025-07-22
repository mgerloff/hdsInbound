const END_REGEX = /(chat has ended!?|customer has left the chat)/i;

function cleanupAfterChat() {
    const widget = document.querySelector('[class*="acWidgetContainer"]');
    if (widget) widget.style.display = 'none';

    const toggleContainer = document.getElementById("chatToggleContainer");
    if (toggleContainer) {
        toggleContainer.style.display = "block";
        setToggleOpen(false);
    }

    resetFormFields();
}

function startEndPoll() {
    let ticks = 0;
    const maxTicks = 300; // ~90s

    const timer = setInterval(() => {
        const iframe = document.querySelector('iframe[id^="amazon-connect-chat-widget-iframe"]');
        if (!iframe) { if (++ticks > maxTicks) clearInterval(timer); return; }

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) { if (++ticks > maxTicks) clearInterval(timer); return; }

        const txt = doc.body?.innerText || "";

        if (END_REGEX.test(txt)) {
            clearInterval(timer);
            cleanupAfterChat();
        }

        if (++ticks > maxTicks) clearInterval(timer);
    }, 300);
}

function setToggleOpen(isOpen) {
    const toggleContainer = document.getElementById("chatToggleContainer");
    const chatToggle = document.getElementById("chatToggle");
    const minimizeBtn = document.getElementById("minimizeBtn");

    if (!toggleContainer) return;
    toggleContainer.classList.toggle("open", isOpen);
    chatToggle?.setAttribute("aria-expanded", isOpen);
    if (minimizeBtn) minimizeBtn.style.display = isOpen ? "inline" : "none";
}

function resetFormFields() {
    const form = document.getElementById("chatForm");
    if (!form) return;

    form.reset();
}

function isWithinBusinessHours() {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const day = easternTime.getDay();
    const hour = easternTime.getHours();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}

window.onload = function () {
    const formWrapper = document.getElementById("formWrapper");
    const form = document.getElementById("chatForm");
    const toggleContainer = document.getElementById("chatToggleContainer");
    const chatToggle = document.getElementById("chatToggle");
    const minimizeBtn = document.getElementById("minimizeBtn");

    if (!isWithinBusinessHours()) {
        if (formWrapper) formWrapper.style.display = "none";
        if (toggleContainer) toggleContainer.style.display = "none";
        return;
    }

    chatToggle.addEventListener("click", () => {
        const formVisible = formWrapper.style.display === "block";
        formWrapper.style.display = formVisible ? "none" : "block";
        minimizeBtn.style.display = formVisible ? "none" : "inline";
        toggleContainer.classList.toggle("open", !formVisible);
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const department = document.getElementById("department").value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const invoice = document.getElementById("invoice").value;
        const question = document.getElementById("question").value;

        formWrapper.style.display = "none";
        toggleContainer.style.display = "none";
        setToggleOpen(false);

        (function(w, d, x, id){
            const s = d.createElement('script');
            s.src='https://p3fusion-learning.my.connect.aws/connectwidget/static/amazon-connect-chat-interface-client.js';
            s.async=1; s.id=id;
            d.getElementsByTagName('head')[0].appendChild(s);
            w[x] =  w[x] || function() { (w[x].ac = w[x].ac || []).push(arguments) };
        })(window, document, 'amazon_connect', '9ff93ffd-9c5a-4f11-a113-7a29bfed1b13');

        amazon_connect('styles', {
            iconType: 'CHAT',
            openChat:  { color: '#ffffff', backgroundColor: '#123456' },
            closeChat: { color: '#ffffff', backgroundColor: '#123456' }
        });
        amazon_connect('snippetId', 'QVFJREFIaXdlaTllQXR1SnQyK1JZc1Z3dWE3clBZQjQvWm15emlVb25scEltc3BJNmdGaWRzWmZhQTFZcWcxa0NOS0t5OVVvQUFBQWJqQnNCZ2txaGtpRzl3MEJCd2FnWHpCZEFnRUFNRmdHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFNQk5lVkVocnBFRlZRRVlScEFnRVFnQ3N4SnMxdkdFZktKSWJYNEkxU0lRaFZkWHRtMkdLQi91b0JIbTQzTEI1WGJkV0kyd2UvOTNXWlhIck46OkQ2cWR4dndFVUZWNzk5bVV4aWM2cDh4ajdVanNBb2RxQWJFK3Q0UU5RZUl3QU1CcklpMWZUS1hHck4yd2dVUGZMMjNlOFhvTTFIUUZQVnV2WVVESkMzcktEN0xHUkpPQlIvd1g2NDhlMU5lVjRqRnRydldEYmxDdE1xbUxvUUZZSWF6Z1kzaUJkTThUZUlZZ294azdVNisrYzFjdVEyVT0=');
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
