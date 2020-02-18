const express = require("express");
const router = express.Router();
const Stocks = require("../models/stocks.model");
const uuidv4 = require("uuid/v4");
const {
  FORECAST_FIELD,
  V_FIELD,
  MONGOID_FIELD
} = require("../utils/constantFields");
const protectRoute = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const projections = `-${FORECAST_FIELD} -${V_FIELD} -${MONGOID_FIELD}`;
    const showAllStocks = await Stocks.find({}, projections);
    res.status(200).send(showAllStocks);
  })
);

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    const stock = req.body;
    const newStock = new Stocks(stock);
    await Stocks.init();
    newStock.id = uuidv4();
    await newStock.save();
    res.status(201).send(stock);
  })
);

router.get(
  "/:quote",
  wrapAsync(async (req, res, next) => {
    const quote = req.params.quote;
    const filteredStock = await Stocks.findOne({ quote });
    res.status(200).send(filteredStock);
  })
);

router.post(
  "/:quote/forecast",
  protectRoute,
  wrapAsync(async (req, res, next) => {
    const quote = req.params.quote;
    const newForecast = req.body;
    newForecast.id = uuidv4();
    newForecast.username = req.user.username;
    newForecast.userId = req.user.userId;
    const filteredStock = await Stocks.findOneAndUpdate(
      { quote },
      { $push: { forecast: newForecast } }
    );
    res.status(201).send(newForecast);
  })
);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
