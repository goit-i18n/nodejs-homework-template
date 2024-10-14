<<<<<<< Updated upstream
const app = require("./app");

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
=======
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const contactsRouter = require('./routes/api/contacts');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://adyyy1234:tt0cKZob1h27FQQS@cluster0.rm0m5.mongodb.net/db-contacts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connection successful'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use('/api/contacts', contactsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
>>>>>>> Stashed changes
});
