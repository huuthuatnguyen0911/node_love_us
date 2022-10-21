const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoose_delete = require("mongoose-delete");

const commentsSchema = new Schema(
  {
    commentator_id: { type: mongoose.Types.ObjectId, ref: "User" },
    blog_id: { type: mongoose.Types.ObjectId, ref: "blog" },
    content: { type: String },
    parent_id: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
  }
);

commentsSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("comment", commentsSchema);
