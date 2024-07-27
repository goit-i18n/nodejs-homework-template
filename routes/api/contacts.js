// routes/api/contacts.js
const express = require("express");
const Joi = require("joi");
const auth = require("../../middleware/auth");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/", auth, async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user._id); // Adjust the model function to filter by user ID
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", auth, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user._id); // Adjust the model function to filter by user ID
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: `missing required ${error.details[0].context.key} field`,
      });
    }
    const newContact = await addContact({ ...req.body, owner: req.user._id }); // Add owner field
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", auth, async (req, res, next) => {
  try {
    const removedContact = await removeContact(
      req.params.contactId,
      req.user._id
    ); // Adjust the model function to filter by user ID
    if (!removedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", auth, async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }
    const updatedContact = await updateContact(
      req.params.contactId,
      req.body,
      req.user._id
    ); // Adjust the model function to filter by user ID
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
