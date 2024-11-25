import express from "express";
import logger from "morgan";
import cors from "cors";

import contactsRouter from './routes/api/contacts.js';

const app = express();

// Setăm formatul pentru logger în funcție de mediul de rulare
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

// Middleware
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Rutele pentru contactele API
app.use('/api/contacts', contactsRouter);

// Middleware pentru rutele nevalide
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Middleware pentru gestionarea erorilor
app.use((err, req, res) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  res.status(status).json({ message });
});

export default app;

