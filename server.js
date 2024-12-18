const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users'); // Adjust the path if necessary
const contactsRouter = require('./routes/api/contacts'); // Adjust the path if necessary
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Routes
app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);

// Handle undefined routes (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler (500)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1); // Exit the process if database connection fails
  }
};

// Initialize database connection and start the server
connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((err) => console.error(err));

module.exports = app; // Export the app for testing or future use