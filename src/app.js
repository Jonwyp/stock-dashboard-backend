const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const stocksRouter = require("./routes/stocks.routes");
const usersRouter = require("./routes/users.route");
const countersRouter = require("./routes/counters.routes");

const corsOptions = {
  origin: [
    process.env.FRONTEND_URI,
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    "0": "GET /",
    "1": "GET /stocks",
    "2": "POST /stocks",
    "3": "GET /stocks/:quote",
    "4": "GET /stocks/:quote/forecast",
    "5": "POST/stocks/:quote/forecast",
    "6": "PATCH/stocks/:quote/forecast/:id",
    "7": "DELETE /stocks/:quote/forecast/:id",
    "8": "GET /users/:username",
    "9": "POST /users/register",
    "10": "POST /users/login",
    "11": "POST /users/logout",
    "12": "GET /counters/:id",
    "13": "PATCH /counters/:id",
  });
});

app.use("/users", usersRouter);
app.use("/stocks", stocksRouter);
app.use("/counters", countersRouter);

app.all("/*", (req, res, next) => {
  const err = new Error("Page not found.");
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "Internal server error." });
  }
});

module.exports = app;
