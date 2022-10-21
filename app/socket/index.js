let io = null;

const registerGroupChat = require("./GroupChat");

const handleConnections = (socket) => {
  console.log("co nguoi ket noi " + socket.id);

  socket.on("disconnect", () => {
    console.log("co nguoi nguoi ngat ket noi " + socket.id);
  });

  registerGroupChat(io, socket);

  socket.on("order:create", (data) => {
    console.log(data);
  });
};

function onConnection(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", handleConnections);
}

module.exports = onConnection;
