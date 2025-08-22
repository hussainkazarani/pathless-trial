import { sendFlagCollision } from '../main.js';

export class CollisionManager {
    constructor(maze) {
        this.maze = maze;
        this.cellSize = this.maze.cellsMatrix[0][0].size;
    }

    getCell() {}

    checkCollision(x, y, playerSize, cellSize) {
        let corners = {
            topLeft: { x: x, y: y },
            topRight: { x: x + playerSize, y: y },
            bottomLeft: { x: x, y: y + playerSize },
            bottomRight: { x: x + playerSize, y: y + playerSize },
        };

        // if (keys.up) {
        //     return;
        // }
    }

    checkFlagCollision(player, flags) {
        if (!flags.length) return;

        let playerSize = player.playerSize;
        let cellSize = this.maze.cellsMatrix[0][0].size;

        let playerBounds = {
            lowX: player.x,
            lowY: player.y,
            highX: player.x + playerSize,
            highY: player.y + playerSize,
        };

        for (let i = 0; i < flags.length; i++) {
            let flag = flags[i];
            let flagBounds = {
                lowX: flag.x * cellSize,
                lowY: flag.y * cellSize,
                //here the multiplication is to get the correct place in grid, then to get the right end of flag
                highX: flag.x * cellSize + cellSize,
                highY: flag.y * cellSize + cellSize,
            };

            if (
                playerBounds.highX >= flagBounds.lowX &&
                playerBounds.lowX <= flagBounds.highX &&
                playerBounds.highY >= flagBounds.lowY &&
                playerBounds.lowY <= flagBounds.highY
            ) {
                sendFlagCollision(i);
            }
        }
    }
}
