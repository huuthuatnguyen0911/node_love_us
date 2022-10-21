const express = require("express");
const router = express.Router();

const meController = require("../../app/controllers/meController");
const upload = require("../../app/middlewares/uploadMiddleware");

router.get("/", meController.getMe);
router.put(
  "/update-avatar/:idUser",
  upload.single("image_avatar"),
  meController.updateAvatar
);

router.put("/update-infor/:idUser", meController.updateInforUser);
router.put("/update-password/:idUser", meController.updatePassword);

module.exports = router;
