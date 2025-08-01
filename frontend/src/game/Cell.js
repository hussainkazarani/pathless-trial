export class Cell {
  constructor(x, y) {
    this.x = x; //column
    this.y = y; //row
    this.size = 35;

    //top,right,bottom,left
    this.walls = [true, true, true, true];
    this.visited = false;
    this.color = "#FFFCF2";
  }
  // draw(ctx, currentCell) {
  draw(ctx) {
    this.#changeCellColor();
    this.#drawCell(ctx);
    this.#drawCellWalls(ctx);
  }

  //   #changeCellColor(currentCell) {
  // if (this == currentCell) {
  //   // this.color = '#403D39';
  //   this.color = "#CCC5B9";
  // } else
  #changeCellColor() {
    if (this.visited) this.color = "#CCC5B9";
    else this.color = "#FFFCF2"; //not really needed since it has default color in class
  }

  #drawCell(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
  }

  #drawCellWalls(ctx) {
    const walls = this.walls;
    const size = this.size;
    const x = this.x * size; //colums
    const y = this.y * size; //rows
    // draws the strokes of a cell with helper function
    // order is top,right,bottom,left
    if (walls[0]) Cell.#drawCellWallHelper(ctx, x, y, x + size, y);
    if (walls[1]) Cell.#drawCellWallHelper(ctx, x + size, y, x + size, y + size);
    if (walls[2]) Cell.#drawCellWallHelper(ctx, x + size, y + size, x, y + size);
    if (walls[3]) Cell.#drawCellWallHelper(ctx, x, y + size, x, y);
  }

  static #drawCellWallHelper(ctx, moveX, moveY, lineX, lineY) {
    ctx.beginPath();
    ctx.moveTo(moveX + 0.5, moveY + 0.5);
    ctx.lineTo(lineX + 0.5, lineY + 0.5);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}
