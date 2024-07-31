const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const connectToDatabase = require('./db');
require("dotenv").config();

const passport = require('passport');
const authRouter = require('./routes/api/auth');
const contactsRouter = require('./routes/api/contacts');
const { auth } = require('./middewares/auth');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

require('./middewares/passport')(passport);
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;