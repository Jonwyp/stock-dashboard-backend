const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");

const Stocks = require("../models/stocks.model");
const {
  FORECAST_FIELD,
  V_FIELD,
  MONGOID_FIELD
} = require("../utils/constantFields");
const { protectRoute } = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");
const seedDatabase = require("../data/seeder");

const nowDate = new Date(Date.now());

const findAllStocksWithProjections = async (req, res, next) => {
  const projections = `-${FORECAST_FIELD} -${V_FIELD} -${MONGOID_FIELD}`;
  const showAllStocks = await Stocks.find({}, projections);
  res.status(200).send(showAllStocks);
};

const createNewStock = async (req, res, next) => {
  const stock = req.body;
  const newStock = new Stocks(stock);
  await Stocks.init();
  newStock.id = uuidv4();
  await newStock.save();
  res.status(201).send(stock);
};

const findOneStock = async (req, res, next) => {
  const quote = req.params.quote;
  const filteredStock = await Stocks.findOne({ quote });
  res.status(200).send(filteredStock);
};

const createNewForecast = async (req, res, next) => {
  const quote = req.params.quote;
  const newForecast = req.body;
  newForecast.id = uuidv4();
  newForecast.username = req.user.username;
  newForecast.userId = req.user.userId;
  await Stocks.findOneAndUpdate(
    { quote },
    { $push: { forecast: newForecast } },
    { runValidators: true }
  );
  res.status(201).send(newForecast);
};

const editPermissionExpiry = (date, days = 7) => {
  const daysInMS = days * 24 * 60 * 60 * 1000;
  return new Date(daysInMS + Number(date));
};

const editOneForecast = async (req, res, next) => {
  const editForecast = req.body;
  const quote = req.params.quote;
  const id = req.params.id;

  const filteredStock = await Stocks.findOne({ quote });
  const index = filteredStock.forecast.map(forecast => forecast.id).indexOf(id);
  const selectedForecast = filteredStock.forecast[index];
  const createdDate = selectedForecast.createdAt;
  const expiryDate = editPermissionExpiry(createdDate);
  const userId = filteredStock.forecast[index].userId;

  if (userId != req.user.userId) {
    const err = new Error("You do not have permission to edit this post.");
    err.statusCode = 403;
    next(err);
  }
  if (nowDate > expiryDate) {
    const err = new Error("Unable to edit forecast after post is locked.");
    err.statusCode = 423;
    next(err);
  }
  Object.assign(selectedForecast, editForecast);
  selectedForecast.username = req.user.username;
  await filteredStock.save();
  res.status(200).send(selectedForecast);
};

const deleteOneForecast = async (req, res, next) => {
  const quote = req.params.quote;
  const id = req.params.id;

  const filteredStock = await Stocks.findOne({ quote });
  const index = filteredStock.forecast.map(forecast => forecast.id).indexOf(id);
  const createdDate = filteredStock.forecast[index].createdAt;
  const expiryDate = editPermissionExpiry(createdDate);
  const userId = filteredStock.forecast[index].userId;

  if (userId != req.user.userId) {
    const err = new Error("You do not have permission to delete this post.");
    err.statusCode = 403;
    next(err);
  }
  if (nowDate > expiryDate) {
    const err = new Error("Unable to delete forecast after post is locked.");
    err.statusCode = 423;
    next(err);
  }
  const deletedForecast = filteredStock.forecast.slice(index, 1);
  await filteredStock.save();
  res.status(200).send(deletedForecast[0]);
};

router.get("/", wrapAsync(findAllStocksWithProjections));
router.post("/", wrapAsync(createNewStock));
router.get("/:quote", wrapAsync(findOneStock));
router.post("/:quote/forecast", protectRoute, wrapAsync(createNewForecast));
router.patch("/:quote/forecast/:id", protectRoute, wrapAsync(editOneForecast));
router.delete(
  "/:quote/forecast/:id",
  protectRoute,
  wrapAsync(deleteOneForecast)
);
router.post("/seed", seedDatabase);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  if (err.name === "MongoError" && err.code === 11000) {
    err.statusCode = 422;
    err.message = "E11000 duplicate error.";
  }
  next(err);
});

module.exports = router;
