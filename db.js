const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://andreeavinereanu03:pass@cluster0.jcxd2xj.mongodb.net/db-contacts?retryWrites=true&w=majority';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
