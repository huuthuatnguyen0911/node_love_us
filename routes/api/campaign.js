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

router.get(
  "/get-bank-by-bankcode/:bankCode",
  campaignController.getBankByBankCode
);

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

// test get campaign
router.get("/get-new-campaign", campaignController.getNewCampaign);

router.delete("/delete/:idCampaign", campaignController.deleteCampaign);

module.exports = router;
