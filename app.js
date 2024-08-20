const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const connectToDatabase = require('./db');
require("dotenv").config();
const path = require('path');
const passport = require('./middlewares/passport'); 

const authRouter = require('./routes/api/auth');
const contactsRouter = require('./routes/api/contacts');


const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use(passport.initialize()); 

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});


const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
