window.addEventListener('DOMContentLoaded', () => {
    // Trigger fade-in
    requestAnimationFrame(() => {
        document.body.classList.remove('preload');
    });
});

// Helper for button/JS-triggered navigation
window.navigateWithFade = function (url) {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.replace(url);
    }, 2000); // match CSS transition
};

function sendDisconnect() {
    const username = localStorage.getItem('username');
    if (!username) return;

    const payload = JSON.stringify({ username });

    // Prefer sendBeacon (designed for unload)
    if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/disconnect', blob);
    } else {
        // Fallback for old browsers
        try {
            fetch('/disconnect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true,
            });
        } catch (_) {}
    }
}

// Fire on refresh/close/navigation
// window.addEventListener('beforeunload', sendDisconnect);

// function checkLocalStorage(playerToken) {}
