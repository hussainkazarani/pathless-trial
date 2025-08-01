import { keys } from "../ui/input/keybindings.js";

export class Player {
  constructor(maze, collisionManager) {
    this.cellSize = maze.cellsMatrix[0][0].size;
    this.collisionManager = collisionManager;

    // default values
    this.x = 0;
    this.y = 0;
    this.color = "#EB5E28";
    this.speed = 7;
    this.playerSize = 35;
    this.flags = 0;
    this.playerCurrentCell = null;
  }

  loadData(playerData) {
    this.x = playerData.x;
    this.y = playerData.y;
    this.playerSize = playerData.size;
    this.flags = playerData.flags;
    this.color = playerData.color;
    this.speed = playerData.speed;
    this.playerCurrentCell = playerData.currentCell;
  }

  updateFlagsInPlayer(newFlags) {
    this.flags = newFlags;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
  }

  updateCurrentCell() {
    const col = Math.floor(this.x / this.cellSize);
    const row = Math.floor(this.y / this.cellSize);
    this.playerCurrentCell = this.collisionManager.maze.cellsMatrix[row][col];
    // console.log(this.playerCurrentCell);
  }

  getCell(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    if (
      row < 0 ||
      row >= this.collisionManager.maze.cellsMatrix.length ||
      col < 0 ||
      col >= this.collisionManager.maze.cellsMatrix[0].length
    ) {
      //   console.log("Out of bounds, returning null");
      return null;
    }
    return this.collisionManager.maze.cellsMatrix[row][col];
  }

