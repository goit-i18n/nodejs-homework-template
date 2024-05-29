const express = require("express");
const router = express.Router();
const contacts = require("../../models/contacts"); // asigură-te că modelul este configurat corect

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400).json({ message: "missing required name field" });
      return;
    }
    const newContact = await contacts.addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
      res.status(400).json({ message: "missing fields" });
      return;
    }
    const updatedContact = await contacts.updateContact(id, {
      name,
      email,
      phone,
    });
    if (!updatedContact) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
