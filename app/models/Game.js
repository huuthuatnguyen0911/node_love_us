const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Game = new Schema(
  {
    name: { type: String },
    description: { type: String },
    linkName: { type: String },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", Game);
