import mongoose from "mongoose";
import colors from "colors";

async function connectToDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://sovarrobertionut:rdcRKYrUjKliqRiD@clusterforhomework.cjqfh4l.mongodb.net/db-contacts"
    );
    console.log("Database connection successful".bgGreen);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default connectToDb;
