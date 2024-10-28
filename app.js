const express = require('express');
<<<<<<< Updated upstream
const cors = require('cors');
const logger = require('morgan');
const authRouter = require('./routes/api/auth');
const usersRouter = require('./routes/api/users');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

=======
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/users'); 

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());


app.use('/avatars', express.static('public/avatars'));

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter); 

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

>>>>>>> Stashed changes
module.exports = app;
