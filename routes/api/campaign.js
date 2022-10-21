const express = require("express");
const router = express.Router();

const campaignController = require("../../app/controllers/CampaignController");
const campaignMemberController = require("../../app/controllers/CampaignMemberController");
const checkAuthenAccount = require("../../app/middlewares/checkAuthAccount");
const { checkLogin } = require("../../app/middlewares/checkAccount");

const upload = require("../../app/middlewares/uploadMiddleware");

router.get("/confirm/:idCampaign", campaignController.confirmCampaign);
router.get("/manager", campaignController.getCampaignByStatusConfirm);
router.get("/get-one/:idCampaign", campaignController.getOneCampaignById);
router.get(
  "/get-campaign/:idCampaign/:provinceId",
  campaignController.getDetailCampaignWithId
);

router.get("/donate/:idCampaign", campaignController.getInforDonateCampaign);

router.post(
  "/create",
  upload.array("imageCampaign[]"),
  checkLogin,
  checkAuthenAccount,
  campaignController.create
);

router.post(
  "/join-campaign/:idCampaign/:idUser",
  checkLogin,
  campaignController.joinCampaigns
);

router.delete("/delete/:idCampaign", campaignController.deleteCampaign);

module.exports = router;
