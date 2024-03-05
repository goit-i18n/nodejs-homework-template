const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://andreea_20:dDNNeWnLrCdwzV3L@clustercontacts.sjlh3om.mongodb.net/db-contacts",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error: ", error);
    process.exit(1);
  }
};
module.exports = connectDB;
