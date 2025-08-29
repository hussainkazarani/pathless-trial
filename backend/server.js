import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import * as DB from './db.js';
import { Server } from 'socket.io';
import { serveStaticFile } from './utils.js';
import { handleHomeEvents } from './socketHandlers/home.js';
import { handleRoomOnLoadEvents } from './socketHandlers/roomLoad.js';
import { handleRoomOnClickEvents } from './socketHandlers/roomClick.js';
import { handleGameEvents } from './socketHandlers/game.js';
import { handleOtherEvents, handlePlayerDisconnect } from './socketHandlers/other.js';

dotenv.config({ path: '../.env' });
const PORT = process.env.PORT;
console.log(`Port for Node.js is: ${PORT}`);

const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const basePath = path.dirname(__dirname);

const server = http.createServer(async (req, res) => {
    // API routes
    if (req.method === 'POST' && req.url.startsWith('/api/remove-player')) {
        return handlePlayerDisconnect(req, res, io);
    }

    // Static files
    let filePath = '';
    if (req.url === '/' && req.method === 'GET') {
        filePath = path.join(basePath, 'frontend', 'src', 'pages', 'home.html');
    } else {
        filePath = path.join(basePath, req.url);
    }

    await serveStaticFile(res, filePath);
});

const io = new Server(server);
io.on('connection', (socket) => {
    handleHomeEvents(socket);
    handleRoomOnLoadEvents(socket, io);
    handleRoomOnClickEvents(socket, io);
    handleGameEvents(socket, io);
    handleOtherEvents(socket, io);
});

server.listen(PORT, '0.0.0.0', async () => {
    await DB.verifyDbConnection();
});
