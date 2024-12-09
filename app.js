const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactsRouter = require('./routes/api/contacts');

const app = express();

// Middleware-uri
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Rutele API
app.use('/api/contacts', contactsRouter);

// Ruta de bază
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Gestionare erori 404
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Gestionare erori generale
app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

module.exports = app;