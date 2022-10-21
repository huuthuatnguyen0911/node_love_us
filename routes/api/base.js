const express = require("express");
const router = express.Router();

const locationController = require("../../app/controllers/base/LocationController");
const bankController = require("../../app/controllers/base/BankController");
const initPageController = require("../../app/controllers/base/InitPageController");

router.get("/location-viet-nam", locationController.getListLocation);
router.get("/bank-viet-nam", bankController.getListBank);
router.get("/home-page/index", initPageController.indexHomePage);
router.get("/event-page/index", initPageController.indexEventPage);

module.exports = router;
