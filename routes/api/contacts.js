const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../models/contacts");
const { contactSchema } = require("./validationSchemas");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;

  try {
    const contact = await getContactById(contactId);

    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (err) {
    console.error("Error in getContactById route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { name, email, phone } = value;

    if (!name) {
      res.status(400).json({ message: "Missing required 'name' field" });
      return;
    }

    if (!email) {
      res.status(400).json({ message: "Missing required 'email' field" });
      return;
    }

    if (!phone) {
      res.status(400).json({ message: "Missing required 'phone' field" });
      return;
    }

    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (err) {
    console.error("Error in addContact route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const contactRemoved = await removeContact(contactId);
    if (contactRemoved) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (err) {
    console.error("Error in deleteContact route:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const updatedContactData = contactSchema.validate(req.body);

  try {
    const updatedContact = await updateContact(contactId, updatedContactData);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (err) {
    console.error("Error in updateContact route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
