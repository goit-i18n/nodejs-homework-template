const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contacts = require('./routes/contacts');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/contacts', contacts);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

