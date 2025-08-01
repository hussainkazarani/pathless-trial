import { socket } from "../../socket.js";

// export const usernameFromBrowser = localStorage.getItem("username");
const createBtn = document.getElementById("create-game");
const inputRoom = document.getElementById("input-create-game");
const activity = document.querySelector(".online-players");
let localStorageUsername = localStorage.getItem("username");
let resetTimeout;

createBtn.addEventListener("click", () => {
  if (inputRoom.value.length > 0) {
    socket.emit("check-room-creation", inputRoom.value); //here
  }
});

window.addEventListener("load", () => {
  socket.emit("get-username", localStorageUsername);
  socket.emit("check-db", localStorageUsername); // DB checks and creates player
  socket.emit("get-rooms");
  socket.emit("send-online-activity");
});

socket.on("room-taken", () => {
  inputRoom.style.border = "2px solid red";
  inputRoom.style.backgroundColor = "#EF8683";
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    inputRoom.style.border = "";
    inputRoom.style.backgroundColor = "";
  }, 4000);
});

socket.on("room-available", () => {
  socket.emit("create-room", localStorageUsername, inputRoom.value);
  localStorage.setItem("room", inputRoom.value);
  console.log("about to join room as creator with roomid - " + inputRoom.value);
  window.location.href = "/frontend/index.html";
});

socket.on("online-players", (players) => {
  activity.innerHTML = "";
  const heading1 = document.createElement("h2");
  heading1.textContent = "Players Online";
  activity.appendChild(heading1);
  players.forEach((player) => {
    const p = document.createElement("p");
    p.textContent = player;
    activity.appendChild(p);
  });
});

socket.on("get-games", (rooms) => {
  const cardsDiv = document.querySelector(".cards");
  cardsDiv.innerHTML = "";

  Object.keys(rooms).forEach((room) => {
    const singleCard = document.createElement("div");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const p3 = document.createElement("p");
    const btn = document.createElement("button");
    p1.textContent = room;
    p2.textContent = `Started by : ${rooms[room].players[0]}`;
    p3.textContent = `${rooms[room].players.length}/${rooms[room].maxPlayers}`;
    btn.textContent = "Join";
    btn.addEventListener("click", () => {
      let localStorageUsernameInListener = localStorage.getItem("username");
      localStorage.setItem("room", room);
      socket.emit("join-room", localStorageUsernameInListener, room);
      window.location.href = "/frontend/index.html";
    });
    singleCard.className = "cardOfGame";
    p1.id = "game-number";
    p2.id = "game-creator";
    p3.id = "game-player";
    btn.id = "game-join-button";
    singleCard.appendChild(p1);
    singleCard.appendChild(p2);
    singleCard.appendChild(p3);
    singleCard.appendChild(btn);
    cardsDiv.appendChild(singleCard);
  });
});
//add room to map with creator. he has access to start game
//start game on clicking button
//must show up in join rooms

const leaderboardBtn = document.getElementById("leaderboardBtn");
leaderboardBtn.addEventListener("click", () => {
  window.location.href = "/frontend/src/pages/leaderboards.html";
});

const playerBtn = document.getElementById("playerBtn");
playerBtn.addEventListener("click", () => {
  window.location.href = "/frontend/src/pages/playerstats.html";
});
