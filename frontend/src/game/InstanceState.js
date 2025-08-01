import { addGameToDB, animationID, removeGame } from "../main.js";

export class InstanceState {
  constructor(player, username, timer) {
    this.username = username;
    this.player = player;
    this.timer = timer;
  }

  loadTimer(newTimer) {
    this.timer = newTimer;
  }

  endGame(allPlayers) {
    let tempList = [];
    Object.keys(allPlayers).forEach((player) => {
      tempList.push({
        username: player,
        flags: allPlayers[player].flags,
      });
    });
    tempList.sort((a, b) => b.flags - a.flags);

    //shifted db to before this function call

    let playerScores = "";
    let heading = "<h2>LEADERBOARDS</h2>";
    let button = '<button id="button1">Leave</button>';
    tempList.forEach((player, index) => {
      const isCurrentUser = player.username === this.username;
      const style = isCurrentUser ? 'style="color: green; font-weight: bold;"' : "";
      playerScores += ` <p ${style}>${index + 1}. ${player.username} - ${player.flags} flags </p>`;
    });

    let template = heading + playerScores + button;

    document.querySelector(".popup-menu").innerHTML = template;
    document.getElementById("popup").classList.remove("hidden");
    cancelAnimationFrame(animationID);

    document.getElementById("button1").addEventListener("click", () => {
      // DELETE ALL INSTANCE OF GAME BEFORE LEAVING
      removeGame();
      window.location.replace("/frontend/src/pages/rooms.html");
    });
  }
}
