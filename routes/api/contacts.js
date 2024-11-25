import express from "express";
import Joi from "joi";
import ContactsService from "../../models/contacts.js";

const router = express.Router();

// Schema Joi pentru POST
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
});  

// Schema Joi pentru PUT (actualizare parțială)
const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
}).min(1);


// GET /api/contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await ContactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contacts/:id
router.get("/:id", async (req, res) => {
  try {
    const contact = await ContactsService.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/contacts
router.post("/", async (req, res) => {
  console.log(req.body); // Depanare
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const newContact = await ContactsService.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/contacts/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedContact = await ContactsService.removeContact(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contacts/:id
router.put("/:id", async (req, res) => {
  console.log(req.body); // Depanare
  const { error } = updateContactSchema.validate(req.body, { allowUnknown: true });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const updatedContact = await ContactsService.updateContact(req.params.id, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;



