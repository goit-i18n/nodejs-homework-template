const express = require("express");
const router = express.Router();
const Contact = require("../../models/contacts");
const { updateStatusContact } = require("../../db/db.js");


router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find(); 
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});


router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId); 
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});


router.post("/", async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body); 
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});


router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await Contact.findByIdAndDelete(contactId); 
    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});


router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true }); 
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});


router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const updatedContact = await updateStatusContact(contactId, req.body);
    res.status(200).json(updatedContact);
  } catch (error) {
    if (error.message === "missing field favorite") {
      res.status(400).json({ message: error.message });
    } else if (error.message === "Not found") {
      res.status(404).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

module.exports = router;