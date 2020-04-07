const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeDislikeSchema = new Schema({
  forecastId: { type: String, immutable: true, required: true },
  likeCounter: { type: Number, default: 0 },
  dislikeCounter: { type: Number, default: 0 },
});

const LikeDislike = mongoose.model("LikeDislike", LikeDislikeSchema);

module.exports = LikeDislike;
