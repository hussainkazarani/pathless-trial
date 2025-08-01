export class HUD {
  constructor(instance) {
    this.instance = instance;
    // this.timer = instance.timer;
  }

  drawTimerUI(ctx) {
    ctx.font = "24px VCR";
    ctx.fillStyle = "white";
    ctx.fillText(`⏱️Timer : ${this.instance.timer}`, 10, 30);
    // ctx.font = "24px 'Courier New'";
    // console.log(this.gameState.timer);
  }

  drawPlayerFlags(ctx) {
    ctx.font = "24px VCR";
    ctx.fillStyle = "white";
    ctx.fillText(`🚩 : ${this.instance.player.flags}`, 15, 60);
    //   // ctx.font = "24px 'Courier New'";
    //   // console.log(this.gameState.timer);
  }
}
