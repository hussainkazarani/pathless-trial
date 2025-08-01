const socket = io();

const tempDiv = document.getElementById("tempdiv");
const username = localStorage.getItem("username");

addEventListener("load", () => {
  socket.emit("get-stats", username);
});

socket.on("send-stats", (data) => {
  //   data.forEach((player) => {
  //     const li = document.createElement("li");
  //     li.textContent = `${player.username} - ${player.total_flags} flags 🚩`;
  //     tempDiv.appendChild(li);
  //   });
  tempDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
});
