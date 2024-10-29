require('dotenv').config(); // Adaugă această linie la începutul fișierului server.js

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/api/auth/avatars');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
