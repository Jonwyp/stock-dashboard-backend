const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeDislikeSchema = new Schema({
  forecastId: { type: String, immutable: true, required: true },
  likeCounter: Number,
  dislikeCounter: Number,
});

const LikeDislike = mongoose.model("LikeDislike", LikeDislikeSchema);

module.exports = LikeDislike;
