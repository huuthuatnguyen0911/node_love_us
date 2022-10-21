const express = require("express");
const router = express.Router();

const groupChatController = require("../../app/controllers/GroupChatController");

router.get("/group-chat/get-all", groupChatController.getAllWithId);
router.get(
  "/messenger/:idGroupChat",
  groupChatController.getMessengerOfGroupChat
);

module.exports = router;
