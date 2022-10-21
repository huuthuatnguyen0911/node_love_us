const express = require("express");
const router = express.Router();

const AnimalController = require("../../app/controllers/AnimalController");

router.get("/:slugName", AnimalController.getAnimalWithSlug);
router.post("/", AnimalController.create);
router.get("/", AnimalController.getAllAnimal);

module.exports = router;
