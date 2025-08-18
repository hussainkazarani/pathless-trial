const socket = io();

const playBtn = document.querySelector('.btn');
const input = document.getElementById('player-name');
const input_class = document.querySelector('.namebox');
const nameOfUser = localStorage.getItem('username');
const page = document.querySelector('.page');
let username = '';
let isButtonClick = false;

window.addEventListener('load', () => {
    if (localStorage.getItem('username')) {
        navigator.sendBeacon('/api/remove-player', JSON.stringify({ username: localStorage.getItem('username') }));
        localStorage.clear();
    }
});

input.addEventListener('input', () => {
    if (input.value.length == 0) {
        input_class.classList.remove('success');
        input_class.classList.remove('error');
    }
    if (input.value.length > 0) {
        isButtonClick = false;
        socket.emit('check-username', input.value);
    }
});

playBtn.addEventListener('click', () => {
    if (input.value.length > 0) {
        isButtonClick = true;
        socket.emit('check-username', input.value);
        // username = input.value;
    }
});

socket.on('username-taken', () => {
    input_class.classList.remove('success');
    input_class.classList.add('error');
});

socket.on('username-available', () => {
    input_class.classList.remove('error');
    input_class.classList.add('success');
    if (isButtonClick) {
        localStorage.setItem('username', input.value);
        console.log('Welcome! ' + username);
        localStorage.setItem('playerToken', input.value);
        navigateWithFade('/frontend/src/pages/rooms.html');
    }
});
