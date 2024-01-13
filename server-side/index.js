const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const routes = require("./router/router");
const cors = require("cors");
const socketIo = require("socket.io");
const { Server } = require("socket.io");
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MDB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

database.on("error", (err) => console.log(err));

database.on("connected", () => console.log("Database connected successfully"));

// Express server
const server = app.listen(8000, () => {
  console.log("Listening to 8000");
});




const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

// Socket.io setup
;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (data) => {
    const { roomId } = data;

    socket.join(roomId);
  });

  socket.on("message", (data) => {
    console.log("Received message:", data);

    io.to(data.roomId).emit("message", data);
  });

  socket.on("disconnect", () => {
    io.emit('Booking cancelled', 'A user has disconnected');
    console.log("A user disconnected");
  });
});

app.use("/api", routes);