  update() {
    let playerSize = this.playerSize;
    let cellSize = this.cellSize;
    let corners = {
      topLeft: { x: this.x, y: this.y },
      topRight: { x: this.x + playerSize, y: this.y },
      bottomLeft: { x: this.x, y: this.y + playerSize },
      bottomRight: { x: this.x + playerSize, y: this.y + playerSize },
    };

    // constraints on maze
    const maxX = this.collisionManager.maze.cellsMatrix[0].length * this.cellSize - this.playerSize;
    const maxY = this.collisionManager.maze.cellsMatrix.length * this.cellSize - this.playerSize;
    // this.x = Math.max(0, Math.min(this.x, maxX - playerSize));
    // this.y = Math.max(0, Math.min(this.y, maxY - playerSize));

    if (keys.up) {
      const next = Math.max(0, this.y - this.speed);
      let wall = null;
      const cell1 = this.getCell(corners.topLeft.x, corners.topLeft.y);
      const cell2 = this.getCell(corners.topRight.x - 1, corners.topRight.y);

      if (cell1?.walls[0]) wall = cell1.y * cellSize + 1; //+1 for not cramping into wall
      if (cell2?.walls[0]) {
        const boundary = cell2.y * cellSize;
        wall = wall === null ? boundary : Math.max(wall, boundary);
      }

      // vertical case
      const cellAboveLeft = this.getCell(corners.topLeft.x, next);
      const cellAboveRight = this.getCell(corners.topRight.x - 1, next);
      if (cellAboveLeft && cellAboveRight && cellAboveLeft !== cellAboveRight) {
        if (cellAboveLeft.walls[1] || cellAboveRight.walls[3]) {
          //   console.log("vertical case");
          const blockingCellY = Math.max(cellAboveLeft.y, cellAboveRight.y);
          wall = (blockingCellY + 1) * cellSize;
        }
      }

      if (wall !== null) this.y = Math.max(next, wall);
      else this.y = next;
    }

    if (keys.right) {
      const next = Math.min(maxX, this.x + this.speed);
      let wall = null;
      const cell1 = this.getCell(corners.topRight.x - 1, corners.topRight.y);
      const cell2 = this.getCell(corners.bottomRight.x - 1, corners.bottomRight.y - 1);

      if (cell1?.walls[1]) wall = (cell1.x + 1) * cellSize - playerSize;
      if (cell2?.walls[1]) {
        const boundary = (cell2.x + 1) * cellSize - playerSize;
        wall = wall === null ? boundary : Math.min(wall, boundary);
      }

      // horizontal case
      const cellRightTop = this.getCell(next + playerSize, corners.topRight.y);
      const cellRightBottom = this.getCell(next + playerSize, corners.bottomRight.y - 1);
      if (cellRightTop && cellRightBottom && cellRightTop !== cellRightBottom) {
        if (cellRightTop.walls[2] || cellRightBottom.walls[0]) {
          //   console.log("horizontal case");
          const blockingCellX = Math.min(cellRightTop.x, cellRightBottom.x);
          wall = blockingCellX * cellSize - playerSize;
        }
      }

      if (wall !== null) this.x = Math.min(next, wall);
      else this.x = next;
    }

    if (keys.down) {
      const next = Math.min(maxY, this.y + this.speed);
      let wall = null;
      const cell1 = this.getCell(corners.bottomLeft.x, corners.bottomLeft.y - 1);
      const cell2 = this.getCell(corners.bottomRight.x - 1, corners.bottomRight.y - 1);

      if (cell1?.walls[2]) wall = (cell1.y + 1) * cellSize - playerSize;
      if (cell2?.walls[2]) {
        const boundary = (cell2.y + 1) * cellSize - playerSize;
        wall = wall === null ? boundary : Math.min(wall, boundary);
      }

      // vertical case
      const cellBelowLeft = this.getCell(corners.bottomLeft.x, next + playerSize);
      const cellBelowRight = this.getCell(corners.bottomRight.x - 1, next + playerSize);
      if (cellBelowLeft && cellBelowRight && cellBelowLeft !== cellBelowRight) {
        if (cellBelowLeft.walls[1] || cellBelowRight.walls[3]) {
          //   console.log("vertical case");
          const blockingCellY = Math.min(cellBelowLeft.y, cellBelowRight.y);
          wall = blockingCellY * cellSize - playerSize;
        }
      }

      if (wall !== null) {
        this.y = Math.min(next, wall);
      } else this.y = next;
    }

    if (keys.left) {
      const next = Math.max(0, this.x - this.speed);
      let wall = null;
      const cell1 = this.getCell(corners.topLeft.x, corners.topLeft.y);
      const cell2 = this.getCell(corners.bottomLeft.x, corners.bottomLeft.y - 1);
      if (cell1?.walls[3]) wall = cell1.x * cellSize + 1; //+1 for not cramping into wall
      if (cell2?.walls[3]) {
        const boundary = cell2.x * cellSize;
        wall = wall === null ? boundary : Math.max(wall, boundary);
      }

      // vertical case
      const cellLeftTop = this.getCell(next, corners.topLeft.y);
      const cellLeftBottom = this.getCell(next, corners.bottomLeft.y - 1);
      if (cellLeftTop && cellLeftBottom && cellLeftTop !== cellLeftBottom) {
        if (cellLeftTop.walls[2] || cellLeftBottom.walls[0]) {
          //   console.log("horizontal case");
          const blockingCellX = Math.max(cellLeftTop.x, cellLeftBottom.x);
          wall = (blockingCellX + 1) * cellSize;
        }
      }
      if (wall !== null) this.x = Math.max(next, wall);
      else this.x = next;
    }
  }

  //   checkFlagCollision() {
  //     if (this.flag.isFlagCollected) return;
  //     let playerSize = this.playerSize;
  //     let flagSize = this.flag.location.size;
  //     let flag = this.flag;
  //     let corners = {
  //       lowX: this.x,
  //       lowY: this.y,
  //       highX: this.x + playerSize,
  //       highY: this.y + playerSize,
  //     };
  //     let flagBounds = {
  //       lowX: flag.location.x * flagSize,
  //       lowY: flag.location.y * flagSize,
  //       //here the multiplication is to get the correct place in grid, then to get the right end of flag
  //       highX: flag.location.x * flagSize + flagSize,
  //       highY: flag.location.y * flagSize + flagSize,
  //     };

  //     if (
  //       corners.highX >= flagBounds.lowX &&
  //       corners.lowX <= flagBounds.highX &&
  //       corners.highY >= flagBounds.lowY &&
  //       corners.lowY <= flagBounds.highY
  //     ) {
  //       //   console.log("corners", corners.lowX, ", ", corners.lowY, ", ", corners.highX, ", ", corners.highY, "\n");
  //       //   console.log("flagBounds", flagBounds.lowX, ", ", flagBounds.lowY, ", ", flagBounds.highX, ", ", flagBounds.highY);
  //       this.flagsCollected++;
  //       //   console.log(this.flagsCollected);
  //       flag.isFlagCollected = true;
  //     }
  //   }
}
