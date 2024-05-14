const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonateDonorSherma = new Schema(
  {
    Id_donate: { type: mongoose.Types.ObjectId },
    Id_employees: { type: mongoose.Types.ObjectId, required: false },
    Id_donor: { type: mongoose.Types.ObjectId },
    status: {
      type: String,
      enum: [
        "admin_not_confirm",
        "author_not_confirm",
        "admin_confirm_error",
        "author_confirm_error",
        "done",
      ],
      default: "done",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("donate_donors", DonateDonorSherma);
