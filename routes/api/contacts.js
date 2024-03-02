const express = require("express");
const Joi = require("joi");
const router = express.Router();
const contactsController = require("../../models/contactsController.js");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsController.listContacts(req);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = contactsController.getContactById(req);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const newContact = await contactsController.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:contactId", async (req, res, next) => {
  try {
    const removedContact = await contactsController.removeContact(
      req.params.contactId
    );
    if (!removedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
});

router.put("/updateContact/:contactId", async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const updatedContact = await contactsController.updateContact(
      req.params.contactId
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
