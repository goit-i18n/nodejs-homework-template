const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');  
const authRoutes = require('./routes/api/auth');  // Authentication routes
const contactsRoutes = require('./routes/api/contacts');  // Contacts routes
const usersRoutes = require('./routes/api/users');  // Users routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/users', authRoutes);  // Authentication routes
app.use('/contacts', contactsRoutes);  // Contacts routes
app.use('/users', usersRoutes);  // Users management routes

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error for debugging
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => console.log(error.message));

module.exports = app;