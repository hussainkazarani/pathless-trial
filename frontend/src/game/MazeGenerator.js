//DFS with Backtracking
//Step 1 - Mark initial cell as current and as visited
//Step 2 - if there are unvisited cells
// 			- choose unvisited neighbour randomly
// 			- push current into stack
// 			- remove wall bwn current and chosen neighbor
// 			- mark chosen neighbor as current and as visited
//Step 3 - else if stack is not empty
// 			- pop a cell from stack
// 			- make it current cell

export class MazeGenerator {
  constructor(maze) {
    this.maze = maze;
    this.stack = [];
    this.currentCell = maze.cellsMatrix[0][0];
    this.currentCell.visited = true;
  }

  generateDFS() {
    while (true) {
      const nextCell = this.selectUnvisitedNeighborCell(this.currentCell);
      if (nextCell) {
        this.removeWalls(this.currentCell, nextCell);
        this.stack.push(this.currentCell);
        this.currentCell = nextCell;
        this.currentCell.visited = true;
      } else if (this.stack.length > 0) {
        const previousCell = this.stack.pop();
        this.currentCell = previousCell;
      } else break;
    }
    this.removeCandidateWalls();
  }

  selectUnvisitedNeighborCell(cell) {
    // const { x, y } = cell;
    const row = cell.y;
    const col = cell.x;
    var neighbours = [];

    // helper function checks whether the cell is defined and not visited. helps keep code clean
    // order is top,right,bottom,left
    this.addUnvistedNeighbour(this.maze.cellsMatrix[row - 1]?.[col], neighbours);
    this.addUnvistedNeighbour(this.maze.cellsMatrix[row]?.[col + 1], neighbours);
    this.addUnvistedNeighbour(this.maze.cellsMatrix[row + 1]?.[col], neighbours);
    this.addUnvistedNeighbour(this.maze.cellsMatrix[row]?.[col - 1], neighbours);

    var selectedNeighbourCell = neighbours[Math.floor(Math.random() * neighbours.length)];
    return selectedNeighbourCell ?? undefined;
  }

  addUnvistedNeighbour(neighbourCell, givenArray) {
    if (neighbourCell && !neighbourCell.visited) {
      givenArray.push(neighbourCell);
    }
  }

  removeWalls(currentCell, nextCell) {
    var colDiff = currentCell.x - nextCell.x;
    var rowDiff = currentCell.y - nextCell.y;
    //removes the adjacent wall by checking whose difference has a 1
    //order is (right,left) and (top,bottom)
    if (colDiff == 1) {
      currentCell.walls[3] = false;
      nextCell.walls[1] = false;
    } else if (colDiff == -1) {
      currentCell.walls[1] = false;
      nextCell.walls[3] = false;
    }
    if (rowDiff == 1) {
      currentCell.walls[0] = false;
      nextCell.walls[2] = false;
    } else if (rowDiff == -1) {
      currentCell.walls[2] = false;
      nextCell.walls[0] = false;
    }
  }

  removeCandidateWalls() {
    const candidates = [];
    for (let row = 0; row < this.maze.rows; row++) {
      for (let col = 0; col < this.maze.columns; col++) {
        // order is top,right,bottom,left
        this.addCandidatePair(this.maze.cellsMatrix[row][col], this.maze.cellsMatrix[row]?.[col - 1], candidates);
        this.addCandidatePair(this.maze.cellsMatrix[row][col], this.maze.cellsMatrix[row + 1]?.[col], candidates);
        this.addCandidatePair(this.maze.cellsMatrix[row][col], this.maze.cellsMatrix[row]?.[col + 1], candidates);
        this.addCandidatePair(this.maze.cellsMatrix[row][col], this.maze.cellsMatrix[row - 1]?.[col], candidates);
      }
    }

    const percentage = 0.2; //20%
    const removals = Math.floor(Math.random() * (candidates.length * percentage));
    // const removals = Math.floor(candidates.length * percentage);

    //each index has a pair {currentCell,neighbourCell}
    for (let i = 0; i < removals; i++) {
      var index = Math.floor(Math.random() * candidates.length);
      const [currentCell, candidateCell] = candidates[index];
      this.removeWalls(currentCell, candidateCell);
      candidates.splice(index, 1);
    }
  }

  addCandidatePair(currentCell, neighbourCell, givenArray) {
    if (!neighbourCell) return;
    var colDiff = currentCell.x - neighbourCell.x;
    var rowDiff = currentCell.y - neighbourCell.y;
    //order is (right,left) and (top,bottom)
    if (colDiff == 1 && currentCell.walls[3] && neighbourCell.walls[1]) givenArray.push([currentCell, neighbourCell]);
    if (colDiff == -1 && currentCell.walls[1] && neighbourCell.walls[3]) givenArray.push([currentCell, neighbourCell]);
    if (rowDiff == 1 && currentCell.walls[0] && neighbourCell.walls[2]) givenArray.push([currentCell, neighbourCell]);
    if (rowDiff == -1 && currentCell.walls[2] && neighbourCell.walls[0]) givenArray.push([currentCell, neighbourCell]);
  }
}
