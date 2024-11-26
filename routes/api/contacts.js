const express = require('express');
const Joi = require('joi');
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error in GET /api/contacts:', error.message);
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const contact = await getById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: `missing required ${error.details[0].context.key} field` });
    }
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const success = await removeContact(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/contacts/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const updatedContact = await updateContact(req.params.id, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;