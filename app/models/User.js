const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

const User = new Schema(
  {
    avatar: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/app-order-tour-dacs3.appspot.com/o/user_avt.png?alt=media&token=2566c32a-7a3c-42e0-b871-b9cb1faaff8b",
    },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    dob: { type: String },
    age: { type: String },
    role: { type: String, default: "user" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    slug: { type: String, slug: "name", unique: true },
    activity_point: { type: Number, default: 100 },
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(slug);

module.exports = mongoose.model("User", User);
