const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

const { connectToDb } = require("./utils/connectToDb");
const authenticate = require("./middlewares/authMiddleware");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

connectToDb()
  .then(() => {
    console.log("Database connection successful");
  }
  )
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

app.use(express.static("public"));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", authenticate, contactsRouter);
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
