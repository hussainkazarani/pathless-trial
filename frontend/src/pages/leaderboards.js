const socket = io();
const playersDiv = document.querySelector('.players');

window.addEventListener('load', () => {
    socket.emit('get-leaderboards');
});

socket.on('send-leaderboards', (data) => {
    // Clear previous content
    playersDiv.innerHTML = '';

    data.forEach((player, index) => {
        // player-item container
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';

        // number
        const numberDiv = document.createElement('div');
        numberDiv.className = 'number';
        numberDiv.textContent = `${index + 1}.`;

        // matter container
        const matterDiv = document.createElement('div');
        matterDiv.className = 'matter';

        // p1: name + games played
        const p1Div = document.createElement('div');
        p1Div.className = 'p1';

        const nameP = document.createElement('p');
        nameP.className = 'name';
        nameP.textContent = player.username;

        const gamesPlayedP = document.createElement('p');
        gamesPlayedP.className = 'game-played';
        gamesPlayedP.textContent = `Games Played: ${player.games_played}`;

        p1Div.appendChild(nameP);
        p1Div.appendChild(gamesPlayedP);

        // p2: flag + total flags
        const p2Div = document.createElement('div');
        p2Div.className = 'p2';

        const flagDiv = document.createElement('div');
        flagDiv.className = 'flag';
        flagDiv.textContent = '🚩';

        const totalFlagsP = document.createElement('p');
        totalFlagsP.textContent = `${player.total_flags} flags`;

        p2Div.appendChild(flagDiv);
        p2Div.appendChild(totalFlagsP);

        // assemble matter div
        matterDiv.appendChild(p1Div);
        matterDiv.appendChild(p2Div);

        // assemble player-item
        playerItem.appendChild(numberDiv);
        playerItem.appendChild(matterDiv);

        // append to players container
        playersDiv.appendChild(playerItem);
    });
});

document.querySelector('.backbtn').addEventListener('click', () => {
    if (checkLocalStorage()) navigateWithFade('/frontend/src/pages/rooms.html');
});

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
