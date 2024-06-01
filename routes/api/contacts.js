import express from "express";
import contactsController from "../../controller/contactsController.js";
import { STATUS_CODES } from "../../utils/constants.js";
import authController from "../../controller/authController.js";
import "../../passport.js";

const router = express.Router();

router.get("/", authController.validateAuth, async (req, res, next) => {
  try {
    const contacts = await contactsController.listContacts();
    console.dir(contacts);
    res
      .status(STATUS_CODES.success)
      .json({ message: "The list was successfully returned", data: contacts });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: `${error}` });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactsController.getContactById(
      req.params.contactId
    );
    console.dir(contact);
    if (!contact) {
      res
        .status(STATUS_CODES.notFound)
        .json({ message: "Contact was not found" });
      return;
    }
    console.dir(contact);
    res
      .status(STATUS_CODES.created)
      .json({ message: "Contact returned successfully", data: contact });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: `${error}` });
  }
});

router.post("/", async (req, res) => {
  try {
    const isValid = checkIsContactValid(req.body);

    if (!isValid) {
      throw new Error("Please fill out all required fields and try again ");
    }

    const contact = req.body;
    const newContact = await contactsController.addContact(contact);
    console.dir(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsController.removeContact(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const isValid = validateContact(req.body);
    if (!isValid) {
      throw new Error("Something went wrong");
    }
    const contact = req.body;
    const updatedContact = await contactsController.updateContact(
      req.params.id,
      contact
    );
    console.dir(updatedContact);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact updated", data: updatedContact });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.patch("/:id/favorite", async (req, res) => {
  try {
    const isValid = checkIsContactValid(req.body);
    if (!isValid) {
      throw new Error("Something went wrong");
    }
    const contact = req.body;
    const updatedContact = await contactsController.updateContact(
      req.params.id,
      contact
    );
    console.dir(updatedContact);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact updated", data: updatedContact });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

function validateContact(contact) {
  return (
    contact?.name &&
    contact?.email &&
    contact?.phone &&
    contact?.favorite !== undefined
  );
}

function checkIsContactValid(contact) {
  if (contact.name && typeof contact.name !== "string") {
    return false;
  }
  if (contact.email && typeof contact.email !== "string") {
    return false;
  }
  if (contact.phone && typeof contact.phone !== "string") {
    return false;
  }
  if (contact.favorite !== undefined && typeof contact.favorite !== "boolean") {
    return false;
  }
  return true;
}
export default router;
