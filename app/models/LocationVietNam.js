const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationVietNameSchema = new Schema({
  id: { type: String },
  code: { type: String },
  name: { type: String },
  districts: { type: Array },
});

module.exports = mongoose.model("location_viet_nam", locationVietNameSchema);
