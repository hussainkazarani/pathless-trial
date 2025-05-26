import { canvas, ctx } from '../core/canvas.js';
import { keys } from '../core/keybindings.js';
class Player {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 25;
        this.speed = 10;
    }
    update() {
        if (keys.up) this.y -= this.speed;
        if (keys.right) this.x += this.speed;
        if (keys.down) this.y += this.speed;
        if (keys.left) this.x -= this.speed;
        //to constraint the player inside the canvas for irregular co-ordinates
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.size));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.size));
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

export const player = new Player();
