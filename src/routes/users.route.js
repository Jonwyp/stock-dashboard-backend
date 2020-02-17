const express = require("express");
const router = express.Router();
const Users = require("../models/users.model");
const uuidv4 = require("uuid/v4");
const {
  ID_FIELD,
  USERNAME_FIELD,
  FIRSTNAME_FIELD,
  LASTNAME_FIELD
} = require("../utils/constantFields");
const wrapAsync = require("../utils/wrapAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get(
  "/:username",
  wrapAsync(async (req, res, next) => {
    const username = req.params.username;
    const projections = `${ID_FIELD} ${USERNAME_FIELD} ${FIRSTNAME_FIELD} ${LASTNAME_FIELD}`;
    const filteredUser = await Users.findOne({ username }, projections);
    res.status(200).send(filteredUser);
  })
);

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    const user = req.body;
    const newUser = new Users(user);
    await Users.init();
    newUser.id = uuidv4();
    await newUser.save();
    res.status(201).send(newUser);
  })
);

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

const createJWTToken = (id, username) => {
  const payload = { id, username };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed.");
    }
    const token = createJWTToken(user.id, user.username);
    const oneDay = 24 * 60 * 60 * 1000;
    const expiryDate = new Date(Date.now() + oneDay);

    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true
    });
    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed.") {
      err.statusCode = 401;
    }
    next(err);
  }
});

router.use((err, req, res, next) => {
  if (err.name === "ValidateError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
