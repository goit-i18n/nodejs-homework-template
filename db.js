const mongoose = require("mongoose");

require("dotenv").config();

// Database connect
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

exports.connectToDb = connectToDb;
