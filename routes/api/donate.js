const express = require("express");
const router = express.Router();

const donateController = require("../../app/controllers/DonateController");

router.get("/donate-not-confirm", donateController.getInforDonateNotConfirm);
router.post("/create", donateController.createDonate);
router.post("/admin-confirm/:idDonate", donateController.adminConfirmDonate);

module.exports = router;
