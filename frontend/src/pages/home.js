const socket = io();

const playBtn = document.getElementById("play-button");
// const nameBtn = document.getElementById("choose-name");
const input = document.getElementById("username");
const nameOfUser = localStorage.getItem("username");
const errorDiv = document.getElementById("error-message");
let username = "";
let isButtonClick = false;

errorDiv.style.display = "none";

window.addEventListener("load", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("room");
});

if (nameOfUser) {
  input.value = nameOfUser;
  username = nameOfUser;
}

input.addEventListener("input", () => {
  if (input.value.length > 0) {
    isButtonClick = false;
    socket.emit("check-username", input.value);
  }
});

playBtn.addEventListener("click", () => {
  if (input.value.length > 0) {
    isButtonClick = true;
    socket.emit("check-username", input.value);

    // username = input.value;
  }
});

socket.on("username-taken", () => {
  errorDiv.textContent = "Username is taken!";
  errorDiv.style.border = "2px solid red";
  errorDiv.style.backgroundColor = "#EF8683";
  errorDiv.style.display = "block";
});

socket.on("username-available", () => {
  errorDiv.textContent = "Username is Available!!";
  errorDiv.style.border = "2px solid green";
  errorDiv.style.backgroundColor = "#E1FAC2";
  errorDiv.style.display = "block";
  if (isButtonClick) {
    localStorage.setItem("username", input.value);
    window.location.href = "/frontend/src/pages/rooms.html";
  }
});

// nameBtn.addEventListener("click", () => {
//   if (input.value.length > 0) {
//     username = input.value;
//     localStorage.setItem("username", username);
//     console.log("Welcome! " + username);
//   }
// });
