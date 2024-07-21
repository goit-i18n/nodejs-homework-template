const express = require('express');
const connectDB = require('./db');
const contactsRouter = require('./routes/api/contacts');

const app = express();

app.use(express.json());
app.use('/api/contacts', contactsRouter);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database', error);
  process.exit(1);
});
