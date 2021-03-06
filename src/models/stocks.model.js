const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockForecast = new Schema(
  {
    id: { type: String, immutable: true, required: true },
    userId: { type: String, immutable: true, required: true },
    username: String,
    position: {
      type: String,
      enum: ["long", "neutral", "short"],
      required: true
    },
    targetPrice: { type: Number, min: 0, required: true },
    timeFrame: {
      type: String,
      enum: ["3 months", "6 months", "1 year"],
      required: true
    },
    title: { type: String, required: true },
    rationale: { type: String, required: true }
  },
  { timestamps: true }
);

const stocksSchema = new Schema({
  id: { type: String, required: true, unique: true },
  quote: { type: String, minlength: 1, maxlength: 5, unique: true },
  forecast: [stockForecast]
});

stocksSchema.index(
  { "forecast.id": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "forecast.id": { $exists: true }
    }
  }
);

const Stocks = mongoose.model("Stocks", stocksSchema);

module.exports = Stocks;
