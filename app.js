const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./db/db");
const contactsRouter = require("./routes/api/contactsRoutes");
const authRoutes = require("./routes/api/authRoutes");

connectDB();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
require("dotenv").config();
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/users", authRoutes);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
