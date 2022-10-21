const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const messengerSchema = new Schema(
  {
    id_group_chat: {
      type: mongoose.Types.ObjectId,
      ref: "Group_Chat",
    },
    content: { type: String },
    id_sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

messengerSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Messenger", messengerSchema);
