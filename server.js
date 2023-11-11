const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const urlDb = process.env.DB_HOST;

mongoose.set("strictQuery", true);

const connection = mongoose.connect(urlDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    console.log("\nDatabase connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("\nDatabase not running\n", err.toString());
    process.exit(1);
  });

function signalHandler() {
  mongoose.disconnect();
  console.log("\nDatabase disconnected\n");
}
process.on("SIGINT", signalHandler);
