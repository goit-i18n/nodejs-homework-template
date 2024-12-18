const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/api/auth");
const contactsRoutes = require("./routes/api/contacts");
const usersRoutes = require("./routes/api/users");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", authRoutes);  // Authentication routes
app.use("/contacts", contactsRoutes);  // Contacts routes
app.use("/users", usersRoutes);  // Users management routes (if separate)

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error for debugging
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);  // Exit the process if the database connection fails
  }
};

// Start MongoDB connection and server
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});

module.exports = app;