import * as ModelManager from '../modelManager.js';

export function handleRoomOnClickEvents(socket, io) {
    // Check if a room name is available
    socket.on('room:check-availability', (roomName) => {
        const available = ModelManager.isRoomAvailable(roomName);
        console.log(`(B) Checking room name availibity: ${available}`);
        socket.emit(available ? 'room:available' : 'room:taken');
    });

    // Create a new room
    socket.on('room:create', (username, roomName) => {
        console.log(`(B) Creating new room: ${roomName}`);
        socket.data.room = roomName;
        ModelManager.createRoomWithMaze(socket.data.username, socket.data.room);
        ModelManager.placePlayerInMaze(socket.data.username, socket.data.room);
        socket.broadcast.emit('room:set-list', ModelManager.model.rooms);
    });

    // Join an existing room
    socket.on('room:join', (username, roomName) => {
        socket.data.room = roomName;
        console.log(`(B) Joining room: ${socket.data.room}`);
        ModelManager.placePlayerInMaze(socket.data.username, socket.data.room);
        io.emit('room:set-list', ModelManager.model.rooms);
    });
}
