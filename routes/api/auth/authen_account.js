const express = require("express");
const router = express.Router();

const authenAccountController = require("../../../app/controllers/auth/AuthenAccountController");
const upload = require("../../../app/middlewares/uploadMiddleware");
// [MIDDLEWARE]
const {
  checkLogin,
  checkAdmin,
} = require("../../../app/middlewares/checkAccount");

router.post(
  "/send-infor-auth/:idUser",
  upload.array("listImageAuthenAccount[]"),
  authenAccountController.sendInforAutAccount
);

router.get(
  "/check-authen-account",
  checkLogin,
  authenAccountController.checkAuthenAccount
);

router.get(
  "/get-all-account",
  checkAdmin,
  authenAccountController.getAllAccountWithStatus
);
router.get(
  "/search-account",
  checkAdmin,
  authenAccountController.searchAccountAuthWithConditions
);
router.post(
  "/confirm-account/:idUser",
  checkAdmin,
  authenAccountController.confirmAccount
);

module.exports = router;
