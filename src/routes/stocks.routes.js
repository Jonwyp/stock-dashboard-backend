const express = require("express");
const router = express.Router();
const Stocks = require("../models/stocks.model");
const {
  FORECAST_FIELD,
  V_FIELD,
  ID_FIELD
} = require("../utils/constantFields");
const wrapAsync = require("../utils/wrapAsync");

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const projections = `-${FORECAST_FIELD} -${V_FIELD} -${ID_FIELD}`;
    const showAllStocks = await Stocks.find({}, projections);
    res.status(200).send(showAllStocks);
  })
);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
