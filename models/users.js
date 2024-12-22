const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
