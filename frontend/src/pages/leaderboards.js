const socket = io();

const tempDiv = document.getElementById("tempdiv");

addEventListener("load", () => {
  socket.emit("get-leaderboards");
});

socket.on("send-leaderboards", (data) => {
  //   data.forEach((player) => {
  //     const li = document.createElement("li");
  //     li.textContent = `${player.username} - ${player.total_flags} flags 🚩`;
  //     tempDiv.appendChild(li);
  //   });
  tempDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
});
