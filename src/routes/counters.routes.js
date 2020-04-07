const express = require("express");
const router = express.Router();
const LikeDislike = require("../models/likeDislike.model");
const wrapAsync = require("../utils/wrapAsync");

const getLikeDislike = async (req, res, next) => {
  const forecastId = req.params.id;
  if (!(await LikeDislike.exists({ forecastId }))) {
    return res.sendStatus(204);
  }
  const foundForecastLikeDislike = await LikeDislike.findOne({ forecastId });
  res.status(200).send(foundForecastLikeDislike);
};

const upsertLikeDisklike = async (req, res, next) => {
  const forecastId = req.params.id;
  const likeDislikeCount = req.body;
  const forecastLikeDislikeCount = await LikeDislike.findOneAndUpdate(
    { forecastId },
    {
      likeCounter: likeDislikeCount.likeCounter,
      dislikeCounter: likeDislikeCount.dislikeCounter,
    },
    { new: true, upsert: true }
  );
  res.status(200).send(forecastLikeDislikeCount);
};

router.get("/:id", wrapAsync(getLikeDislike));
router.patch("/:id", wrapAsync(upsertLikeDisklike));

module.exports = router;
