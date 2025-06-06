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
}

//     if (keys.up) this.y -= this.speed;
//     if (keys.right) this.x += this.speed;
//     if (keys.down) this.y += this.speed;
//     if (keys.left) this.x -= this.speed;
