import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
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
  avatarURL: {
    type: String, // Adaugă câmpul avatarURL pentru a stoca URL-ul avatarului
  },
});

// Criptare parola înainte de a salva
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Setarea avatarului cu gravatar înainte de a salva
userSchema.pre("save", function (next) {
  if (!this.avatarURL) {
    this.avatarURL = gravatar.url(this.email, { s: "250", d: "retro" }, true);
  }
  next();
});

// Metodă pentru a compara parola introdusă cu cea criptată
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
