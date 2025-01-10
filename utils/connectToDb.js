import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Încărcăm variabilele de mediu din fișierul .env

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log("Database connection successful");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}


export default connectToDb;