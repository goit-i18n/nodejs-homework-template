const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9\(\)\- \+]{10,20}$/)
    .required(),
});

router.get("/", async (req, res) => {
  try {
    const data = await listContacts();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(400).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal several error" });
  }
});

router.post("/", async (req, res) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, phone } = req.body;

  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const removedContact = await removeContact(req.params.id);
    if (removedContact) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error in DELETE /api/contacts/:id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put('/:contactId', async (req, res) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const updateField = req.body;

  if (Object.keys(updateField).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  }  

  try {
    const updatedContact = await updateContact(req.params.contactId, updateField);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error('Error in PUT /api/contacts/:contactId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
