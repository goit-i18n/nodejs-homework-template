const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Joi = require('joi');
const { listContacts, getById, addContact, removeContact, updateContact } = require('./routes/api/contacts');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
});

app.get('/api/contacts', async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

app.get('/api/contacts/:id', async (req, res) => {
  const contact = await getById(req.params.id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

app.delete('/api/contacts/:id', async (req, res) => {
  const result = await removeContact(req.params.id);
  if (result) {
    res.status(200).json({ message: 'contact deleted' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const { error } = contactSchema.validate(req.body, { allowUnknown: true });
  if (error) {
    return res.status(400).json({ message: 'missing fields' });
  }
  const updatedContact = await updateContact(req.params.id, req.body);
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
module.exports = app;