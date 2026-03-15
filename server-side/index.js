import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import routes from "./router/router.js";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();
export const app = express();

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

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

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

  socket.on("negotiate", (data) => {
    console.log("prise", data);
    io.to(data.roomId).emit("negotiate", data);
  });

  socket.on("confirmbooking", (data) => {
    console.log("confirm", data);
    io.to(data.roomId).emit("confirmbooking", data);
  });

  socket.on("disconnect", () => {
    io.emit("Booking cancelled", "A user has disconnected");
    console.log("A user disconnected");
  });
});