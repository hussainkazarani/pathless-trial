import { Flag, Maze } from './Classes.js'; //backend
import { MazeGenerator } from './MazeGenerator.js'; //backend
import { model } from './Model.js';
export { model };
import config from '../shared/config.js';

// ========== HOME ==========
// Check if a username is available to join the game
export function isUsernameAvailable(username) {
    return !model.users.includes(username);
}

// ========== ROOM ON-LOAD ==========
// Add a new player to the model
export function registerPlayer(name) {
    if (model.users.includes(name)) return; //MAYBE RESTART?
    model.addUser(name);
}

// ========== ROOM ON-CLICK ==========
// Check if a room name is available
export function isRoomAvailable(room) {
    return !Object.keys(model.rooms).includes(room);
}

// Create a room with a generated maze
export function createRoomWithMaze(username, room) {
    const maze = new Maze(config.cols, config.rows);
    maze.initializeCells();
    const generator = new MazeGenerator(maze);
    generator.generateDFS();
    const flag = new Flag();
    const availableCells = getAvailableCellsFromMaze(maze.cellsMatrix);
    const roomFlagPositions = flag.generateRandomPosition(availableCells);
    model.addRoom(room, maze.cellsMatrix, username, roomFlagPositions);
}

export function placePlayerInMaze(username, room) {
    const maze = model.rooms[room]?.maze;
    if (!maze) return;

    const availableCells = getAvailableCellsFromMaze(model.rooms[room].maze);
    const playerPosition = availableCells[Math.floor(Math.random() * availableCells.length)];

    const cellSize = config.cellSize;
    const playerSize = config.playerSize;

    const takenColors = Object.values(model.rooms[room].players).map((p) => p.color);
    const availableColors = config.colors.filter((color) => !takenColors.includes(color));
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]; // picks a random color

    const center = (cellSize - playerSize) / 2;
    const x = playerPosition.col * cellSize + center; // col → x
    const y = playerPosition.row * cellSize + center; // row → y

    model.rooms[room].addPlayer(username, x, y, randomColor);
}

// Collects all walkable cells from the maze
function getAvailableCellsFromMaze(cellsMatrix) {
    const available = [];

    for (let row = 0; row < cellsMatrix.length; row++) {
        for (let col = 0; col < cellsMatrix[row].length; col++) {
            const cell = cellsMatrix[row][col];
            if (cell.walkable) {
                available.push({ row, col });
            }
        }
    }

    return available;
}
// ========== GAME ==========
// Check if a player is the creator of a room
export function isRoomCreator(username, room) {
    return model.rooms[room]?.creator === username;
}

export function addActiveFlag(count, room) {
    const toActivate = [];
    for (let i = 0; i < count && model.rooms[room].allflagPositions.length > 0; i++) {
        const index = Math.floor(Math.random() * model.rooms[room].allflagPositions.length);
        const flag = model.rooms[room].allflagPositions.splice(index, 1)[0];
        toActivate.push(flag);
    }

    model.rooms[room].currentflagPositions.push(...toActivate);
    return toActivate;
}

export function removeActiveFlag(room, row, col) {
    const index = model.rooms[room].currentflagPositions.findIndex((f) => f.row === row && f.col === col);

    if (index !== -1) {
        return model.rooms[room].currentflagPositions.splice(index, 1)[0]; // return removed flag
    }
}

// Remove only the Room
export function removeGame(room) {
    if (!model.rooms[room]) {
        console.log('Room already removed:', room);
        return;
    }
    delete model.rooms[room];
}

// ========== REMOVALS ==========
// Remove a player completely from the backend
export function removePlayer(username, io) {
    // 1️⃣ Remove rooms created by this player
    for (const roomName in model.rooms) {
        const room = model.rooms[roomName];
        if (room.creator === username) {
            io.to(roomName).emit('error:room-closed');
            const roomSockets = io.sockets.adapter.rooms.get(roomName);
            if (roomSockets) {
                roomSockets.forEach((socketId) => {
                    const s = io.sockets.sockets.get(socketId);
                    s.leave(roomName);
                });
            }
            delete model.rooms[roomName];
        }
    }

    // 2️⃣ Remove player from users list
    const index = model.users.indexOf(username);
    if (index > -1) {
        model.users.splice(index, 1);
    }

    console.log(model.users);
    // 3️⃣ Broadcast updated online users to everyone
    io.emit('player:set-online-status', model.users);
    io.emit('room:set-list', model.rooms);
}
