const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const authenAccountSchema = new Schema(
  {
    idUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    identity_card: { type: Array },
    selfie_image: { type: String, },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

authenAccountSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("authen_accounts", authenAccountSchema);
