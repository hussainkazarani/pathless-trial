import { keys } from "../ui/input/keybindings.js";
export class Player {
  constructor(maze, collisionManager) {
    const row = Math.floor(Math.random() * maze.cellsMatrix.length);
    const col = Math.floor(Math.random() * maze.cellsMatrix[0].length);
    this.color = "#EB5E28";
    this.speed = 5;
    this.playerSize = 25;
    this.cellSize = maze.cellsMatrix[0][0].size;
    this.collisionManager = collisionManager;
    this.playerCurrentCell = maze.cellsMatrix[row][col];
    this.x = this.playerCurrentCell.x * this.cellSize;
    this.y = this.playerCurrentCell.y * this.cellSize;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
  }

  updateCurrentCell() {
    const col = Math.floor(this.x / this.cellSize);
    const row = Math.floor(this.y / this.cellSize);
    this.playerCurrentCell = this.collisionManager.maze.cellsMatrix[row][col];
  }

  update() {
    // first
    if (keys.up) {
      let potentialSpeedUp = this.y - this.speed;
      if (this.playerCurrentCell && this.playerCurrentCell.walls[0]) {
        let cellWithSize = this.playerCurrentCell.y * this.cellSize;
        this.y = Math.max(potentialSpeedUp, cellWithSize);
      } else {
        this.y = potentialSpeedUp;
      }
    }

    // second
    if (keys.right) {
      let potentialSpeedRight = this.x + this.speed;
      if (this.playerCurrentCell && this.playerCurrentCell.walls[1]) {
        let rightBoundary = (this.playerCurrentCell.x + 1) * this.cellSize;
        let rightBoundarywithPlayer = rightBoundary - this.playerSize;
        this.x = Math.min(potentialSpeedRight, rightBoundarywithPlayer);
      } else {
        this.x = potentialSpeedRight;
      }
    }

    // third
    if (keys.down) {
      let potentialSpeedDown = this.y + this.speed;
      if (this.playerCurrentCell && this.playerCurrentCell.walls[2]) {
        let leftBoundary = (this.playerCurrentCell.y + 1) * this.cellSize;
        let leftBoundarywithPlayer = leftBoundary - this.playerSize;
        this.y = Math.min(potentialSpeedDown, leftBoundarywithPlayer);
      } else {
        this.y = potentialSpeedDown;
      }
    }
    if (keys.left) {
      let potentialSpeedLeft = this.x - this.speed;
      if (this.playerCurrentCell && this.playerCurrentCell.walls[3]) {
        let cellWithSize = this.playerCurrentCell.x * this.cellSize;
        this.x = Math.max(potentialSpeedLeft, cellWithSize);
      } else {
        this.x = potentialSpeedLeft;
      }
    }
  }
}

// console.log("this is the cellsize * player ", this.x, this.y);
// console.log("this is without cellsize * player ", this.x / this.cellSize, this.y / this.cellSize);
// console.log("this is cells ", this.playerCurrentCell.x, this.playerCurrentCell.y);
// console.log("IM INSIDE TOP WALL CELL", this.playerCurrentCell);
// //as long as the top pixel is less the the edge of the pixel with wall
// //  && !this.playerCurrentCell.walls[0]
// //   if (this.playerCurrentCell.x < this.playerCurrentCell.x && !this.playerCurrentCell.wall[0])
//       if (this.playerCurrentCell.walls[0] && this.y / this.cellSize < this.playerCurrentCell.y) {
//         this.y -= this.speed;
// //       }
//     if (keys.right && !this.playerCurrentCell.walls[1]) this.x += this.speed;
//     if (keys.down && !this.playerCurrentCell.walls[2]) this.y += this.speed;
//     if (keys.left && !this.playerCurrentCell.walls[3]) this.x -= this.speed;

//   update() {
//     if (keys.up && this.collisionManager.canMoveTo(this, "top")) this.y -= this.speed;
//     if (keys.right && this.collisionManager.canMoveTo(this, "right")) this.x += this.speed;
//     if (keys.down && this.collisionManager.canMoveTo(this, "down")) this.y += this.speed;
//     if (keys.left && this.collisionManager.canMoveTo(this, "left")) this.x -= this.speed;
//   }
//   let potentialSpeedDown = (this.y += this.speed);
//   this.y += this.speed;
//   if (this.playerCurrentCell.walls[2]) {
//     let cellWithSize = this.playerCurrentCell.y * this.cellSize;
//     let boundary = cellWithSize - this.playerSize;
//     console.log("cell with size", cellWithSize, "potential speed", potentialSpeedDown, "boundary", boundary);

//     this.y = Math.max(potentialSpeedDown, boundary);
//   } else {
//     this.y = potentialSpeedDown;
//   }
//  // let cellWithSize = this.playerCurrentCell.x * this.cellSize;
// let maxPlayer = this.x + this.playerSize;
// let maxAllowed = cellWithSize;
// let endpoint = cellWithSize + this.playerSize;
//
//
//
//

// console.log("IM INSIDE RIGHT WALL CELL");
// console.log(
//   "Current Cell",
//   this.playerCurrentCell,
//   "cellwithsize",
//   cellWithSize,
//   "endpoint",
//   endpoint,
//   "potential",
//   potentialSpeedRight
// );
