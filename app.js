const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./db/db");
const contactsRouter = require("./routes/api/contactsRoutes");
const authRoutes = require("./routes/api/authRoutes");
require("dotenv").config();

connectDB();

const app = express();

app.use(express.json());
app.set("view engine", "ejs");
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());

app.get("/", (req, res) => res.render("home"));
app.use("/users", authRoutes);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
