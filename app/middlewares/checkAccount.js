const userModel = require("../models/User");
const { getToken, verifyToken } = require("../../utils/handleToken");

module.exports = {
  async checkLogin(req, res, next) {
    const token = getToken(req.headers);

    if (token === null) {
      return res.status(403).json({
        code: "no_token",
        message: "No token provided!",
        success: false,
      });
    }

    let data = await verifyToken(token);

    if (data === null) {
      return res.status(403).json({
        code: "no_verify_token",
        message: "No verify token provided!",
        success: false,
      });
    } else {
      req.userId = data.id;
      next();
    }
  },

  async checkAdmin(req, res, next) {
    const token = getToken(req.headers);

    if (token === null) {
      return res.status(403).json({
        code: "no_token",
        message: "No token provided!",
        success: false,
      });
    }

    let data = await verifyToken(token);
    if (data === null) {
      return res.status(403).json({
        code: "no_verify_token",
        message: "No verify token provided!",
        success: false,
      });
    } else {
      const idUser = data.id;
      userModel.findOne({ _id: idUser }).then((user) => {
        if (user.role == "admin") {
          next();
        } else {
          return res.status(403).json({
            code: "your_not_access_router",
            message: "You do not have access to this router!",
            success: false,
          });
        }
      });
    }
  },

  async checkUser(req, res, next) {
    const token = getToken(req.headers);

    if (token === null) {
      return res.status(403).json({
        code: "no_token",
        message: "No token provided!",
        success: false,
      });
    }

    let data = await verifyToken(token);
    if (data === null) {
      return res.status(403).json({
        code: "no_verify_token",
        message: "No verify token provided!",
        success: false,
      });
    } else {
      const idUser = data.id;
      userModel.findOne({ _id: idUser }).then((user) => {
        if (user.role == "user") {
          next();
        } else {
          return res.status(403).json({
            code: "your_not_access_router",
            message: "You do not have access to this router!",
            success: false,
          });
        }
      });
    }
  },
};
