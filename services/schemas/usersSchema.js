const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
const gravatar = require("gravatar");

const Schema = mongoose.Schema;

const user = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
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
  avatarUrl: { type: String, minLength: 2 },
});
user.methods.setPassword = (password) => {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

user.methods.validPassword = (password) => {
  // passwordFrontend === dcripata(passwordBackend)
  return bCrypt.compareSync(password, this.password);
};
user.pre("save", function (next) {
  if (!this.avatarUrl) {
    this.avatarUrl = gravatar.url(
      this.email,
      {
        s: 200,
        r: "pg",
        d: "identicon",
      },
      true
    );
  }
  next();
});

const User = mongoose.model("User", user);

module.exports = User;
