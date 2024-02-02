const socket = io("http://localhost:8000/");

const form = document.getElementById("send-container");
const messgaeInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
let audio = new Audio("ting.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message"); // message class
  messageElement.classList.add(position); // position : left OR right class
  messageContainer.append(messageElement);
  if (position === "left") {
    audio.play();
  }
};

// notify others of your joining
const names = prompt("Enter your name to join");
socket.emit("new-user-joined", names);

// get informed of users joined
socket.on("user-joined", (names) => {
  append(`${names} joined the chat`, "right");
});

// send message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messgaeInput.value;
  append(`You : ${message}`, "right");
  socket.emit("send", message);
  messgaeInput.value = "";
});

// recieve message
socket.on("recieve", (data) => {
  append(`${data.name} : ${data.message}`, "left");
});

// some user left (get informed)
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});
