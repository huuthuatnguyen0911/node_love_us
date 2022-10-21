const express = require("express");
const router = express.Router();

const loginController = require("../../../app/controllers/auth/LoginController");

router.post("/", loginController.index);
router.post("/giai", loginController.giatoken);

module.exports = router;
