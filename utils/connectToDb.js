import mongoose from "mongoose";

async function connectToDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://andreipopoaca8:bxXXZ1KpzdcWEtMr@cluster0.ozno1ue.mongodb.net/db-contacts"
    );
    console.log("Database connection successful");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default connectToDb;
