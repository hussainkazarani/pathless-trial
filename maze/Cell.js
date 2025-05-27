import { ctx } from '../core/canvas.js';
import { currentCell } from './maze.js';
export class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 35;

        //top,right,bottom,left
        this.walls = [true, true, true, true];
        this.visited = false;
        this.color = '#FFFCF2';
    }

    draw() {
        this.#changeCellColor();
        this.#drawCell();
        this.#drawCellWalls();
    }

    #drawCell() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    }

    #drawCellWalls() {
        const walls = this.walls;
        const size = this.size;
        const x = this.x * size;
        const y = this.y * size;
        // draws the strokes of a cell with helper function
        // order is top,right,bottom,left
        if (walls[0]) Cell.#drawCellWallHelper(x, y, x + size, y);
        if (walls[1]) Cell.#drawCellWallHelper(x + size, y, x + size, y + size);
        if (walls[2]) Cell.#drawCellWallHelper(x + size, y + size, x, y + size);
        if (walls[3]) Cell.#drawCellWallHelper(x, y + size, x, y);
    }

    static #drawCellWallHelper(moveX, moveY, lineX, lineY) {
        ctx.beginPath();
        ctx.moveTo(moveX + 0.5, moveY + 0.5);
        ctx.lineTo(lineX + 0.5, lineY + 0.5);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    #changeCellColor() {
        if (this == currentCell) {
            this.color = '#403D39';
        } else if (this.visited) this.color = '#CCC5B9';
        else this.color = '#FFFCF2'; //not really needed since it has default color in class
    }
}
