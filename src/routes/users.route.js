const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Users = require("../models/users.model");
const {
  ID_FIELD,
  USERNAME_FIELD,
  FIRSTNAME_FIELD,
  LASTNAME_FIELD
} = require("../utils/constantFields");
const { createJWTToken } = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");

const showUserInfo = async (req, res, next) => {
  const username = req.params.username;
  const projections = `${ID_FIELD} ${USERNAME_FIELD} ${FIRSTNAME_FIELD} ${LASTNAME_FIELD}`;
  const filteredUser = await Users.findOne({ username }, projections);
  res.status(200).send(filteredUser);
};

const registerNewUser = async (req, res, next) => {
  const user = req.body;
  const newUser = new Users(user);
  await Users.init();
  newUser.id = uuidv4();
  await newUser.save();
  res.status(201).send(newUser);
};

const logoutUser = (req, res, next) => {
  res.clearCookie("token").send("You are now logged out!");
};

const loginUser = async (req, res, next) => {
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
      expires: expiryDate
    });
    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed.") {
      err.statusCode = 401;
    }
    next(err);
  }
};

router.get("/:username", wrapAsync(showUserInfo));
router.post("/register", wrapAsync(registerNewUser));
router.post("/logout", wrapAsync(logoutUser));
router.post("/login", loginUser);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
