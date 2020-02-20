const mongoose = require("mongoose");
const fjson = require("./filteredStockQuote.json");
const Stocks = require("../models/stocks.model");

const seedDatabase = async (req, res, next) => {
  try {
    await Stocks.create(fjson);
    res.status(201).send("Stock database seeded.");
  } catch (err) {
    console.log(
      "Stocks already exist in the database. Existing stocks are not replaced."
    );
    next(err);
  }
};

module.exports = seedDatabase;
