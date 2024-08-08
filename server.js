const app = require("./app");
const mongoose = require("mongoose");
require('dotenv').config();


const URL = process.env.MONGODB_URI;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
