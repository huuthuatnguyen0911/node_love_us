"use strict";

const mongoose = require("mongoose");

const donateModel = require("../models/Donate");

class CampaignDonateController {
  createDonateWithCampaign(formData) {
    return new Promise((resolve, reject) => {
      const newDonate = new donateModel(formData);
      newDonate
        .save()
        .then((donate) => {
          resolve(donate);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
module.exports = new CampaignDonateController();
