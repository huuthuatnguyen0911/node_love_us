const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorSchema = new Schema(
  {
    Donor_code: { type: String },
    Donor_sender: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: "000000000000000000000000",
    },
    Donor_messenger: { type: String, required: false },
    Donor_money: { type: Number },
    Donor_form: { type: String, enum: ["bank", "momo"] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("donors", donorSchema);
