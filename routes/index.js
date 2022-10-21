const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const uploadFile = require("../utils/uploadFile");

const registerRouter = require("./api/auth/register");
const loginRouter = require("./api/auth/login");
const meRouter = require("./api/me");
const reportRouter = require("./api/report");
const blogRouter = require("./api/blog");
const commentRouter = require("./api/comment");
const authenAccountRouter = require("./api/auth/authen_account");
const baseRouter = require("./api/base");
const campaignRouter = require("./api/campaign");
const donateRouter = require("./api/donate");
const chatRouter = require("./api/chat");
const mailRouter = require("./api/mail");
const animalRouter = require("./api/animal");

/**
 * MIDDLEWAREs
 */

const { checkLogin } = require("../app/middlewares/checkAccount");
const checkAuthenAccount = require("../app/middlewares/checkAuthAccount");

/**
 * ROUTER
 */
router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use("/me", checkLogin, meRouter);
router.use("/authen-account", checkLogin, authenAccountRouter);
router.use("/report", reportRouter);
router.use("/blog", blogRouter);
router.use("/comment", checkLogin, commentRouter);
router.use("/base", baseRouter);
router.use("/campaign", campaignRouter);
router.use("/donate", donateRouter);
router.use("/chat", checkLogin, checkAuthenAccount, chatRouter);
router.use("/mail", mailRouter);
router.use("/animal", animalRouter);
router.get("/test?name=:name", function (req, res) {
  res.json({
    name: req,
  });
});

// set name router api
function route(app) {
  app.use("/api", router);
}

module.exports = route;
