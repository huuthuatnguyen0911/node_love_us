"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongoose_delete = require("mongoose-delete");

const campaignSchema = new Schema(
  {
    campaign_name: { type: String },
    campaign_avatar: { type: String },
    campaign_owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    id_organization_campaign: {
      type: mongoose.Types.ObjectId,
      ref: "Campaign_Organization",
    },
    campaign_description: { type: String },
    campaign_story: { type: String, required: false },
    campaign_province: { type: String },
    campaign_district: { type: String },
    campaign_wards: { type: String },
    campaign_location_detail: { type: String },
    campaign_start_time: { type: Date },
    campaign_end_time: { type: Date },
    campaign_list_image: { type: Array, required: false },
    campaign_status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    campaign_type: {
      type: String,
      enum: ["online", "offline"],
    },
    campaign_password: { type: String, default: "" },
    campaign_confirm: { type: Boolean, default: false },
    slug: { type: String, slug: "campaign_name", unique: true },
  },
  {
    timestamps: true,
  }
);

campaignSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});
mongoose.plugin(slug);

module.exports = mongoose.model("Campaign", campaignSchema);
