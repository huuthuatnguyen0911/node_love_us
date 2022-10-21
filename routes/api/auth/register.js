const express = require("express");
const router = express.Router();

const registerController = require("../../../app/controllers/auth/RegisterController");
const upload = require("../../../app/middlewares/uploadMiddleware");

router.post("/", upload.single("image"), registerController.create);

module.exports = router;
