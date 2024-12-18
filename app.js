const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use("/users", authRoutes);

module.exports = app;