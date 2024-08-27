
const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config();



const uri = process.env.MONGODB_URI;

const db = mongoose.connect(uri, {
    dbName: 'db-contacts',
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('strictQuery', true);
// connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose connection successful');
});

mongoose.connection.on('error', err => {
    console.log(`Mongoose connection error: ${err.message}`);
    process.exit(1);
});

// disconnected

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connection to DB closed');
    process.exit();
});

module.exports = db;