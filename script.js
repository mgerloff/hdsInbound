function isWithinBusinessHours() {
    const now = new Date();

    const easternTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    const day = easternTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = easternTime.getHours();

    const isWeekday = day >= 1 && day <= 5; // Monday–Friday
    const isBusinessHour = hour >= 9 && hour < 17; // 9am to 5pm

    return isWeekday && isBusinessHour;
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

    (function(w, d, x, id){
    s=d.createElement('script');
    s.src='https://p3fusion-learning.my.connect.aws/connectwidget/static/amazon-connect-chat-interface-client.js';
    s.async=1;
    s.id=id;
    d.getElementsByTagName('head')[0].appendChild(s);
    w[x] =  w[x] || function() { (w[x].ac = w[x].ac || []).push(arguments) };
    })(window, document, 'amazon_connect', '9ff93ffd-9c5a-4f11-a113-7a29bfed1b13');
        amazon_connect('styles', { iconType: 'CHAT', openChat: { color: '#ffffff', backgroundColor: '#123456' }, closeChat: { color: '#ffffff', backgroundColor: '#123456'} });
        amazon_connect('snippetId', 'QVFJREFIaXdlaTllQXR1SnQyK1JZc1Z3dWE3clBZQjQvWm15emlVb25scEltc3BJNmdGaWRzWmZhQTFZcWcxa0NOS0t5OVVvQUFBQWJqQnNCZ2txaGtpRzl3MEJCd2FnWHpCZEFnRUFNRmdHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFNQk5lVkVocnBFRlZRRVlScEFnRVFnQ3N4SnMxdkdFZktKSWJYNEkxU0lRaFZkWHRtMkdLQi91b0JIbTQzTEI1WGJkV0kyd2UvOTNXWlhIck46OkQ2cWR4dndFVUZWNzk5bVV4aWM2cDh4ajdVanNBb2RxQWJFK3Q0UU5RZUl3QU1CcklpMWZUS1hHck4yd2dVUGZMMjNlOFhvTTFIUUZQVnV2WVVESkMzcktEN0xHUkpPQlIvd1g2NDhlMU5lVjRqRnRydldEYmxDdE1xbUxvUUZZSWF6Z1kzaUJkTThUZUlZZ294azdVNisrYzFjdVEyVT0=');
        amazon_connect('contactAttributes', {
        department,
        name,
        email,
        invoice,
        question
    });
    amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown', 'application/vnd.amazonaws.connect.message.interactive', 'application/vnd.amazonaws.connect.message.interactive.response' ]);

    setTimeout(() => {
    const widget = document.querySelector(".acWidgetContainer-0-0-1");
    if (widget) widget.style.display = "block";
    const launcher = widget?.querySelector("button");
    launcher?.click();
}, 800);
});
};
