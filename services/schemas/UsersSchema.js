const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is required"],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, secret);
  this.token = token;
  // return token;
};

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
