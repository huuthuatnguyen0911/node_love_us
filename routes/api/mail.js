const express = require("express");
const router = express.Router();

const MailController = require("../../app/controllers/MailController");

router.post("/send-authentication-account", MailController.sendMailAuthenticationAccount);

module.exports = router;
