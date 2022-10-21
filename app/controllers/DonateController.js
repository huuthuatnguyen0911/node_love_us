const mongoose = require("mongoose");

const donorModel = require("../models/Donor");
const donateDonorModel = require("../models/Donate_Donor");
const ResponseModel = require("../models/ResponseModel");

class DonateController {
  //  [GET] /donate/donate-not-confirm
  getInforDonateNotConfirm(req, res) {
    donateDonorModel
      .aggregate([
        {
          $match: {
            status: { $eq: "admin_not_confirm" },
          },
        },
        {
          $lookup: {
            from: "donors",
            localField: "Id_donor",
            foreignField: "_id",
            as: "data_donor",
          },
        },
        {
          $unwind: "$data_donor",
        },
        {
          $lookup: {
            from: "users",
            localField: "data_donor.Donor_sender",
            foreignField: "_id",
            as: "data_user",
          },
        },
        {
          $unwind: {
            path: "$data_user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "donates",
            localField: "Id_donate",
            foreignField: "_id",
            as: "data_donate",
          },
        },
        {
          $unwind: {
            path: "$data_donate",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "campaigns",
            localField: "data_donate.id_campaign",
            foreignField: "_id",
            as: "data_campaign",
          },
        },
        {
          $unwind: {
            path: "$data_campaign",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            "data_donor._id": 1,
            "data_donor.Donor_messenger": 1,
            "data_donor.Donor_money": 1,
            "data_donor.Donor_form": 1,
            "data_donor.Donor_code": 1,
            "data_donor.createdAt": 1,
            "data_user._id": 1,
            "data_user.name": 1,
            "data_campaign._id": 1,
            "data_campaign.campaign_name": 1,
          },
        },
      ])
      .then((donates) => {
        return res
          .status(200)
          .json(ResponseModel(true, "Get all donate", donates));
      })
      .catch((err) => {
        return res
          .status(500)
          .json(ResponseModel(false, "Error server", err.message));
      });
  }

  // [POST] /donate/create
  createDonate(req, res) {
    let donorModelNew = new donorModel(req.body);

    donorModelNew
      .save()
      .then((donor) => {
        let donateDonorModelNew = new donateDonorModel({
          Id_donate: req.body.idCampaignDonate,
          Id_donor: donor._id,
        });

        donateDonorModelNew.save().then(() => {
          return res.status(200).json({
            mess: "Donate successfully",
            success: true,
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  // [POST] /donate/admin-confirm/:idDonate
  adminConfirmDonate(req, res) {
    const idDonate = req.params.idDonate;

    donateDonorModel
      .updateOne({ _id: idDonate }, { status: "done" })
      .then(() => {x
        return res
          .status(200)
          .json(ResponseModel(true, "Admin confirm donate", ""));
      })
      .catch((err) => {
        return res
          .status(500)
          .json(
            ResponseModel(false, "Admin confirm donate error", err.message)
          );
      });
  }
}
module.exports = new DonateController();
