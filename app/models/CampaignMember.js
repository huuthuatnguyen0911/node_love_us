const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campaignMemberSchema = new Schema(
  {
    id_campaign: {
      type: mongoose.Types.ObjectId,
      ref: "Campaign",
    },
    CM_max_members: { type: Number, default: 1 },
    CM_list_members: [{ type: mongoose.Types.ObjectId }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign_Members", campaignMemberSchema);
