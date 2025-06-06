import { Cell } from "./Cell.js";
export class Maze {
  constructor(columns = 20, rows = 20) {
    this.columns = columns;
    this.rows = rows;
    this.cellsMatrix = [];
  }

  initializeCells() {
    this.cellsMatrix = [];
    //cellsMatrix[y][x] = cellsMatrix[i][j]
    for (let row = 0; row < this.rows; row++) {
      this.cellsMatrix[row] = [];
      for (let col = 0; col < this.columns; col++) {
        this.cellsMatrix[row][col] = new Cell(col, row); //Cell(x,y)
      }
    }
  }

  drawCells(ctx, currentCell) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        this.cellsMatrix[row][col].draw(ctx, currentCell);
      }
    }
  }
}
