import mongoose from "mongoose";

async function connectToDb() {
    try {
      await mongoose.connect('mongodb+srv://laescristina2102:88JyLgDC7aGkyIh2@cluster0.wb2iizd.mongodb.net/ContactsDb')
      console.log('Conectat la baza de date cu succes.');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  export default connectToDb;