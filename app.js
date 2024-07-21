const express = require('express');
const connectDB = require('./db');
const contactsRouter = require('./routes/api/contacts');

const app = express();

connectDB();

app.use(express.json());
app.use('/api/contacts', contactsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
