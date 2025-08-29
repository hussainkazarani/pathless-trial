const socket = io();
const playersDiv = document.querySelector('.players');
const username = localStorage.getItem('playerToken');
let internalNavigation = false;

window.addEventListener('load', () => {
    if (username == null) {
        redirectToHome();
        return;
    }
    socket.emit('other:set-backend-username', username);
    socket.emit('leaderboard:get');
});

socket.on('leaderboard:data', (data) => {
    console.log(`(F) Received leaderboards`);

    // Clear previous content
    playersDiv.innerHTML = '';
    const currentUser = localStorage.getItem('playerToken');

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

        // highlight if current user
        if (player.username === currentUser) {
            numberDiv.style.color = 'green';
            nameP.style.color = 'green';
            nameP.style.fontWeight = 'bold';
        }

        // append to players container
        playersDiv.appendChild(playerItem);
    });
});

document.querySelector('.backbtn').addEventListener('click', () => {
    internalNavigation = true;
    if (verifyPlayer()) navigateWithFade('/frontend/src/pages/rooms.html');
});

window.addEventListener('beforeunload', (event) => {
    // Send a signal to the server to remove the player
    if (!internalNavigation) {
        console.log('Removed LocalStorage in leaderboards');
        navigator.sendBeacon('/api/remove-player', JSON.stringify({ username: localStorage.getItem('playerToken') }));
        localStorage.clear();
    }
});

// Verify the LocalStorage and backend value of username
async function verifyPlayer() {
    // no token
    const token = localStorage.getItem('playerToken');
    if (!token) {
        redirectToHome();
        return false;
    }

    // backend check with callback
    socket.emit('player:verify-backend', token, (backendUsername, exists) => {
        if (!exists) {
            console.log(`Backend username is ${backendUsername} so its ${exists}`);
            navigator.sendBeacon('/api/remove-player', JSON.stringify({ username: backendUsername }));
            redirectToHome();
        }
    });
    return true;
}

function redirectToHome() {
    localStorage.clear();
    window.location.replace('/frontend/src/pages/home.html');
}
