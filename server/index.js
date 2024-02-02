// Import the 'http' module to create an HTTP server
const httpServer = require("http").createServer();

// Import the 'socket.io' library and initialize it with the HTTP server
const io = require("socket.io")(httpServer, {
  // Configure CORS settings
  cors: {
    origin: "http://127.0.0.1:5500", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});

// Keep track of connected users using their socket IDs and name
const users = {};

// Event handler for new socket connections
io.on("connection", (socket) => {
  // Event handler for when a new user joins
  socket.on("new-user-joined", (name) => {
    // Store the user's name with their socket ID
    users[socket.id] = name;
    // Broadcast to all other clients that a new user has joined
    socket.broadcast.emit("user-joined", name);
  });

  // Event handler for when a message is sent
  socket.on("send", (message) => {
    // Broadcast the received message to all other clients
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id], // Include the sender's name
    });
  });

  // Event handler for when a current user disconnects
  socket.on("disconnect", (message) => {
    // Broadcast the received message to all other clients
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

// Start the HTTP server and listen on port 8000
httpServer.listen(8000, () => {
  console.log("Socket.IO server listening on port 8000");
});
