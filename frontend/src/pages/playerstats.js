const socket = io();

const p1Elements = document.getElementsByClassName('p1');
const p2Elements = document.getElementsByClassName('p2');
const username = localStorage.getItem('username');

const p1 = p1Elements.length > 0 ? p1Elements[0] : null;
const p2 = p2Elements.length > 0 ? p2Elements[0] : null;

addEventListener('load', () => {
    if (!p1 && !p2) return;
    socket.emit('get-stats', username);
});

socket.on('send-stats', (data) => {
    // PROFILE STATS
    if (p1) {
        p1.innerHTML = ''; // clear previous content
        if (!data || !data.player) {
            p1.innerHTML = `<p class="test-1">No profile data</p>`;
        } else {
            const player = data.player;

            p1.innerHTML = `
                <div class="player-profile-p1">
                    <img src="/assets/other/user.svg" />
                    <p><span class="label">Username:</span> <span class="value">${player.username}</span></p>
                </div>
                <div class="player-profile-p2">
                    <img src="/assets/other/goal.svg" />
                    <p><span class="label">Total Flags:</span> <span class="value">${player.total_flags}</span></p>
                </div>
                <div class="player-profile-p3">
                    <img src="/assets/other/game2.svg" />
                    <p><span class="label">Games Played:</span> <span class="value">${player.games_played}</span></p>
                </div>
                <div class="player-profile-p4">
                    <img src="/assets/other/create.svg" />
                    <p><span class="label">Account Created:</span> <span class="value">${new Date(
                        player.created_at,
                    ).toLocaleString()}</span></p>
                </div>
            `;
        }
    }

    // GAME HISTORY
    if (p2) {
        p2.innerHTML = ''; // clear previous games
        if (!data || !data.game || data.game.length === 0) {
            const noGames = document.createElement('p');
            noGames.classList.add('test-1');
            noGames.textContent = 'No games played';
            p2.appendChild(noGames);
        } else {
            data.game.forEach((game) => {
                const container = document.createElement('div');
                container.classList.add('container');

                container.innerHTML = `
                    <p><span class="value2 name1">${game.room}</span></p>
                    <p><span class="label2">Flags Collected:</span> <span class="value2">${game.flags}</span></p>
                    <p><span class="label2">Played:</span> <span class="value2">${new Date(
                        game.created,
                    ).toLocaleString()}</span></p>
                `;

                p2.appendChild(container);
            });
        }
    }
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
