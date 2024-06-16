import color from "colors";
import Contact from "../models/newContacts.js";

async function listContacts() {
  try {
    console.log("Get contacts list".bgBlue);
    return Contact.find();
  } catch (error) {
    console.error(error.bgRed);
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    console.error(error.bgRed);
  }
}

async function addContact(body) {
  const newContact = Contact.create(body);
  return newContact;
}

async function updateContact(contactId, body) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return updatedContact;
  } catch (error) {
    console.error(error.bgRed);
  }
}

async function updateContactStatus(contactId, body) {
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, {
      favorite: body.favorite,
      new: true,
    });
    return contact;
  } catch (error) {
    throw new Error("Ooops something went wrong" + error);
  }
}

const contactsController = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
};

export default contactsController;
