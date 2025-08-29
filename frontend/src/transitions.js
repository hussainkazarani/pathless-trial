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
    }, 1000); // match CSS transition
};

// Validate Inputs
export function validateName(name) {
    return (
        typeof name === 'string' &&
        name.length > 0 && // not empty
        name.length <= 20 && // <= 20 chars
        !/\s/.test(name) && // no spaces
        /^[A-Za-z0-9]+$/.test(name) // only letters & numbers
    );
}
