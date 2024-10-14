<<<<<<< Updated upstream
const express = require('express')

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
=======
const express = require('express');
const router = express.Router();
const { listContacts, getById, addContact, removeContact, updateContact } = require('../../models/contacts');

router.get('/', async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
});

router.get('/:id', async (req, res) => {
  const contact = await getById(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

router.post('/', async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

router.delete('/:id', async (req, res) => {
  const deletedId = await removeContact(req.params.id);
  if (deletedId) {
    res.json({ message: 'Contact deleted', id: deletedId });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

router.put('/:id', async (req, res) => {
  const updatedContact = await updateContact(req.params.id, req.body);
  if (updatedContact) {
    res.json(updatedContact);
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

module.exports = router;
>>>>>>> Stashed changes
