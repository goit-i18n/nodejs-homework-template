require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/api/contacts')
const mongoose = require("mongoose");

const app = express();


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connection successful"))
    .catch(err => {
      console.error("Database connection error:", err);
      process.exit(1);
    });

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'


app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
