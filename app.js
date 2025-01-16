const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const connectToDb = require("./utils/connectToDb");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

connectToDb();

// TODO Configurăm framework-ul Express pentru a distribui fișierele statice din folderul public:
app.use(express.static("public"));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;