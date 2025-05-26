import { ctx } from './core/canvas.js';
import { player } from './entities/Player.js';
import './core/keybindings.js';

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    player.update();
    requestAnimationFrame(animate);
}
animate();

// //MAZE
// matrix = [];
// mazeStack = [];
// grid = 80;
// w = 40; //not used
// // Cell Structure
// class Cell {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//         //top,right,bottom,left
//         this.walls = [true, true, true, true];
//         this.visited = false;
//     }

//     draw() {
//         if (this == current) {
//             ctx.fillStyle = 'yellow';
//         } else if (this.visited) {
//             ctx.fillStyle = 'white';
//         } else {
//             ctx.fillStyle = 'blue';
//         }
//         ctx.fillRect(this.x * grid, this.y * grid, grid, grid);

//         ctx.strokeStyle = 'red';
//         this.wallPaths();
//         this.checkNeighbor();
//         // ctx.strokeRect(this.x * grid, this.y * grid, grid, grid);
//     }

//     wallPaths() {
//         const x = this.x * grid;
//         const y = this.y * grid;

//         if (this.walls[0]) {
//             //top
//             ctx.beginPath();
//             ctx.moveTo(x, y);
//             ctx.lineTo(x + grid, y);
//             ctx.stroke();
//         }

//         if (this.walls[1]) {
//             //right
//             ctx.beginPath();
//             ctx.moveTo(x + grid, y);
//             ctx.lineTo(x + grid, y + grid);
//             ctx.stroke();
//         }

//         if (this.walls[2]) {
//             //bottom
//             ctx.beginPath();
//             ctx.moveTo(x + grid, y + grid);
//             ctx.lineTo(x, y + grid);
//             ctx.stroke();
//         }

//         if (this.walls[3]) {
//             //left
//             ctx.beginPath();
//             ctx.moveTo(x, y + grid);
//             ctx.lineTo(x, y);
//             ctx.stroke();
//         }
//     }
//     checkNeighbor() {
//         const i = this.x;
//         const j = this.y;
//         var neighboursToVisit = [];
//         var top = matrix[i] && matrix[i][j - 1];
//         var right = matrix[i + 1] && matrix[i + 1][j];
//         var bottom = matrix[i] && matrix[i][j + 1];
//         var left = matrix[i - 1] && matrix[i - 1][j];
//         //top
//         if (top && !top.visited) neighboursToVisit.push(top);
//         if (right && !right.visited) neighboursToVisit.push(right);
//         if (bottom && !bottom.visited) neighboursToVisit.push(bottom);
//         if (left && !left.visited) neighboursToVisit.push(left);
//         var nextCell = neighboursToVisit[Math.floor(Math.random() * neighboursToVisit.length)];
//         if (nextCell) return nextCell;
//         return undefined;
//     }
//     removeWalls(a, b) {
//         var x = a.x - b.x;
//         var y = a.y - b.y;

//         //right
//         if (x == 1) {
//             a.walls[3] = false;
//             b.walls[1] = false;
//         }
//         //left
//         else if (x == -1) {
//             a.walls[1] = false;
//             b.walls[3] = false;
//         }

//         //top
//         if (y == 1) {
//             a.walls[0] = false;
//             b.walls[2] = false;
//         }
//         //bottom
//         else if (y == -1) {
//             a.walls[2] = false;
//             b.walls[0] = false;
//         }
//     }
// }

// for (let i = 0; i < 10; i++) {
//     matrix[i] = [];
//     for (let j = 0; j < 10; j++) {
//         var singleCell = new Cell(i, j);
//         matrix[i].push(singleCell);
//     }
// }
// current = matrix[0][0];
// current.visited = true;
// mazeStack.push(current);
// console.log(matrix);
// // function colorCurrent() {
// //     ctx.fillStyle = 'white';
// //     ctx.strokeStyle = 'red';
// //     ctx.fillRect(current.x * grid, current.y * grid, grid, grid);
// //     // ctx.strokeRect(current.x * grid, current.y * grid, grid, grid);
// // }
// //

// // ACTUAL GAME

// // Animation
// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     player.draw();
//     player.update();
//     for (let i = 0; i < 10; i++) {
//         for (let j = 0; j < 10; j++) {
//             matrix[i][j].draw();
//         }
//     }

//     nextCell = current.checkNeighbor();
//     if (nextCell) {
//         mazeStack.push(nextCell);
//         nextCell.visited = true;
//         current.removeWalls(current, nextCell);
//         current = nextCell;
//     } else if (mazeStack.length > 0) {
//         var backCell = mazeStack.pop();
//         current = backCell;
//     }

//     requestAnimationFrame(animate);
// }
