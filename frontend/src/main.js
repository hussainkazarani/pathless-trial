import { ctx } from "./canvas/initCanvas.js";
import { CollisionManager } from "./game/CollisionManager.js";
import { Maze } from "./game/Maze.js";
import { MazeGenerator } from "./game/MazeGenerator.js";
import { Player } from "./game/Player.js";

function createBuffer(width, height) {
  const buf = document.createElement("canvas");
  buf.width = width;
  buf.height = height;
  return buf;
}

const buffer = createBuffer(canvas.width, canvas.height);
const bufferCtx = buffer.getContext("2d");

const maze = new Maze(20, 20);
maze.initializeCells();

const generator = new MazeGenerator(maze);
generator.generateDFS();

maze.drawCells(bufferCtx, generator.currentCell);

const collisionManager = new CollisionManager(maze);
const player = new Player(maze, collisionManager);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(buffer, 0, 0); //Blit
  //   const maze = new Maze(20, 20);
  //   maze.initializeCells();
  //   maze.drawCells(ctx, generator.currentCell);
  player.draw(ctx);
  player.updateCurrentCell();
  player.update();
  requestAnimationFrame(animate);
}
animate();
