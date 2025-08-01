export class Flag {
  static flagImage = null;
  static imageLoaded = false;

  static {
    Flag.flagImage = new Image();
    Flag.flagImage.src = "/assets/images/flag123.png";
    Flag.flagImage.onload = () => (Flag.imageLoaded = true);
  }

  constructor(maze) {
    this.maze = maze;
    this.currentFlags = [];
  }

  loadData(flags) {
    this.currentFlags = flags.currentFlags;
  }

  draw(ctx) {
    if (!Flag.imageLoaded) return;
    const cellSize = this.maze.cellsMatrix[0][0].size;
    this.currentFlags.forEach((flag) => {
      ctx.drawImage(Flag.flagImage, flag.x * cellSize, flag.y * cellSize, cellSize, cellSize);
    });
  }
}

// export class Flag {
//   constructor(maze) {
//     this.amount = 10;
//     this.maze = maze;
//     this.location = undefined;
//     this.color = "#ffafcc";
//     this.isFlagCollected = true;
//     this.flagImage = new Image();
//     this.imageLoaded = false;
//     // this.flagImage.src = "../../../assets/images/flag123.png";
//     this.flagImage.onload = () => {
//       console.log("image loaded");
//       this.imageLoaded = true;
//     };
//     this.flagImage.src = "/assets/images/flag123.png";
//     // this.player = player;
//   }

//   spawnFlag() {
//     if (this.amount <= 0) {
//       return;
//     }
//     this.isFlagCollected = false;
//     const row = Math.floor(Math.random() * this.maze.cellsMatrix.length);
//     const col = Math.floor(Math.random() * this.maze.cellsMatrix[0].length);
//     this.location = this.maze.cellsMatrix[row][col];
//     this.amount--;
//   }

//   checkFlag(ctx) {
//     if (this.isFlagCollected) {
//       //10th -> true
//       this.spawnFlag();
//     }
//     if (this.amount <= 0 && this.isFlagCollected) return;
//     this.draw(ctx); //check condition
//   }

//   draw(ctx) {
//     // let flagImage = new Image();
//     // flagImage.src = "../../../assets/images/flag123.png";

//     if (this.imageLoaded) {
//       ctx.drawImage(
//         this.flagImage,
//         this.location.x * this.location.size,
//         this.location.y * this.location.size,
//         this.location.size,
//         this.location.size
//       );
//     } else {
//       console.log("Image not yet loaded of flag");
//     }
//   }
// }
