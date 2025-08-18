import { socket } from '../../socket.js';

// export const usernameFromBrowser = localStorage.getItem('username');
const createBtn = document.getElementById('create-game');
const inputRoom = document.getElementById('input-create-game');
const activity = document.querySelector('.online-players');
// let localStorageUsername = localStorage.getItem('username');
let resetTimeout;
let internalNavigation = false;

createBtn.addEventListener('click', () => {
    internalNavigation = true;
    if (checkLocalStorage()) {
        if (inputRoom.value.length > 0) {
            socket.emit('check-room-creation', inputRoom.value); //here
        }
    }
});

window.addEventListener('load', () => {
    if (checkLocalStorage()) {
        let localStorageUsername = localStorage.getItem('username');
        socket.emit('get-username', localStorageUsername);
        socket.emit('check-db', localStorageUsername); // DB checks and creates player
        socket.emit('get-rooms');
        socket.emit('send-online-activity');
    }
});

socket.on('room-taken', () => {
    inputRoom.style.border = '2px solid #8f3d3d';
    inputRoom.style.backgroundColor = '#e0b8b8';
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
        inputRoom.style.border = '';
        inputRoom.style.backgroundColor = '';
    }, 4000);
});

socket.on('room-available', () => {
    if (checkLocalStorage()) {
        let localStorageUsername = localStorage.getItem('username');
        socket.emit('create-room', localStorageUsername, inputRoom.value);
        localStorage.setItem('room', inputRoom.value);
        console.log('about to join room as creator with roomid - ' + inputRoom.value);
        navigateWithFade('/frontend/index.html');
    }
});

socket.on('online-players', (players) => {
    activity.innerHTML = '';
    players.forEach((player) => {
        // wrapper for each player
        const wrapper = document.createElement('div');
        wrapper.className = 'player-item-wrapper';

        // green online dot
        const dot = document.createElement('div');
        dot.className = 'online-dot';

        // player name
        const p = document.createElement('p');
        p.className = 'player-item';
        p.textContent = player;

        wrapper.appendChild(dot);
        wrapper.appendChild(p);

        activity.appendChild(wrapper);
    });
});

socket.on('get-games', (rooms) => {
    const cardsDiv = document.querySelector('.cards-grid');
    cardsDiv.innerHTML = '';

    Object.keys(rooms).forEach((room) => {
        // create card container
        const card = document.createElement('div');
        card.className = 'cardOfGame';

        // top row: game name + players
        const topRow = document.createElement('div');
        topRow.className = 'card-p1';

        const gameName = document.createElement('p');
        gameName.className = 'game-name';
        gameName.id = 'game-number';
        gameName.textContent = room;

        const playerCount = document.createElement('p');
        playerCount.className = 'game-numbers';
        playerCount.id = 'game-player';
        playerCount.textContent = `${rooms[room].players.length}/${rooms[room].maxPlayers}`;

        topRow.appendChild(gameName);
        topRow.appendChild(playerCount);

        // creator
        const creator = document.createElement('p');
        creator.className = 'game-creator';
        creator.id = 'game-creator';
        creator.textContent = `Started By: ${rooms[room].players[0]}`;

        const joinBtn = document.createElement('button');
        joinBtn.className = 'game-join';
        joinBtn.id = 'game-join-button';
        joinBtn.textContent = 'Join';

        if (rooms[room].status === 'in-progress') {
            joinBtn.style.backgroundColor = '#b8e0b8';
            joinBtn.style.border = '2px solid #3d8f3d';
            joinBtn.style.color = 'black';
            joinBtn.textContent = 'In Progress';
            joinBtn.disabled = true;
            joinBtn.style.cursor = 'not-allowed';
        }

        joinBtn.addEventListener('click', () => {
            internalNavigation = true;
            if (checkLocalStorage()) {
                let localStorageUsername = localStorage.getItem('username');

                localStorage.setItem('room', room);
                socket.emit('join-room', localStorageUsername, room);
                navigateWithFade('/frontend/index.html');
            }
        });

        // append all to card
        card.appendChild(topRow);
        card.appendChild(creator);
        card.appendChild(joinBtn);

        // append card to grid
        cardsDiv.appendChild(card);
    });
});

const leaderboardBtn = document.getElementById('leaderboardBtn');
leaderboardBtn.addEventListener('click', () => {
    internalNavigation = true;
    if (checkLocalStorage()) navigateWithFade('/frontend/src/pages/leaderboards.html');
});

const playerBtn = document.getElementById('playerBtn');
playerBtn.addEventListener('click', () => {
    internalNavigation = true;
    if (checkLocalStorage()) navigateWithFade('/frontend/src/pages/playerstats.html');
});

// Redirect on refresh or leave
// if (performance.getEntriesByType('navigation')[0].type === 'reload') {
//     window.location.replace('/frontend/src/pages/home.html');
// }

window.addEventListener('beforeunload', (event) => {
    // Send a signal to the server to remove the player
    if (!internalNavigation) {
        navigator.sendBeacon('/api/remove-player', JSON.stringify({ username: localStorage.getItem('username') }));
        localStorage.clear();
        window.location.replace('/frontend/src/pages/home.html');
    }
});

function checkLocalStorage() {
    const token = localStorage.getItem('playerToken'); // fetch fresh
    if (!token) {
        navigator.sendBeacon('/api/remove-player', JSON.stringify({ username: localStorage.getItem('username') }));
        localStorage.clear();
        window.location.replace('/frontend/src/pages/home.html');
        return false;
    }
    console.log('Player token found:', token);
    return true;
}
