import { socket } from '../socket.js';
import { ctx, canvas } from './canvas/initCanvas.js';
import { CameraManager } from './game/CameraManager.js';
import { CollisionManager } from './game/CollisionManager.js';
import { Flag } from './game/Flag.js';
import { InstanceState } from './game/InstanceState.js';
import { HUD } from './game/HUD.js';
import { Maze } from './game/Maze.js';
import { Player } from './game/Player.js';

let username;
let room;
let allPlayers = {};
let playerInitialized = false;
const startBtn = document.getElementById('start-game-timer');
let playerInterval = setInterval(syncPlayerPosition, 16);
let dbBoolean = false;

startBtn.addEventListener('click', () => {
    socket.emit('get-flags', room);
    socket.emit('start-game', room);
    //change the status on game to in-progress
    socket.emit('in-progress', room);
    startBtn.classList.remove('show');
    //   gameState.startGame();
});

window.addEventListener('load', () => {
    username = localStorage.getItem('username');
    room = localStorage.getItem('room');

    socket.emit('join-game-room', username, room); //join room with socket
    socket.emit('check-if-game-creator', username, room);
});

socket.on('is-creator', () => {
    startBtn.classList.add('show'); //show button
    socket.emit('create-maze', room); //create maze

    socket.emit('create-flags', room); //create flag - 1
    dbBoolean = true; //for only sending from creator side
});

socket.on('is-not-creator', () => {
    socket.emit('get-maze', room); //get maze data
});

socket.on('flag-data', (data) => {
    if (flag) {
        flag.loadData(data.flags);
    }
    // UPDATE THIS USER FLAG
    if (player) {
        player.updateFlagsInPlayer(data.playerStates[username].flags);
    }
});

//playerstate 4
socket.on('all-player-states', (data) => {
    allPlayers = data.playerStates;

    if (player && data.playerStates[username] && !playerInitialized) {
        player.loadData(data.playerStates[username]);
        playerInitialized = true;
    }
});

// timer and game start and end and flag updation of players
socket.on('send-timer', (data) => {
    if (instanceState) {
        instanceState.loadTimer(data.timer);
    }
});

socket.on('end-game', (data) => {
    clearInterval(playerInterval);
    //send to postgres here
    // const thisPlayer = {
    //   username: this.username,
    //   flags: allPlayers[this.username].flags,
    // };
    addGameToDB(data.playerStates);
    instanceState.endGame(data.playerStates);
});

let maze, collisionManager, flag, player, camera, instanceState, hud;
let buffer, bufferCtx;
const timer = 30;
export let animationID;

socket.on('maze-data', (allStates) => {
    // create maze and load data
    maze = new Maze(20, 20); //CHANGE TO DYNAMIC
    maze.loadData(allStates.maze.cellsMatrix);

    // save the maze in a buffer and draw maze
    buffer = createBuffer(canvas.width, canvas.height);
    bufferCtx = buffer.getContext('2d');
    maze.drawCells(bufferCtx);

    //player socket
    socket.emit('create-player-state', username, room); //playerstate 1

    if (maze.cellsMatrix && maze.cellsMatrix.length > 0) {
        // initialize game objects
        collisionManager = new CollisionManager(maze);
        // flag = new Flag(maze);
        player = new Player(maze, collisionManager);
        camera = new CameraManager(canvas, maze, 3);
        instanceState = new InstanceState(player, username, timer);
        hud = new HUD(instanceState); //CHANGE;

        // animate
        animate();
    }
});

function createBuffer(width, height) {
    const buf = document.createElement('canvas');
    buf.width = width;
    buf.height = height;
    return buf;
}

function animate() {
    if (!maze) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   camera.followPlayer(player);
    //   camera.applyTransform(ctx);
    ctx.drawImage(buffer, 0, 0); //Blit
    // if (flag) {
    //     flag.draw(ctx); //CHANGE
    // }

    if (player) {
        //   player.draw(ctx);
        player.updateCurrentCell();
        player.update();
        if (allPlayers[username]) {
            allPlayers[username].x = player.x;
            allPlayers[username].y = player.y;
        }
    }
    // drawing all players
    Object.keys(allPlayers).forEach((player) => {
        const playerData = allPlayers[player];
        ctx.fillRect(playerData.x, playerData.y, playerData.size, playerData.size);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillStyle = playerData.color;
        ctx.fillText(player, playerData.x, playerData.y - 5);
    });

    // collisionManager.checkFlagCollision(player, flag.currentFlags);
    //   camera.resetTransform(ctx);
    hud.drawTimerUI(ctx);
    // hud.drawPlayerFlags(ctx);
    animationID = requestAnimationFrame(animate);
}

function syncPlayerPosition() {
    if (player) {
        socket.emit('update-player-position', username, room, {
            x: player.x,
            y: player.y,
            currentCell: player.playerCurrentCell,
        });
    }
}

export function sendFlagCollision(index) {
    socket.emit('flag-collision-detected', username, room, index);
}
export function removeGame() {
    socket.emit('remove-game', room);
}

//Adding room and players to DB
export function addGameToDB(playerStates) {
    if (dbBoolean) {
        console.log('🔍 playerStates received:', JSON.stringify(playerStates, null, 2));
        let tempList = [];

        Object.keys(playerStates).forEach((player) => {
            console.log('🔍 Processing player:', player);
            console.log('🔍 Player data:', playerStates[player]);
            tempList.push({
                username: player,
                flags: playerStates[player].flags,
            });
        });
        tempList.sort((a, b) => b.flags - a.flags);

        console.log('🔍 Final tempList:', JSON.stringify(tempList, null, 2));
        socket.emit('add-room-db', tempList, room, timer);
    }
}

// on refresh/close move to rooms
// window.addEventListener('beforeunload', (event) => {
//     const room = localStorage.getItem('room');
//     if (room) navigator.sendBeacon('/api/refreshed', JSON.stringify({ room }));
//     localStorage.removeItem('room');
//     window.location.replace('/frontend/src/pages/rooms.html');
// });

socket.on('replace-game', ({ room, players }) => {
    console.log(`Game ${room} was removed. Players affected:`, players);
    localStorage.removeItem('room');
    window.location.replace('/frontend/src/pages/rooms.html');
});

// function checkLocalStorage() {
//     const token = localStorage.getItem('playerToken'); // fetch fresh
//     if (!token) {
//         navigator.sendBeacon('/api/remove-player', JSON.stringify({ username: localStorage.getItem('username') }));
//         localStorage.clear();
//         window.location.replace('/frontend/src/pages/home.html');
//         return false;
//     }
//     console.log('Player token found:', token);
//     return true;
// }
