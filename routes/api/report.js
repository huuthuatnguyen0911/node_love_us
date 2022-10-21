const express = require("express");
const router = express.Router();

const ReportController = require("../../app/controllers/ReportController");
const upload = require("../../app/middlewares/uploadMiddleware");

router.post("/send", upload.array("fileProof[]"), ReportController.sendReport);

module.exports = router;
