const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/api/contacts'); // Import the contacts route

const app = express();

// Middleware setup
app.use(logger('dev')); // Logging
app.use(cors()); // Allow CORS
app.use(express.json()); // Middleware to parse JSON requests

// Use the contacts router
app.use('/api/contacts', contactsRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;