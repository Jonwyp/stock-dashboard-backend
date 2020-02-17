const mongoose = require("mongoose");
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

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
