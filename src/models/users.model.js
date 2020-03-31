const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: String
});

userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }
  next();
});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
