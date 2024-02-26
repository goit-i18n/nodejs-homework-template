const express = require("express");

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const Joi = require("joi");
const baseContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4,7}$/),
});
const contactSchemaForPost = baseContactSchema.fork(
  ["name", "email", "phone"],
  (field) => field.required()
);
const contactSchemaForPut = baseContactSchema.min(1);

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving contacts",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await getContactById(id);

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Contact not found." });
    }
  } catch (error) {
    console.error("Error retrieving contact:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res, next) => {
  const { error, value } = contactSchemaForPost.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details,
    });
  }

  try {
    const newContact = await addContact(value);

    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error adding contact:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await removeContact(id);

    if (result.error) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  const { error, value } = contactSchemaForPut.validate(body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });
  }

  try {
    const updatedContact = await updateContact(id, value);

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
