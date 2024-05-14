const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donateSchema = new Schema(
  {
    id_campaign: {
      type: mongoose.Types.ObjectId,
      ref: "Campaign",
    },
    Donate_list_donor: [{ type: mongoose.Types.ObjectId, required: false }],
    Donate_max_money: { type: Number },
    Donate_date: { type: Number },
    Donate_account_number_bank: { type: String },
    Donate_bank_code: { type: String },
    Donate_bank_name_account: { type: String },
    Id_donate: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donate", donateSchema);
