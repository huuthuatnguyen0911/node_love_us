const campaignModel = require("../../models/Campaign");

class InitPageController {
  // [GET] /base/home-page/index
  indexHomePage(req, res) {
    const getCampaigns = campaignModel
      .find({})
      .sort({ createdAt: "desc" })
      .limit(10);

    Promise.all([getCampaigns])
      .then(([campaigns]) => {
        return res.status(200).json({
          data: {
            dataCampaings: campaigns,
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

  // [GET] /base/event-page/index
  indexEventPage(req, res) {
    const getAllCampaignsNew = campaignModel.aggregate([
      {
        $match: {
          campaign_confirm: true,
        },
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
      {
        $sort: {
          campaign_start_time: -1,
        },
      },
      // {
      //   $limit: 5,
      // },
    ]);

    Promise.all([getAllCampaignsNew])
      .then(([campaigns]) => {
        return res.status(200).json({
          data: {
            dataCampaigns: campaigns,
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
}

module.exports = new InitPageController();
