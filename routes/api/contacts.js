const express = require("express");
const Joi = require("joi");
const Contact = require("../../models/contact");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9\(\)\- \+]{10,20}$/)
    .required(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:contactId", async (req, res) => {
  try {
    const removedContact = await Contact.findByIdAndDelete(req.params.contactId);
    if (removedContact) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error in DELETE /api/contacts/:contactId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:contactId", async (req, res) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error in PUT /api/contacts/:contactId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:contactId/favorite", async (req, res) => {
  const { error } = favoriteSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.contactId, { favorite: req.body.favorite }, { new: true });
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error in PATCH /api/contacts/:contactId/favorite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
