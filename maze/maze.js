import { Cell } from './Cell.js';
export const COLUMNS = 20;
export const ROWS = 20;
var cellsMatrix = [];
var cellsStack = [];
var hasRemovedCandidates = false;

for (let i = 0; i < COLUMNS; i++) {
    cellsMatrix[i] = [];
    for (let j = 0; j < ROWS; j++) {
        var singleCell = new Cell(i, j);
        cellsMatrix[i].push(singleCell);
    }
}

export function createCellMatrix() {
    for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < ROWS; j++) {
            cellsMatrix[i][j].draw();
        }
    }
}

//Step 1
export var currentCell = cellsMatrix[0][0];
currentCell.visited = true;
cellsStack.push(currentCell);
//Step 2
export function createMaze() {
    const nextCell = getUnvisitedNeighborCell(currentCell);
    if (nextCell) {
        cellsStack.push(currentCell);
        removeWalls(currentCell, nextCell);
        currentCell = nextCell;
        currentCell.visited = true;
    }
    // Step 3
    else if (cellsStack.length > 0) {
        var previousCell = cellsStack.pop();
        currentCell = previousCell;
    }
    if (!hasRemovedCandidates && cellsStack.length == 0) {
        removeCandidateWalls();
        hasRemovedCandidates = true;
    }
    // else break;
}

function getUnvisitedNeighborCell(cell) {
    const { x, y } = cell;
    var neighbours = [];

    // helper function checks whether the cell is defined and not visited. helps keep code clean
    // order is top,right,bottom,left
    addUnvistedNeighbour(cellsMatrix[x]?.[y - 1], neighbours);
    addUnvistedNeighbour(cellsMatrix[x + 1]?.[y], neighbours);
    addUnvistedNeighbour(cellsMatrix[x]?.[y + 1], neighbours);
    addUnvistedNeighbour(cellsMatrix[x - 1]?.[y], neighbours);

    var selectedNeighbourCell = neighbours[Math.floor(Math.random() * neighbours.length)];
    return selectedNeighbourCell ?? undefined;
}

function addUnvistedNeighbour(neighbourCell, givenArray) {
    if (neighbourCell && !neighbourCell.visited) {
        givenArray.push(neighbourCell);
    }
}

function addCandidatePair(currentCell, neighbourCell, givenArray) {
    if (neighbourCell) {
        givenArray.push([currentCell, neighbourCell]);
    }
}

function removeWalls(currentCell, nextCell) {
    var x = currentCell.x - nextCell.x;
    var y = currentCell.y - nextCell.y;
    //removes the adjacent wall by checking whose difference has a 1
    //order is (right,left) and (top,bottom)
    if (x == 1) {
        currentCell.walls[3] = false;
        nextCell.walls[1] = false;
    } else if (x == -1) {
        currentCell.walls[1] = false;
        nextCell.walls[3] = false;
    }
    if (y == 1) {
        currentCell.walls[0] = false;
        nextCell.walls[2] = false;
    } else if (y == -1) {
        currentCell.walls[2] = false;
        nextCell.walls[0] = false;
    }
}

function removeCandidateWalls() {
    const candidates = [];
    for (let x = 0; x < COLUMNS; x++) {
        for (let y = 0; y < ROWS; y++) {
            // order is top,right,bottom,left
            addCandidatePair(cellsMatrix[x][y], cellsMatrix[x]?.[y - 1], candidates);
            addCandidatePair(cellsMatrix[x][y], cellsMatrix[x + 1]?.[y], candidates);
            addCandidatePair(cellsMatrix[x][y], cellsMatrix[x]?.[y + 1], candidates);
            addCandidatePair(cellsMatrix[x][y], cellsMatrix[x - 1]?.[y], candidates);
        }
    }

    const percentage = 0.2; //20%
    const removals = Math.floor(Math.random() * (candidates.length * percentage));

    //each index has a pair {currentCell,neighbourCell}
    for (let i = 0; i < removals; i++) {
        var index = Math.floor(Math.random() * candidates.length);
        const [currentCell, candidateCell] = candidates[index];
        removeWalls(currentCell, candidateCell);
        candidates.splice(index, 1);
    }
}

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
