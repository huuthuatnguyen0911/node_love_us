const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankVietNameSchema = new Schema({
  en_name: { type: String },
  vn_name: { type: String },
  bankId: { type: String },
  atmBin: { type: String },
  cardLength: { type: Number },
  shortName: { type: String },
  bankCode: { type: String },
  type: { type: String },
  napasSupported: { type: Boolean },
});

module.exports = mongoose.model("bank_viet_nam", bankVietNameSchema);
