const mongoose = require("mongoose");
const colors = require("colors");

async function dbConnection() {
  try {
    await mongoose.connect(
    "mongodb+srv://onnisimsuldac:jRtJ9WNBhn02kUtW@cluster0.mrqqycy.mongodb.net/db-contacts"
    );
    console.log(colors.bgGreen.italic.bold("Database connection successful!"));
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    process.exit(1);
  }
}

module.exports = dbConnection;
