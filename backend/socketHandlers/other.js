import * as DB from '../db.js';
import * as ModelManager from '../modelManager.js';
import { parseRequestBody } from '../utils.js';

export function handleOtherEvents(socket) {
    // Leaderboards
    socket.on('leaderboard:get', async () => {
        console.log(`(B) Sending leaderboards`);
        const leaderboards = await DB.fetchLeaderboards();
        socket.emit('leaderboard:data', leaderboards);
    });

    // Player statistics / history
    socket.on('player-stats:get', async (username) => {
        console.log(`(B) Sending player statistics`);
        const history = await DB.fetchPlayerHistory(username);
        socket.emit('player-stats:data', history);
    });

    socket.on('other:set-backend-username', (username) => {
        console.log(`(B) Setting backend username`);
        socket.data.username = username;
    });

    // socket.on('player:verify-backend', (username) => {
    //     const exists = socket.data.username === username;
    //     socket.emit('player:verify-backend-response', socket.data.username, exists);
    // });
    socket.on('player:verify-backend', (username, callback) => {
        const exists = socket.data.username === username;
        callback(socket.data.username, exists);
    });
}

// Remove player and any rooms they created
export async function handlePlayerDisconnect(req, res, io) {
    try {
        const { username } = await parseRequestBody(req);

        if (username) {
            ModelManager.removePlayer(username, io);
            console.log('(B) Succesfully removed any player data');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '(B) Player removed successfully' }));
    } catch (err) {
        console.error('Failed to remove player:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '(E) Invalid request' }));
    }
}
