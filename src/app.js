const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

mongoose.connect('mongodb+srv://cursarudamian:1234@cluster0.mo152rw.mongodb.net/contacts?retryWrites=true&w=majority', {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;