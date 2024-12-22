const mongoose = require("mongoose");
require("dotenv").config();
async function connectToDb() {
  try {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;


    await mongoose.connect(uri);
    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection error:", err.message);
    process.exit(1);
  }
}
module.exports = { connectToDb };
