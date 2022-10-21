const groupChatController = require("../controllers/GroupChatController");

module.exports = (io, socket) => {
  const joinGroupChat = (groups) => {
    socket.join(groups);
  };

  const sendMessengerToGroup = ({ content, to, from }) => {
    groupChatController
      .createMessengerOfGroupChat(content, to, from)
      .then((data) => {
        if (data) {
          groupChatController
            .getOneMessengerOfGroupChat(data._id)
            .then((dataMess) => {
              io.in(to).emit("serverGroupChat:sendMess", dataMess[0]);
            })
            .catch((err) => {
              socket.emit("serverGroupChat:errorSendMess", {
                status: false,
                mess: err,
              });
            });
        }
      })
      .catch((err) => {
        socket.emit("serverGroupChat:errorSendMess", {
          status: false,
          mess: err,
        });
      });
  };

  socket.on("groupchat:join", joinGroupChat);
  socket.on("groupchat:sendMess", sendMessengerToGroup);
};
