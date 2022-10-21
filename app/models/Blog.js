const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongoose_delete = require("mongoose-delete");

const ObjectId = Schema.ObjectId;

const blogSchema = new Schema(
  {
    title: { type: String },
    main_image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIzeYIsbZyzdLFqq44fBLba0eAFabFZO6jcfVUAAl8Z2Y4XA3nEB1FhAMkx1mnHDn5EWo&usqp=CAU",
    },
    list_category: { type: Array },
    content: { type: String },
    countEye: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  }
);

blogSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});
mongoose.plugin(slug);

module.exports = mongoose.model("blog", blogSchema);
