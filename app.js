const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/contacts'); // Verifică această linie

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

