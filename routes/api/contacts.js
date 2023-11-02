const express = require("express");
const { listContacts, addContact, getContactById, removeContact, updateContact } = require("../../models/contacts");
const router = express.Router();
const Joi = require("joi");

const contactSchema = Joi.object({
 name: Joi.string().required(),
 email: Joi.string().email().required(),
 phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
  const result = await listContacts();
  res.json(result);
 } catch (error) {
  next(error);
 }
});

router.get("/:contactId", async (req, res, next) => {
 try {
  const { contactId } = req.params;
  const result = await getContactById(contactId);

  if (!result) {
   return res.status(404).json({ message: "Contact not found" });
  }
  res.json(result);
 } catch (error) {
  next(error);
 }
});

router.post("/", async (req, res, next) => {
 try {
  const { error } = contactSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: "Missing required name field" });
  }
  const result = await addContact(req.body);
  return res.status(201).json(result);
 } catch (error) {
  next(error);
 }
});

router.delete("/:contactId", async (req, res, next) => {
 try {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  if (!result) {
   return res.status(404).json({ message: "Contact not found" });
  }
  return res.json({ message: "Contact deleted" });
 } catch (error) {
  next(error);
 }
});

router.put("/:contactId", async (req, res, next) => {
 try {
  const { error } = contactSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: "Missing required name field" });
  }
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
   return res.status(404).json({ message: "Contact not found" });
  }
  res.json(result);
 } catch (error) {
  next(error);
 }
});

module.exports = router;