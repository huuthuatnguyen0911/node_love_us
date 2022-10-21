const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");
const slug = require("mongoose-slug-generator");

const animalSchema = new Schema(
  {
    name: { type: String },
    avatar: { type: String },
    listImage: { type: Array },
    imageEnv: { type: String },
    name_science: { type: String },
    surname: { type: String },
    order: { type: String },
    sub_des: { type: String, maxLength: 200 },
    detection_time: { type: String },
    number_individuals: { type: Number },
    description: { type: String },
    reference_material: {
      type: Object,
      name: { type: String },
      link: { type: String },
    },
    status: {
      type: String,
      enum: ["protected", "extinct", "normal", "extermination"],
      default: "normal",
    },
    habitat: { type: String, enum: ["land", "water", "overhead", "swamp"] },
    distribution: { type: String },
    size: { type: String },
    age: { type: String },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);

animalSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});
mongoose.plugin(slug);

module.exports = mongoose.model("Animal", animalSchema);
