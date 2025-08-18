export class Flag {
    static flagImage = null;
    static imageLoaded = false;

    static {
        Flag.flagImage = new Image();
        Flag.flagImage.src = '/assets/images/flag123.png';
        Flag.flagImage.onload = () => (Flag.imageLoaded = true);
    }

    constructor(maze) {
        this.maze = maze;
        this.currentFlags = [];
    }

    loadData(flags) {
        this.currentFlags = flags.currentFlags;
    }

    draw(ctx) {
        if (!Flag.imageLoaded) return;
        const cellSize = this.maze.cellsMatrix[0][0].size;
        this.currentFlags.forEach((flag) => {
            ctx.drawImage(Flag.flagImage, flag.x * cellSize, flag.y * cellSize, cellSize, cellSize);
        });
    }
}
