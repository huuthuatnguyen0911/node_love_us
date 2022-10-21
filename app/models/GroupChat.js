const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slug = require("mongoose-slug-generator");

const groupChatSchema = new Schema(
  {
    id_campaign: {
      type: mongoose.Types.ObjectId,
      ref: "Campaign",
    },
    Chat_name: { type: String },
    Chat_avatar: { type: String },
    Chat_status: { type: Boolean, default: false },
    slug: { type: String, slug: "Chat_name", unique: true },
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(slug);
module.exports = mongoose.model("Group_Chat", groupChatSchema);
