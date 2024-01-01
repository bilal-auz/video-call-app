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

  // socket.on("disconnect", () => {
  //   socket.broadcast.emit("callEnd");
  // });

  socket.on("forceDisconnect", function () {
    console.log("force disconnect");
    socket.broadcast.emit("callEnd");
  });
});
