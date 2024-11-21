const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = dbConfig;
