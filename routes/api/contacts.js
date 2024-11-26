const express = require('express');
const router = express.Router();
const contacts = require('../../models/contacts'); // Ensure the path to the model is correct

// Define the GET, POST, DELETE, PUT routes for the contacts API
router.get('/', async (req, res) => {
  try {
    const allContacts = await contacts.listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve contacts', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contact = await contacts.getById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve contact', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newContact = await contacts.addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add contact', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await contacts.removeContact(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedContact = await contacts.updateContact(req.params.id, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact', error });
  }
});

module.exports = router;