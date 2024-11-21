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
