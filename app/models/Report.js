const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

const Report = new Schema(
  {
    email: { type: String },
    city: { type: String },
    district: { type: String },
    address: { type: String },
    link: { type: String, default: "" },
    fileProof: { type: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", Report);
