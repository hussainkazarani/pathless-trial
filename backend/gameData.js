import { Cell, Flag, Maze } from './Classes.js'; //backend
import { MazeGenerator } from './MazeGenerator.js'; //backend

/*
gameData : {
	rooms : {
		"roomName" : {
			players: ["creator", "player2"],
			maxPlayers: 4,
			status: "waiting",
			gameState: {
				timer: 30,
				maze: {
					columns: 20,
					rows: 20,
					cellsMatrix: [][][][]..,
				},
				flags: {
					allFlags: allFlagsArray,
					currentFlags: currentFlags,
				},
				playerStates: {
					"username": {
						x: 0,
						y: 0,
						size: 25,
						flags: 0,
						color: #FFFFF,
						speed: 7,
					},
				},
			},
		},
	},

	players : {
		"username" : {
			currentRoom: "roomName",
			status: "lobby",
		},
	},
}
*/

export let timerID;
export let gameData = {
    rooms: {},
    players: {},
};

//createRoom
export function createRoom(roomName, userName) {
    gameData.rooms[roomName] = {
        players: [userName],
        maxPlayers: 4,
        status: 'waiting',
        gameState: null,
    };

    gameData.players[userName] = {
        currentRoom: roomName,
        status: 'in-game',
        // isGameCreator: true,
    };
}
//joinRoom - could simplify later
export function joinRoom(roomName, userName) {
    let room = gameData.rooms[roomName];
    if (room.players.includes(userName)) return;
    if (room.players.length >= room.maxPlayers) return;
    room.players.push(userName);

    let player = gameData.players[userName];
    player.currentRoom = roomName;
    player.status = 'in-game';
    //   player.isGameCreator = false;
}

export function checkUsername(username) {
    if (Object.keys(gameData.players).includes(username)) return false;
    return true;
}

export function checkRoom(room) {
    if (Object.keys(gameData.rooms).includes(room)) return false;
    return true;
}

//addPlayer
export function addPlayer(name) {
    if (gameData.players[name]) return;
    gameData.players[name] = {
        currentRoom: null,
        status: 'lobby',
        // isGameCreator: false,
    };
}

export function createMazeData(room) {
    const maze = new Maze(20, 20); //1
    maze.initializeCells(); // 2
    const generator = new MazeGenerator(maze); // 3
    generator.generateDFS(); // 4
    addMazeDataToRoom(room, maze);
}

function addMazeDataToRoom(room, maze) {
    gameData.rooms[room].gameState = {
        maze: {
            columns: maze.columns,
            rows: maze.rows,
            cellsMatrix: maze.cellsMatrix,
        },
    };
    // console.log(JSON.stringify(gameData.rooms[room].gameState, null, 2));
}

export function checkIfCreator(username, room) {
    if (gameData.rooms[room].players[0] == username) return true;
    return false;
}

export function createFlagsData(room, amt = 10) {
    // const game = gameData.rooms[room].gameState;
    // const flag = new Flag(game.maze, amt);
    // let allFlagsArray = flag.createPositions();
    // let currentFlags = choosePositions(2, allFlagsArray);
    // addFlagDataToRoom(room, allFlagsArray, currentFlags);
}

function choosePositions(amount, allFlags) {
    let chosenFlags = [];
    for (let i = 0; i < amount; i++) {
        const chosen = Math.floor(Math.random() * allFlags.length);
        let flag = allFlags[chosen];
        chosenFlags.push(flag);
        allFlags.splice(chosen, 1);
    }
    return chosenFlags;
}

function addFlagDataToRoom(room, allFlagsArray, currentFlags) {
    gameData.rooms[room].gameState.flags = {
        allFlags: allFlagsArray,
        currentFlags: currentFlags,
    };
}

//playerstate 3
export function createPlayerStates(username, room) {
    const game = gameData.rooms[room].gameState;
    // initialize if not present
    if (!game.playerStates) {
        game.playerStates = {};
    }

    const row = Math.floor(Math.random() * game.maze.rows);
    const col = Math.floor(Math.random() * game.maze.columns);
    const cellSize = game.maze.cellsMatrix[0][0].size;
    const playerSize = 25;

    const playerCurrentCell = game.maze.cellsMatrix[row][col];
    const x = playerCurrentCell.x * cellSize + (cellSize - playerSize) / 2;
    const y = playerCurrentCell.y * cellSize + (cellSize - playerSize) / 2;

    gameData.rooms[room].gameState.playerStates[username] = {
        x: x,
        y: y,
        size: playerSize,
        flags: 0,
        color: '#ff5d8f',
        speed: 7,
        currentCell: playerCurrentCell,
    };
}

export function performFlagCollisionUpdation(username, room, index) {
    let game = gameData.rooms[room].gameState;
    //   console.log("insidde perform function with game - \n\n", game);
    //remove current flag and update user
    //   let chosen = game.flags.currentFlags[index];
    game.flags.currentFlags.splice(index, 1);
    game.playerStates[username].flags++;
    //add new flag to data
    const addedFlags = choosePositions(1, game.flags.allFlags);
    game.flags.currentFlags.push(addedFlags[0]);
}

export function initializeTimer(room, value) {
    let game = gameData.rooms[room].gameState;
    game.timer = value;
}

export function startTimer(room, emitCallback) {
    timerID = setInterval(() => {
        updateTimer(room, emitCallback);
    }, 1000);
}

function updateTimer(room, emitCallback) {
    let game = gameData.rooms[room].gameState;
    game.timer--;
    if (game.timer <= 0) {
        console.log('GAME HAS ENDED!');
        emitCallback(false);
        clearInterval(timerID);
    } else {
        emitCallback(true);
    }
}

export function removeGameFromBackend(room) {
    if (!gameData.rooms[room] || !gameData.rooms[room].gameState) {
        console.log('Room already removed:', room);
        return; // Room already deleted
    }

    let players = Object.keys(gameData.rooms[room].gameState.playerStates);
    players.forEach((player) => {
        let thisPlayerData = gameData.players[player];
        thisPlayerData.currentRoom = null;
        thisPlayerData.status = 'lobby';
    });

    delete gameData.rooms[room];
}

// remove a player completely from gameData.players
export function removePlayer(userName) {
    if (!gameData.players[userName]) return;

    // if they are in a room, also remove them from that room's players array
    const roomName = gameData.players[userName].currentRoom;
    if (roomName && gameData.rooms[roomName]) {
        gameData.rooms[roomName].players = gameData.rooms[roomName].players.filter((p) => p !== userName);

        // if the room becomes empty, delete it
        if (gameData.rooms[roomName].players.length === 0) {
            delete gameData.rooms[roomName];
        }
    }

    // finally remove from players
    delete gameData.players[userName];
}

// remove any rooms the player might have created (first player in players array)
export function removeRoomsCreatedBy(userName) {
    for (const roomName in gameData.rooms) {
        if (gameData.rooms[roomName].players[0] === userName) {
            // delete the room
            delete gameData.rooms[roomName];

            // also update any players that were in that room
            for (const otherPlayer of gameData.rooms[roomName]?.players || []) {
                if (gameData.players[otherPlayer]) {
                    gameData.players[otherPlayer].currentRoom = null;
                    gameData.players[otherPlayer].status = 'lobby';
                }
            }
        }
    }
}

export function changeGameState(room) {
    // Check if the room exists
    if (gameData.rooms[room]) {
        // Update the room's status to 'in-progress'
        gameData.rooms[room].status = 'in-progress';
        console.log(`Room ${room} status changed to in-progress`);
    } else {
        console.error(`Room ${room} not found!`);
    }
}
