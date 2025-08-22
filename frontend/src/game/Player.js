import { keys } from '../ui/input/keybindings.js';

export class Player {
    constructor(maze, collisionManager) {
        this.cellSize = maze.cellsMatrix[0][0].size;
        this.collisionManager = collisionManager;

        // default values
        this.x = 0;
        this.y = 0;
        this.color = '#EB5E28';
        this.speed = 10;
        this.playerSize = 35;
        this.flags = 0;
        this.playerCurrentCell = null;
    }

    loadData(playerData) {
        this.x = playerData.x;
        this.y = playerData.y;
        this.playerSize = playerData.size;
        this.flags = playerData.flags;
        this.color = playerData.color;
        this.speed = playerData.speed;
        this.playerCurrentCell = playerData.currentCell;
    }

    updateFlagsInPlayer(newFlags) {
        this.flags = newFlags;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
    }

    updateCurrentCell() {}

    update() {
        this.collisionManager.checkCollision(this.x, this.y, this.playerSize, this.cellSize);

        // boundaries
        const maxX = this.collisionManager.maze.columns * this.cellSize - this.playerSize;
        const maxY = this.collisionManager.maze.rows * this.cellSize - this.playerSize;
        this.x = Math.max(0, Math.min(this.x, maxX));
        this.y = Math.max(0, Math.min(this.y, maxY));
    }
}
