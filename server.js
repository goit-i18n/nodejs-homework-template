require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose'); 
const path = require('path'); 
const authRouter = require('./routes/api/auth');
const usersRouter = require('./routes/api/users');

const app = express();



mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));



app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public')); 


app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);


app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));


app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactsRouter = require('./routes/api/contacts'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://adyyy1234:tt0cKZob1h27FQQS@cluster0.jbj4r.mongodb.net/contactsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.use('/api/contacts', contactsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});