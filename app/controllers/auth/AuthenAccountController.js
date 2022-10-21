const mongoose = require("mongoose");

const authenAccountModel = require("../../models/AuthenAccount");
const mailController = require("../../controllers/MailController");

class AuthenAccountController {
  // [POST] /authen-account/send-infor-auth/:idUser
  sendInforAutAccount(req, res) {
    const listImageAuthen = req.files;
    const idUser = req.params.idUser;

    if (listImageAuthen) {
      authenAccountModel
        .findOne({
          idUser: new mongoose.Types.ObjectId(idUser),
        })
        .then((result) => {
          if (result) {
            res.status(404).json({
              message: `Authen exist`,
              code: "authen_exist",
              data: docs,
              success: false,
            });
          } else {
            let identity_card = [];

            identity_card.push(`images/${listImageAuthen[1].filename}`);
            identity_card.push(`images/${listImageAuthen[2].filename}`);

            const formAuthen = {
              idUser: idUser,
              selfie_image: `images/${listImageAuthen[0].filename}`,
              identity_card: identity_card,
            };

            const newAuthenAccount = new authenAccountModel(formAuthen);

            newAuthenAccount
              .save()
              .then(() => {
                res.status(200).json({
                  mess: "Create authen account successfully",
                  code: "create_authen_account_success",
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

  // [GET] /authen-account/check-authen-account
  checkAuthenAccount(req, res) {
    authenAccountModel
      .findOne({ idUser: req.userId })
      .then((auth) => {
        if (auth) {
          if (auth.status) {
            return res.status(200).json({
              mess: "Verified user account",
              success: true,
            });
          } else {
            return res.status(200).json({
              mess: "Unverified user account",
              code: "unverified_account",
              success: false,
            });
          }
        } else {
          return res.status(200).json({
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
  }

  // [GET] /authen-account/get-all-account?status=true||false
  getAllAccountWithStatus(req, res) {
    const isSetTrue = req.query.status === "true";

    authenAccountModel
      .aggregate([
        {
          $match: {
            status: isSetTrue,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "dataUser",
          },
        },
        {
          $unwind: "$dataUser",
        },
        {
          $sort: { createdAt: 1 },
        },
        {
          $project: {
            _id: 1,
            idUser: 1,
            identity_card: 1,
            selfie_image: 1,
            createdAt: 1,
            status: 1,
            "dataUser.avatar": 1,
            "dataUser.name": 1,
            "dataUser.email": 1,
            "dataUser.dob": 1,
            "dataUser.phone": 1,
            "dataUser.address": 1,
            "dataUser.activity_point": 1,
          },
        },
      ])
      .then((datas) => {
        res.status(200).json({
          message: `Get all auth account`,
          data: datas,
          code: "get_all_auth_account",
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

  // [GET] /authen-account/search-account?status=true||false&name&phone&email
  searchAccountAuthWithConditions(req, res) {
    const isSetTrue = req.query.status === "true";
    authenAccountModel
      .aggregate([
        {
          $match: {
            status: isSetTrue,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "dataUser",
          },
        },
        {
          $match: {
            $or: [
              {
                "dataUser.name": { $regex: ".*" + req.query.name + ".*" },
              },

              {
                "dataUser.phone": { $regex: ".*" + req.query.phone + ".*" },
              },

              {
                "dataUser.email": { $regex: ".*" + req.query.email + ".*" },
              },
            ],
          },
        },
        {
          $sort: { createdAt: 1 },
        },
        {
          $project: {
            _id: 1,
            idUser: 1,
            identity_card: 1,
            selfie_image: 1,
            createdAt: 1,
            status: 1,
            "dataUser.avatar": 1,
            "dataUser.name": 1,
            "dataUser.email": 1,
            "dataUser.dob": 1,
            "dataUser.phone": 1,
            "dataUser.address": 1,
            "dataUser.activity_point": 1,
          },
        },
      ])
      .then((datas) => {
        res.status(200).json({
          message: `Get all auth account with conditions`,
          data: datas,
          code: "get_all_auth_accoun_conditions",
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

  // [POST] /authen-account/confirm-account/:idUser?status=true||false
  confirmAccount(req, res) {
    if (req.query.status == "confirm") {
      authenAccountModel
        .updateOne(
          { idUser: new mongoose.Types.ObjectId(req.params.idUser) },
          { $set: { status: true } }
        )
        .then(() => {
          mailController
            .sendMailAuthenticationAccount(req.params.idUser, true)
            .then((status) => {
              if (status) {
                return res.status(200).json({
                  message: `Update authentication account successfully`,
                  code: "update_success",
                  success: true,
                });
              } else {
                return res.status(400).json({
                  message: `Update authentication account fail`,
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
        })
        .catch((error) => {
          return res.status(500).json({
            message: `Error of server ${error.message}`,
            code: "errour_server",
            success: false,
          });
        });
    } else if (req.query.status == "unconfirm") {
      authenAccountModel
        .deleteOne({ idUser: new mongoose.Types.ObjectId(req.params.idUser) })
        .then(() => {
          return res.status(200).json({
            message: `Delete authentication account successfully`,
            code: "delete_success",
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
  }
}

module.exports = new AuthenAccountController();
