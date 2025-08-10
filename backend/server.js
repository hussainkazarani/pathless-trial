import http from "http";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import pkg from "pg";
import { Server } from "socket.io";
import {
  addPlayer,
  checkUsername,
  createRoom,
  gameData,
  joinRoom,
  checkRoom,
  createMazeData,
  checkIfCreator,
  createFlagsData,
  createPlayerStates,
  performFlagCollisionUpdation,
  initializeTimer,
  startTimer,
  removeGameFromBackend,
} from "./gameData.js";

dotenv.config({ path: "../.env" });
const port = process.env.PORT;
console.log(port);
const { Pool } = pkg;
const pool = new Pool({
  user: "judge",
  //   host: "localhost",
  //   host: "host.docker.internal",
  host: "custom-postgres",
  database: "pathless_trails",
  password: "pathless",
  port: 5432,
});

const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const basePath = path.dirname(__dirname);

const server = http.createServer(async (req, res) => {
  let filePath = "";
  let contentType = "text/html";

  // base url and other urls
  //   if (req.url === "/") {
  //     filePath = path.join(basePath, "frontend", "src", "pages", "home.html");
  //   } else {
  //     filePath = path.join(basePath, req.url);
  //     // console.log(filePath);
  //   }
  if (req.url === "/" || req.url === "/game" || req.url === "/game/") {
    filePath = path.join(basePath, "frontend", "src", "pages", "home.html");
  } else {
    filePath = path.join(basePath, req.url.replace(/^\/game/, ""));
  }

  //if file doesnt exist
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "error found" }));
    return;
  }

  //get the data˛
  try {
    const data = await fs.promises.readFile(filePath);
    contentType = getContentType(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "internal server error" }));
  }
});

//SOCKET.IO
let socketName = "";
const io = new Server(server);

io.on("connection", (socket) => {
  // ROOM
  io.emit("get-games", gameData.rooms);

  // ROOM
  socket.on("get-username", (username) => {
    socketName = username;
    addPlayer(socketName);
  });

  // ROOM
  socket.on("create-room", (username, roomName) => {
    createRoom(roomName, username);
    io.emit("get-games", gameData.rooms);
  });

  // ROOM
  socket.on("join-room", (username, roomName) => {
    joinRoom(roomName, username);
    io.emit("get-games", gameData.rooms);
  });

  // ROOM
  socket.on("join-game-room", (username, room) => {
    socket.join(room);
    console.log(`${username} joined the room ${room} in the game`);
  });

  // ROOM
  socket.on("get-rooms", () => {
    socket.emit("get-games", gameData.rooms);
  });

  // HOME
  socket.on("check-username", (username) => {
    const status = checkUsername(username);
    if (!status) socket.emit("username-taken");
    else socket.emit("username-available");
  });

  // ROOM
  socket.on("check-room-creation", (roomName) => {
    const status = checkRoom(roomName);
    if (!status) socket.emit("room-taken");
    else socket.emit("room-available");
  });

  // ROOM
  socket.on("send-online-activity", () => {
    io.emit("online-players", Object.keys(gameData.players));
  });

  // GAME CANVAS PLAYERS LOGIC
  // GAME
  socket.on("check-if-game-creator", (username, room) => {
    const isCreator = checkIfCreator(username, room);
    if (isCreator) {
      socket.emit("is-creator");
    } else {
      socket.emit("is-not-creator");
    }
  });

  socket.on("create-maze", (room) => {
    createMazeData(room);
    socket.emit("maze-data", gameData.rooms[room].gameState);
  });

  socket.on("get-maze", (room) => {
    socket.emit("maze-data", gameData.rooms[room].gameState);
  });

  socket.on("create-flags", (room) => {
    createFlagsData(room, 20);
  });

  socket.on("get-flags", (room) => {
    io.to(room).emit("flag-data", gameData.rooms[room].gameState); //sends on creator clicking
  });

  //PLAYER STATE
  //playerstate 2
  socket.on("create-player-state", (username, room) => {
    createPlayerStates(username, room);
    io.to(room).emit("all-player-states", gameData.rooms[room].gameState);
  });

  socket.on("update-player-position", (username, room, position) => {
    gameData.rooms[room].gameState.playerStates[username].x = position.x;
    gameData.rooms[room].gameState.playerStates[username].y = position.y;
    gameData.rooms[room].gameState.playerStates[username].currentCell = position.currentCell;
    // console.log(`Updated Coords of ${username} with x=${position.x} and y=${position.y}`);
    io.to(room).emit("all-player-states", gameData.rooms[room].gameState);
  });

  //FLAG COLLISION
  socket.on("flag-collision-detected", (username, room, index) => {
    performFlagCollisionUpdation(username, room, index);
    io.to(room).emit("flag-data", gameData.rooms[room].gameState);
    io.to(room).emit("all-player-states", gameData.rooms[room].gameState); //MAYBE ADD FLAG STUUF IF NEED FOR RANKING
  });

  //START AND END GAME
  socket.on("start-game", (room) => {
    initializeTimer(room, 30);
    startTimer(room, (gameActive) => {
      const game = gameData.rooms[room].gameState;
      io.to(room).emit("send-timer", game);
      if (!gameActive) {
        io.to(room).emit("end-game", game);
      }
    });
    // const timer = startTimer
  });

  socket.on("remove-game", (room) => {
    removeGameFromBackend(room);
    io.emit("get-games", gameData.rooms);
  });

  //   DATABASEE
  socket.on("check-db", async (username) => {
    console.log("INSIDE DB COMPLETION");
    await addPlayerToDB(username);
    console.log("COMPLETED FUNCTION DBB");
  });

  socket.on("add-room-db", async (allPlayers, room, timer) => {
    await addCompletedRoomToDB(allPlayers, room, timer);
  });

  socket.on("get-leaderboards", async () => {
    const result = await getLeaderboards();
    socket.emit("send-leaderboards", result);
  });

  socket.on("get-stats", async (username) => {
    //player object with game and player
    const result = await getPlayerHistory(username);
    socket.emit("send-stats", result);
  });
});

