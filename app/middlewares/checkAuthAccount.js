const authenAccountModel = require("../models/AuthenAccount");

module.exports = function checkAuthenAccount(req, res, next) {
  const idUser = req.userId;

  authenAccountModel
    .findOne({ idUser: idUser })
    .then((auth) => {
      if (auth && auth.status) {
        next();
      } else {
        return res.status(400).json({
          mess: "Not registered for authentication",
          code: "not_register_auth",
          success: false,
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: `Error of server ${error.message}`,
        code: "errour_server",
        success: false,
      });
    });
};
