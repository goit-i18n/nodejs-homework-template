const express = require("express");
const router = express.Router();
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../../services/contacts");

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get("/:id", async (req, res) => {
  const contact = await getById(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(contact);
});

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

router.delete("/:id", async (req, res) => {
  const isDeleted = await removeContact(req.params.id);
  if (!isDeleted) {
    return res.status(404).json({ message: "Not-found" });
  }
  res.status(200).json({ message: "contact deleted" });
});

router.put("/:id", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  const updatedContact = await updateContact(req.params.id, req.body);
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
});

module.exports = router;
