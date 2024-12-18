const express = require('express');
const mongoose = require('mongoose');
const contactsRoutes = require('./routes/api/contacts');  // Path to contacts.js file
const usersRouter = require('./routes/users');  // Path to users.js file

const app = express();
app.use(express.json());  // Middleware to parse JSON request bodies

// Use routes
app.use('/users', usersRouter);
app.use('/contacts', contactsRoutes);  // Mount the contacts routes under /contacts

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((error) => console.log(error.message));