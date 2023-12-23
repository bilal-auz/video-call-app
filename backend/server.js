const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Server is running.");
});

const server = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.emit("me", socket.id);
});
