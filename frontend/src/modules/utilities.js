import { socket } from '../../socket.js';
import { setupCanvas } from './gameSetup.js';
import { state } from './state.js';
import { setupSocketHandlers } from './socketHandler.js';

export function onLoad(startBtn) {
    let username = localStorage.getItem('playerToken');
    let room = localStorage.getItem('room');

    //join room with socket and check creator status
    socket.emit('game:join', username, room);
    console.log(`(F) ${username} has joined room: ${room}`);
    setupSocketHandlers(startBtn);
}

export function onCreatorStatus(currentRoomData, isCreator, startBtn) {
    console.log(`(F) Received isCreator Status: ${isCreator}`);
    if (isCreator) startBtn.classList.add('show'); //show button
    console.log(`(F) Received room data`);
    setupCanvas(currentRoomData); //ADDDD
}

// get new flags to spawn
export function spawnFlags(count, lastCollected = null) {
    socket.emit('game:request-flags', { count, lastCollected });
}

export function showLeaveScreen(results) {
    let playerScores = '';
    let heading = '<h2 class="popupheading">🏆 LEADERBOARDS</h2>';
    let button = '<button id="button1" class="popup-btn">Leave</button>';
    results.forEach((player, index) => {
        const isCurrentUser = player.username === localStorage.getItem('playerToken');
        const style = isCurrentUser ? 'style="color: green; font-weight: bold;"' : '';

        playerScores += ` <p class="popup-item" ${style}>${index + 1}. ${player.username} - ${player.flags} flags </p>`;
    });

    let template = heading + playerScores + button;

    document.querySelector('.popup-menu').innerHTML = template;
    document.getElementById('popup').classList.remove('hidden');
    cancelAnimationFrame(state.animationID);

    document.getElementById('button1').addEventListener('click', () => {
        navigateWithFade('/frontend/src/pages/rooms.html');
    });
}

export function redirectToHomeWithLocalStorage() {
    localStorage.removeItem('room');
    navigateWithFade('/frontend/src/pages/rooms.html');
}

export function sendPlayerUpdate() {
    const playerState = state.player.getState();
    socket.emit('player:get-update', playerState);
}
