"use strict";

const mongoose = require("mongoose");

const memberModel = require("../models/CampaignMember");

class CampaignMemberController {
  createMemberWithCampaign(formData) {
    return new Promise((resolve, reject) => {
      const newMember = new memberModel(formData);
      newMember
        .save()
        .then((member) => {
          resolve(member);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getListMemberWithIdUser(idUser) {
    return new Promise((resolve, reject) => {
      memberModel
        .find({ Chat_list_messenger: idUser })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  }
}
module.exports = new CampaignMemberController();
