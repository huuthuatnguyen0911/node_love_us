const userModel = require("../models/User");
const md5 = require("md5");

class meController {
  // [GET] /me
  getMe(req, res) {
    if (req.userId) {
      userModel
        .findOne({ _id: req.userId })
        .then((user) => {
          res.status(200).json({
            code: "get_me_success",
            data: user,
            success: true,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            code: "error_server",
            message: "Server notification " + error.message,
            success: false,
          });
        });
    }
  }

  // [PUT] /me/update-avatar/:idUser
  updateAvatar(req, res) {
    const image = `images/${req.file.filename}`;
    const idUser = req.params.idUser;

    userModel
      .updateOne({ _id: idUser }, { avatar: image })
      .then(() => {
        res.status(200).json({
          mess: "Update avatar successfully",
          code: "update_avatar_success",
          data: {
            linkNewImage: image,
          },
          success: true,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  //[PUT] /me/update-infor/:idUser
  updateInforUser(req, res) {
    userModel
      .updateOne({ _id: req.params.idUser }, req.body)
      .then((data) => {
        res.status(200).json({
          mess: "Update avatar successfully",
          code: "update_avatar_success",
          data: data,
          success: true,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  //[PUT] /me/update-password/:idUser
  updatePassword(req, res) {
    const idUser = req.params.idUser;
    const formData = req.body;

    userModel
      .findById(idUser)
      .then((user) => {
        if (user.password == md5(formData.oldPassword)) {
          userModel
            .updateOne(
              { _id: idUser },
              {
                password: md5(formData.newPassword),
              }
            )
            .then(() => {
              res.status(200).json({
                mess: "Update password successfully",
                code: "update_password_success",
                success: true,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                message: `Error of server ${error.message}`,
                code: "errour_server",
                success: false,
              });
            });
        } else {
          return res.status(404).json({
            message: `Old password not exist`,
            code: "old_password_not_exist",
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
  }
}

module.exports = new meController();
