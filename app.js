const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;