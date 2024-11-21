const express = require('express');
const router = express.Router();
const { listContacts, getById, addContact, removeContact, updateContact } = require('../../models/contacts');

router.get('/', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contact = await getById(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contact' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: 'Error adding contact' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedId = await removeContact(req.params.id);
    if (deletedId) {
      res.json({ message: 'Contact deleted', id: deletedId });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedContact = await updateContact(req.params.id, req.body);
    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating contact' });
  }
});

module.exports = router;
