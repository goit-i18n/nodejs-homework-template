const express = require('express');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);

    if (contact) res.status(200).json(contact);
    else res.status(404).json({message: 'Not found'});
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {name, email, phone} = req.body;

    if (!name || !email || !phone)
      return res.status(400).json({message: 'missing required name field'});

    const newContact = await addContact({name, email, phone});

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId);
    if (contact) res.status(200).json({message: 'contact deleted'});
    else res.status(404).json({message: 'Not found'});
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const {name, email, phone} = req.body;

    if (!name && !email && !phone) return res.status(400).json({message: 'missing fields'});

    const updatedContact = await updateContact(req.params.contactId, req.body);

    if (updatedContact) res.status(200).json(updatedContact);
    else res.status(404).json({message: 'Not found'});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
