const app = require('./app'); // Import the Express app

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port: ${PORT}`);
});