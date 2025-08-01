// import { socket } from "../../socket.js";

import { sendFlagCollision } from "../main.js";

export class CollisionManager {
  constructor(maze) {
    this.maze = maze;
    this.cellSize = this.maze.cellsMatrix[0][0].size;
  }

  getCurrentCell(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    return this.maze.cellsMatrix[row][col];
  }

  canMoveTo(player, direction) {
    switch (direction) {
      case "top": {
        // const cell = this.getCurrentCell(player.x, player.y);
        // return !cell.walls[0];
        return !player.playerCurrentCell.walls[0];
      }
      case "right": {
        // const cell = this.getCurrentCell(player.x + player.playerSize - 1, player.y);
        // return !cell.walls[1];
        // return true;
        return !player.playerCurrentCell.walls[1];
      }
      case "down": {
        // const cell = this.getCurrentCell(player.x, player.y + player.playerSize - 1);
        // return !cell.walls[2];
        // return true;
        return !player.playerCurrentCell.walls[2];
      }
      case "left": {
        // const cell = this.getCurrentCell(player.x, player.y);
        // return !cell.walls[3];
        // return true;
        return !player.playerCurrentCell.walls[3];
      }
    }
  }

  checkFlagCollision(player, flags) {
    if (!flags.length) return;

    let playerSize = player.playerSize;
    let cellSize = this.maze.cellsMatrix[0][0].size;

    let playerBounds = {
      lowX: player.x,
      lowY: player.y,
      highX: player.x + playerSize,
      highY: player.y + playerSize,
    };

    for (let i = 0; i < flags.length; i++) {
      let flag = flags[i];
      let flagBounds = {
        lowX: flag.x * cellSize,
        lowY: flag.y * cellSize,
        //here the multiplication is to get the correct place in grid, then to get the right end of flag
        highX: flag.x * cellSize + cellSize,
        highY: flag.y * cellSize + cellSize,
      };

      if (
        playerBounds.highX >= flagBounds.lowX &&
        playerBounds.lowX <= flagBounds.highX &&
        playerBounds.highY >= flagBounds.lowY &&
        playerBounds.lowY <= flagBounds.highY
      ) {
        sendFlagCollision(i);
        // socket.emit("flag-collision-detected", flags[i], i);
      }
    }
  }
}

//     if (keys.up) this.y -= this.speed;
//     if (keys.right) this.x += this.speed;
//     if (keys.down) this.y += this.speed;
//     if (keys.left) this.x -= this.speed;
