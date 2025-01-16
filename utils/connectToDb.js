
const mongoose = require("mongoose");
const colors = require("colors");
const dontenv = require("dotenv");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(colors.bgGreen.italic.bold("Database connection successful!"));
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    process.exit(1);
  }
}

module.exports = connectToDb;