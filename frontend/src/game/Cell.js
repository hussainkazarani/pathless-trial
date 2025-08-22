export class Cell {
    constructor(x, y) {
        this.x = x; //column
        this.y = y; //row
        this.size = 35;

        this.walkable = false; // default to non-walkable
        this.color = '#000000'; // default color (black for blocked)
    }

    draw(ctx) {
        // set color based on walkable
        this.color = this.walkable ? '#90ee90' : '#000000';
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    }
}
