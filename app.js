const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const userRoutes = require('./routes/api/auth'); // Ruta pentru autentificare
const contactsRouter = require('./routes/api/contacts'); // Ruta pentru contacte

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Rutele pentru utilizatori și contacte
app.use('/api/auth', userRoutes);
app.use('/api/contacts', contactsRouter);

// Răspuns pentru rutele neimplementate
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Middleware pentru tratarea erorilor
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
