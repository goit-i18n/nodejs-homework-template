const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
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
  avatarURL: String,

  verify: {
    type: Boolean,
    default: false,
  },
});

userSchema.post("save", function (doc, next) {
  console.log("new user was created", doc);
  next();
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  console.log("user about to be created & saved", this);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
