// BACKEND
export class Cell {
    constructor(x, y) {
        this.x = x; //column
        this.y = y; //row
        this.size = 35;

        this.walkable = false;
        this.visited = false;
        this.color = '#FFFCF2';
    }
}

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
}

export class Flag {
    constructor(maze, amount) {
        this.amount = amount;
        this.maze = maze;
        this.positions = [];
    }

    createPositions() {
        for (let i = 0; i < this.amount; i++) {
            const row = Math.floor(Math.random() * this.maze.rows);
            const col = Math.floor(Math.random() * this.maze.columns);
            this.positions.push({ x: col, y: row });
        }
        return this.positions;
    }
}
