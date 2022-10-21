const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slug = require("mongoose-slug-generator");
const mongoose_delete = require("mongoose-delete");

const campaignOrganization = new Schema(
  {
    CO_name: { type: String },
    CO_avatar: { type: String },
    CO_link: { type: String },
    CO_phone: { type: String },
    CO_description: { type: String },
    CO_location: { type: String },
    slug: { type: String, slug: "CO_name", unique: true },
  },
  {
    timestamps: true,
  }
);

campaignOrganization.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});
mongoose.plugin(slug);

module.exports = mongoose.model("Campaign_Organization", campaignOrganization);
