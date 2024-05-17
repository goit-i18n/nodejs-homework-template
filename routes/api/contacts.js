import express from "express";
import contactsService from "../../models/contacts.js";
import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const router = express.Router();
const STAUS_CODES = {
  succes: 200,
  created: 201,
  deleted: 204,
  notFound: 404,
  badRequest: 400,
  error: 500,
};

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    console.dir(contacts);
    res
      .status(STAUS_CODES.succes)
      .json({ message: "The list was successfully returned", data: contacts });
  } catch (error) {
    res.status(STAUS_CODES.error).json({ message: `${error}` });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.contactId);

    if (!contact) {
      res
        .status(STAUS_CODES.notFound)
        .json({ message: "Contact was not found" });
      return;
    }

    console.dir(contact);

    res
      .status(STAUS_CODES.created)
      .json({ message: "Contact returned successfully", data: contact });
  } catch (error) {
    res.status(STAUS_CODES.error).json({ message: `${error}` });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newContact = await contactsService.addContact(value);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body, {
      presence: "optional",
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedContact = await contactsService.updateContact(
      req.params.id,
      value
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact updated", data: updatedContact });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});
export default router;
