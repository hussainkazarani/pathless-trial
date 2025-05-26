export const keys = {
    up: false,
    right: false,
    down: false,
    left: false,
};

addEventListener('keydown', (event) => {
    if (event.code == 'ArrowUp') keys.up = true;
    if (event.code == 'ArrowRight') keys.right = true;
    if (event.code == 'ArrowDown') keys.down = true;
    if (event.code == 'ArrowLeft') keys.left = true;
});
addEventListener('keyup', (event) => {
    if (event.code == 'ArrowUp') keys.up = false;
    if (event.code == 'ArrowRight') keys.right = false;
    if (event.code == 'ArrowDown') keys.down = false;
    if (event.code == 'ArrowLeft') keys.left = false;
});
