export class CameraManager {
    constructor(canvas, maze, zoomLevel = 2) {
        this.zoom = zoomLevel;
        this.canvas = canvas;
        this.maze = maze;
    }

    applyTransform(ctx) {
        ctx.save();
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.offsetX, -this.offsetY); // makes the center point be in top left
    }

    resetTransform(ctx) {
        ctx.restore();
    }

    followPlayer(player) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const mazeWidth = this.maze.columns * this.maze.cellsMatrix[0][0].size;
        const mazeHeight = this.maze.rows * this.maze.cellsMatrix[0][0].size;
        // console.log("screen - ", screenWidth, " , ", screenHeight, "\nmaze - ", mazeWidth, " , ", mazeHeight);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.offsetX = player.x - centerX / this.zoom;
        this.offsetY = player.y - centerY / this.zoom;
        this.offsetX = Math.max(0, this.offsetX);
        this.offsetY = Math.max(0, this.offsetY);

        this.offsetX = Math.min(this.offsetX, mazeWidth - screenWidth / this.zoom + 1);
        this.offsetY = Math.min(this.offsetY, mazeHeight - screenHeight / this.zoom + 1);
    }
}
