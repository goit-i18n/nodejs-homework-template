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
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9-+()\s]+$/)
    .required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, phone } = req.body;

    const newContact = await addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: `Contact deleted` });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body); // Validare Joi
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { contactId } = req.params;
    const body = req.body;

    if (!Object.keys(body).length) {
      return res.status(400).json({ message: "No data to update" });
    }
    const updatedContact = await updateContact(contactId, body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(updatedContact);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