server.listen(port, "0.0.0.0", async () => {
  con();
});

function getContentType(filePath) {
  const ext = path.extname(filePath);
  const type = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
  };
  return type[ext];
}

//DB QUERIES
const con = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL!");
    // const rows = await client.query(`SELECT * FROM players;`);
    // console.log(rows.rows);
    client.release();
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
};

const addPlayerToDB = async (username) => {
  try {
    const result = await pool.query(`INSERT INTO players (username) VALUES ($1) ON CONFLICT (username) DO NOTHING`, [
      username,
    ]);
    if (result.rowCount > 0) console.log(`✅ Player ${username} added`);
    else console.log(`ℹ️ Player ${username} already exists`);
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
};

const addCompletedRoomToDB = async (allPlayerWithFlag, room, timer) => {
  const client = await pool.connect();

  try {
    for (const player of allPlayerWithFlag) {
      const result = await client.query(
        `INSERT INTO matches (username, room_name, flags, game_time)
				  VALUES ($1, $2, $3, $4) `,
        [player.username, room, player.flags, timer]
      );

      const result2 = await client.query(
        `UPDATE players
		  SET total_flags = total_flags + $1,
			  games_played = games_played + 1,
			  rooms_played = array_append(rooms_played, $2)
		  WHERE username = $3
		  `,
        [player.flags, room, player.username]
      );
    }
  } catch (error) {
    console.error("❌ Room completion error:", error);
  } finally {
    client.release();
  }
};

//  mainData
// {
// username - "khush",
// total_flags - 432,
// creation : 15 jan 200 31:49:000
//  games_played: 10
//   }

//templist
//[
// {
// 	room - "heelo",
//  flags - 4,
//  created_at - 15 july 31:49:00
// } , ..
// ]

const getPlayerHistory = async (username) => {
  const client = await pool.connect();
  let mainData = {};
  let tempList = [];
  try {
    const result1 = await client.query(
      `SELECT username, total_flags, games_played, rooms_played, created_at FROM players WHERE username=$1;`,
      [username]
    );

    mainData = {
      username: result1.rows[0].username,
      total_flags: result1.rows[0].total_flags,
      games_played: result1.rows[0].games_played,
      rooms_played: result1.rows[0].rooms_played,
      created_at: result1.rows[0].created_at,
    };

    result1.rows[0];

    const result2 = await client.query(
      `
		SELECT room_name, flags, game_time, created_at FROM matches
		WHERE username=$1
		ORDER BY created_at DESC
		`,
      [username]
    );

    tempList = result2.rows.map((game) => ({
      room: game.room_name,
      flags: game.flags,
      timer: game.game_time,
      created: game.created_at,
    }));

    return {
      game: tempList,
      player: mainData,
    };
  } catch (error) {
    console.error("❌ Getting player data error:", error);
  } finally {
    client.release();
  }
};

const getLeaderboards = async () => {
  const result = await pool.query(`SELECT * FROM players ORDER BY total_flags DESC`);
  return result.rows;
};
