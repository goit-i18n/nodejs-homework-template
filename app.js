const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const contactsRouter = require("./routes/api/index");

dotenv.config();

const coreOptions = require("./cors");

const app = express();

// const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(morgan("tiny"));
app.use(cors(coreOptions));
app.use(express.json());

app.use("/api", contactsRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Route not found",
    data: "Not found!",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server error!",
  });
});

module.exports = app;
