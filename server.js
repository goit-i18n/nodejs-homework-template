require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/api/auth'); 
const avatarRoutes = require('./routes/api/auth/avatars');
const contactsRouter = require('./routes/api/contacts'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/auth', avatarRoutes); 
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
