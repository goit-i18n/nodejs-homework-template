import mongoose from "mongoose";

async function connectToDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://elenatalmaciu15:il5fTkrOcaiwcHZC@cluster0.hovybqv.mongodb.net/tematreidb"
    );
    console.log("Database connection successful");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
export default connectToDb;
