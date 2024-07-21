const express = require('express');
const router = express.Router();
const Contact = require('../../models/contacts');

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, phone, favorite } = req.body;
  try {
    const newContact = new Contact({ name, email, phone, favorite });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updates, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:contactId/favorite', async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (favorite === undefined) {
    return res.status(400).json({ message: 'missing field favorite' });
  }
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
