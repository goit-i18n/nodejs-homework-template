const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://localhost:27017/contacts"; // Conexiunea MongoDB

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });