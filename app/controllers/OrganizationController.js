"use strict";

const mongoose = require("mongoose");

const organizationnModel = require("../models/CampaignOrganization");

class OrganizationController {
  createOrganizationWithCampaign(formData) {
    return new Promise((resolve, reject) => {
      const newOrganization = new organizationnModel(formData);
      newOrganization
        .save()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

module.exports = new OrganizationController();
