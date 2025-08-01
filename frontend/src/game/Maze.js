import { Cell } from "./Cell.js";
export class Maze {
  constructor(columns = 20, rows = 20) {
    this.columns = columns;
    this.rows = rows;
    this.cellsMatrix = [];
  }

  loadData(mazeData) {
    this.cellsMatrix = [];
    //cellsMatrix[y][x] = cellsMatrix[i][j]
    for (let row = 0; row < this.rows; row++) {
      this.cellsMatrix[row] = [];
      for (let col = 0; col < this.columns; col++) {
        const cellData = mazeData[row][col];
        //   cell.size = cellData.size;
        //GIVE OBJECT PARAMETERs
        const cell = new Cell(cellData.x, cellData.y); //Cell(x,y)
        cell.walls = cellData.walls;
        cell.visited = cellData.visited;

        this.cellsMatrix[row][col] = cell;
      }
    }
  }

  drawCells(ctx) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        this.cellsMatrix[row][col].draw(ctx);
      }
    }
  }
}
