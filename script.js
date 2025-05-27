import { ctx } from './core/canvas.js';
import { player } from './entities/Player.js';
import { createCellMatrix, createMaze } from './maze/maze.js';
import './core/keybindings.js';

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createCellMatrix();
    createMaze();
    player.draw();
    player.update();
    requestAnimationFrame(animate);
}
animate();
