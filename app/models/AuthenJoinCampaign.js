const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const authenJoinCampaignSchema = new Schema(
  {
    id_participant: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    id_campaign: {
      type: mongoose.Types.ObjectId,
      ref: "Campaign",
    },
  },
  {
    timestamps: true,
  }
);

authenJoinCampaignSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model(
  "authen_join_campaigns",
  authenJoinCampaignSchema
);
