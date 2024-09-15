"use strict";

const mongoose = require("mongoose");
const md5 = require("md5");

const campaignModel = require("../models/Campaign");
const authJoinCampaignModel = require("../models/AuthenJoinCampaign");
const ResponseModel = require("../models/ResponseModel");

const OrganizationController = require("./OrganizationController");
const groupChatController = require("./GroupChatController");
const campaignMemberController = require("./CampaignMemberController");
const campaignDonateController = require("./CampaignDonateController");

const bankModel = require("../models/BankVietNam");

class CampaignController {
  //[POST] /campaign/create
  async create(req, res) {
    const formData = req.body;
    formData.CO_avatar = `images/${req.files[0].filename}`;
    formData.campaign_avatar = `images/${req.files[1].filename}`;

    // let id_donate_block;

    const getId_donate_block = await campaignModel
      .findOne()
      .sort({ createdAt: -1 });
    const id_donate_block = getId_donate_block.Id_donate
      ? getId_donate_block.Id_donate + 1
      : 6;

    console.log("id_donate_block", id_donate_block);

    // const Donate_max_money = ObjectDonate["Donate_max_money"];
    const formOrganization = {
      CO_name: formData.CO_name,
      CO_avatar: formData.CO_avatar,
      CO_link: formData.CO_link,
      CO_phone: formData.CO_phone,
      CO_location: formData.CO_location,
      CO_description: formData.CO_description,
    };

    if (formData.campaign_password) {
      formData.campaign_password = md5(formData.campaign_password);
    }

    const formCampaign = {
      campaign_name: formData.campaign_name,
      campaign_avatar: formData.campaign_avatar,
      campaign_owner: req.userId,
      campaign_description: formData.campaign_description,
      campaign_province: formData.campaign_province,
      campaign_district: formData.campaign_district,
      campaign_wards: formData.campaign_wards,
      campaign_location_detail: formData.campaign_location_detail,
      campaign_start_time: formData.campaign_start_time,
      campaign_end_time: formData.campaign_end_time,
      campaign_password: formData.campaign_password,
      campaign_type: formData.campaign_type,
    };

    const formCampaignMembers = {
      CM_max_members: formData.CM_max_members,
      CM_list_members: [req.userId],
    };

    const formGroupChatCampaign = {
      Chat_name: formData.campaign_name,
      Chat_avatar: formData.campaign_avatar,
    };

    const formDonate = {
      Donate_max_money: formData.Donate_max_money,
      Donate_date: formData.Donate_date,
      Donate_account_number_bank: formData.Donate_account_number_bank,
      Donate_bank_code: formData.Donate_bank_code,
      Donate_bank_name_account: formData.Donate_bank_name_account,
      Id_donate: id_donate_block,
    };

    OrganizationController.createOrganizationWithCampaign(formOrganization)
      .then((dataOrganization) => {
        formCampaign.id_organization_campaign = dataOrganization._id;
        const newCamppaign = new campaignModel(formCampaign);
        newCamppaign
          .save()
          .then((campaign) => {
            formCampaignMembers.id_campaign = campaign._id;
            formGroupChatCampaign.id_campaign = campaign._id;
            formDonate.id_campaign = campaign._id;

            Promise.all([
              groupChatController.createGroupChatWithCampaign(
                formGroupChatCampaign
              ),
              campaignMemberController.createMemberWithCampaign(
                formCampaignMembers
              ),
              campaignDonateController.createDonateWithCampaign(formDonate),
            ])
              .then(([chat, members, donate]) => {
                if (chat && members && donate) {
                  return res.status(200).json({
                    mess: "Create campaign successfully",
                    code: "create_campaign_success",
                    success: true,
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
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  // [GET] /campaign/get-all-with-id
  getALlWithId(req, res) {
    campaignMemberController
      .getListMmberWithIdUser(req.userId)
      .then((members) => {
        // campaignModel.members
        Promise.all([campaignModel.findOne({ _id: members.id_campaign })]);
        res.status(200).json({
          data: members,
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

  // [GET] /campaign/get-campaign/:idCampaign/:provinceId
  getDetailCampaignWithId(req, res) {
    if (
      req.params.idCampaign &&
      req.params.provinceId &&
      req.params.idCampaign != "undefined" &&
      req.params.provinceId != "undefined"
    ) {
      const dataCampaign = campaignModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req.params.idCampaign) },
        },
        {
          $lookup: {
            from: "campaign_members",
            localField: "_id",
            foreignField: "id_campaign",
            as: "dataMembers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "dataMembers.CM_list_members",
            foreignField: "_id",
            as: "dataInforMembers",
          },
        },
        {
          $lookup: {
            from: "campaign_organizations",
            localField: "id_organization_campaign",
            foreignField: "_id",
            as: "dataOrganization",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "campaign_owner",
            foreignField: "_id",
            as: "dataOwnerCampaign",
          },
        },
        {
          $lookup: {
            from: "donates",
            localField: "_id",
            foreignField: "id_campaign",
            as: "dataDonate",
          },
        },
        {
          $unwind: "$dataDonate",
        },
        {
          $lookup: {
            from: "donate_donors",
            localField: "dataDonate._id",
            foreignField: "Id_donate",
            pipeline: [
              {
                $match: { status: "done" },
              },
            ],
            as: "dataDonor",
          },
        },
        {
          $lookup: {
            from: "donors",
            localField: "dataDonor.Id_donor",
            foreignField: "_id",
            as: "dataInforDonor",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "dataInforDonor.Donor_sender",
            foreignField: "_id",
            as: "dataInforSenderDonor",
          },
        },
        {
          $project: {
            _id: 1,
            campaign_name: 1,
            campaign_avatar: 1,
            campaign_description: 1,
            campaign_province: 1,
            campaign_district: 1,
            campaign_wards: 1,
            campaign_location_detail: 1,
            campaign_start_time: 1,
            campaign_end_time: 1,
            campaign_password: 1,
            campaign_type: 1,
            campaign_list_image: 1,
            createdAt: 1,
            slug: 1,
            "dataMembers._id": 1,
            "dataMembers.CM_max_members": 1,
            "dataInforMembers.avatar": 1,
            "dataInforMembers.name": 1,
            "dataOrganization.CO_name": 1,
            "dataOrganization.CO_avatar": 1,
            "dataOrganization.CO_link": 1,
            "dataOrganization.CO_phone": 1,
            "dataOrganization.CO_location": 1,
            "dataOwnerCampaign._id": 1,
            "dataOwnerCampaign.avatar": 1,
            "dataOwnerCampaign.name": 1,
            "dataOwnerCampaign.phone": 1,
            "dataOwnerCampaign.email": 1,
            "dataOwnerCampaign.activity_point": 1,
            "dataDonate._id": 1,
            "dataDonate.Donate_max_money": 1,
            "dataDonate.Donate_date": 1,
            "dataDonate.Donate_account_number_bank": 1,
            "dataDonate.Donate_bank_code": 1,
            "dataDonate.Donate_bank_name_account": 1,
            "dataDonate.Donate_bank_code": 1,
            "dataInforDonor._id": 1,
            "dataInforDonor.Donor_sender": 1,
            "dataInforDonor.Donor_messenger": 1,
            "dataInforDonor.Donor_money": 1,
            "dataInforSenderDonor._id": 1,
            "dataInforSenderDonor.name": 1,
            // dataDonor: 1,
            // "dataInforSenderDonor.avatar": 1,
            // "dataInforSenderDonor.name": 1,
            // dataInforSenderDonor: 0,
          },
        },
      ]);

      const listCampaigns = campaignModel.aggregate([
        {
          $match: { campaign_province: req.params.provinceId },
        },
        {
          $lookup: {
            from: "campaign_members",
            localField: "_id",
            foreignField: "id_campaign",
            as: "dataMembers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "dataMembers.CM_list_members",
            foreignField: "_id",
            as: "dataInforMembers",
          },
        },
        {
          $lookup: {
            from: "campaign_organizations",
            localField: "id_organization_campaign",
            foreignField: "_id",
            as: "dataOrganization",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "campaign_owner",
            foreignField: "_id",
            as: "dataOwnerCampaign",
          },
        },
        {
          $lookup: {
            from: "donates",
            localField: "_id",
            foreignField: "id_campaign",
            as: "dataDonate",
          },
        },
        {
          $unwind: "$dataDonate",
        },
        {
          $lookup: {
            from: "donate_donors",
            localField: "dataDonate._id",
            foreignField: "Id_donate",
            pipeline: [
              {
                $match: { status: "done" },
              },
            ],
            as: "dataDonor",
          },
        },
        {
          $lookup: {
            from: "donors",
            localField: "dataDonor.Id_donor",
            foreignField: "_id",
            as: "dataInforDonor",
          },
        },
        { $limit: 6 },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            _id: 1,
            campaign_name: 1,
            campaign_avatar: 1,
            campaign_description: 1,
            campaign_province: 1,
            campaign_district: 1,
            campaign_wards: 1,
            campaign_location_detail: 1,
            campaign_start_time: 1,
            campaign_end_time: 1,
            campaign_type: 1,
            campaign_password: 1,
            slug: 1,
            "dataMembers._id": 1,
            "dataMembers.CM_max_members": 1,
            "dataInforMembers.avatar": 1,
            "dataInforMembers.name": 1,
            "dataOrganization.CO_name": 1,
            "dataOrganization.CO_avatar": 1,
            "dataOrganization.CO_link": 1,
            "dataOrganization.CO_phone": 1,
            "dataOrganization.CO_location": 1,
            "dataOwnerCampaign._id": 1,
            "dataOwnerCampaign.avatar": 1,
            "dataOwnerCampaign.name": 1,
            "dataDonate._id": 1,
            "dataDonate.Donate_max_money": 1,
            "dataDonate.Donate_date": 1,
            "dataDonate.Donate_account_number_bank": 1,
            "dataDonate.Donate_bank_code": 1,
            "dataDonate.Donate_bank_name_account": 1,
            "dataDonate.Donate_bank_code": 1,
            "dataInforDonor.Donor_money": 1,
            // "dataInforSenderDonor.avatar": 1,
            // "dataInforSenderDonor.name": 1,
          },
        },
      ]);

      Promise.all([dataCampaign, listCampaigns])
        .then(([campaign, campaigns]) => {
          return res.status(200).json({
            data: {
              dataCampaign: campaign,
              listCampaigns: campaigns,
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
    } else {
      return res.status(304).json({
        code: "Not_defined",
        success: false,
      });
    }
  }

  // [POST] /campaign/join-campaign/:idCampaign/:idUser
  joinCampaigns(req, res) {
    const newAuthenCampaign = new authJoinCampaignModel({
      id_participant: req.params.idUser,
      id_campaign: req.params.idCampaign,
    });
    newAuthenCampaign
      .save()
      .then(() => {
        return res.status(200).json({
          mess: "Create authen campaign successfully",
          code: "create_authen_campaign_success",
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

  //[GET] /campaign/donate/:idCampaign
  getInforDonateCampaign(req, res) {
    if (req.params.idCampaign) {
      campaignModel
        .aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(req.params.idCampaign) },
          },
          {
            $lookup: {
              from: "donates",
              localField: "_id",
              foreignField: "id_campaign",
              as: "dataDonate",
            },
          },
          {
            $unwind: "$dataDonate",
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 1,
              campaign_name: 1,
              campaign_avatar: 1,
              slug: 1,
              "dataDonate._id": 1,
              "dataDonate.Donate_max_money": 1,
              "dataDonate.Donate_date": 1,
            },
          },
        ])
        .then((campaign) => {
          return res.status(200).json({
            data: campaign,
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

  //[GET] /campaign/manager?status=:status
  getCampaignByStatusConfirm(req, res) {
    const STATUS_CONFIRM = req.query.status;

    const isTrueSet = STATUS_CONFIRM === "true";

    campaignModel
      .aggregate([
        {
          $match: {
            campaign_confirm: isTrueSet,
          },
        },

        {
          $lookup: {
            from: "campaign_organizations",
            localField: "id_organization_campaign",
            foreignField: "_id",
            as: "dataOrganization",
          },
        },

        {
          $unwind: "$dataOrganization",
        },

        {
          $project: {
            _id: 1,
            campaign_name: 1,
            campaign_avatar: 1,
            campaign_province: 1,
            campaign_type: 1,
            campaign_start_time: 1,
            campaign_end_time: 1,
            campaign_confirm: 1,
            "dataOrganization._id": 1,
            "dataOrganization.CO_name": 1,
          },
        },
      ])
      .then((data) => {
        return res
          .status(200)
          .json(
            ResponseModel(
              true,
              "Get campaign with status confirm successfully ",
              data
            )
          );
      })
      .catch((err) => {
        return res
          .status(500)
          .json(
            ResponseModel(
              true,
              "Get campaign with status confirm failed",
              err.message
            )
          );
      });
  }

  // [GET] /campaign/confirm/:idCampaign
  confirmCampaign(req, res) {
    const id = req.params.idCampaign;
    campaignModel
      .updateOne({ _id: id }, { campaign_confirm: true })
      .then(() => {
        return res
          .status(200)
          .json(ResponseModel(true, "Confirm campaign successfully", ""));
      })
      .catch((err) => {
        return res
          .status(500)
          .json(ResponseModel(true, "Confirm campaign failed", ""));
      });
  }

  // [GET] /campaign/get-one/:idCampaign
  getOneCampaignById(req, res) {
    const id = req.params.idCampaign;
    campaignModel
      .aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "campaign_owner",
            foreignField: "_id",
            as: "data_author",
          },
        },
        {
          $unwind: "$data_author",
        },
        {
          $lookup: {
            from: "campaign_organizations",
            localField: "id_organization_campaign",
            foreignField: "_id",
            as: "data_organization",
          },
        },
        {
          $unwind: "$data_organization",
        },
        {
          $lookup: {
            from: "donates",
            localField: "_id",
            foreignField: "id_campaign",
            as: "data_donate",
          },
        },
        {
          $unwind: "$data_donate",
        },
      ])
      .then((data) => {
        return res
          .status(200)
          .json(ResponseModel(true, "Find one campaign successfully", data[0]));
      })
      .catch((err) => {
        return res
          .status(500)
          .json(ResponseModel(false, "Find one campaign failed", ""));
      });
  }

  // [DELETE] /campaign/delete/:idCampaign
  deleteCampaign(req, res) {
    campaignModel
      .delete({ _id: req.params.idCampaign })
      .then((data) => {
        return res
          .status(200)
          .json(ResponseModel(true, "Delete campaign successfully", ""));
      })
      .catch((err) => {
        return res
          .status(500)
          .json(ResponseModel(false, "Delete campaign failed", err));
      });
  }

  // [GET] /campaign/get-bank-by-bankcode/:bankCode
  getBankByBankCode(req, res) {
    const bankCode = req.params.bankCode;
    bankModel
      .findOne({ bankCode: bankCode })
      .then((data) => {
        return res
          .status(200)
          .json(
            ResponseModel(true, "Get bank by bank code successfully", data)
          );
      })
      .catch((err) => {
        return res
          .status(500)
          .json(ResponseModel(false, "Get bank by bank code failed", err));
      });
  }

  // [GET] /campaign/get-all
  //Lấy ra chiến dịch mới nhất
  async getNewCampaign(req, res) {
    try {
      const campaign = await campaignModel.findOne().sort({ createdAt: -1 });

      if (!campaign) {
        return res.status(404).send({ message: "No campaign found" });
      }

      console.log("campaign", campaign);

      res.send(campaign);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

module.exports = new CampaignController();
