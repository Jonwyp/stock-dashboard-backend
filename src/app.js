const express = require("express");
const app = express();

const { generateRandomId } = require("./utils/generateRandomId");
const stocksRouter = require("./routes/stocks.routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    "0": "GET /",
    "1": "GET /stocks",
    "2": "POST /stocks",
    "3": "GET /stocks/:quote",
    "4": "POST/stocks/:quote/forecast",
    "5": "DELETE /stocks/:quote/forecast",
    "6": "GET /users/:username",
    "7": "POST /users/register",
    "8": "POST /users/login",
    "9": "POST /users/logout"
  });
});

app.use("/stocks", stocksRouter);

console.log(generateRandomId());

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "Internal server error" });
  }
});
module.exports = app;
