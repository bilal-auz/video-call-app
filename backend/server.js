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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.emit("me", socket.id);

  socket.on("callUser", (data) => {
    console.log("call user");
    io.to(data.userToCall).emit("callUser", {
      callerID: data.from,
      callerName: data.callerName,
      signalData: data.signalData,
    });
  });

  socket.on("answerCall", (data) => {
    console.log("answer call");
    io.to(data.callRoom.callerID).emit("callAccepted", {
      signal: data.signal,
      newCallRoom: data.callRoom,
    });
  });

  socket.on("endCall", (data) => {
    socket.to(data.callRoom.guestId).emit("callEnded");
    socket.to(data.callRoom.callerID).emit("callEnded");
  });

  socket.on("sendMessage", (data) => {
    console.log(`send message from ${data.sender} to ${data.receiver}`);
    io.to(data.receiver).emit("newMessage", {
      content: data.content,
      receiver: data.receiver,
      sender: data.sender,
      time: data.time,
    });
  });
});
