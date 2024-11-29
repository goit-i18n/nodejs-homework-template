 // import (promises as fs) from fs;
// eslint-disable-next-line
import { v4 as uuidv4 } from "uuid";
import  Contact from "../models/contacts.js";

const ContactsController = {
  listContacts,
  getContactsById,
  addContact,
  updateStatusContact,
  updateContact,
  deleteContact,
};

async function listContacts() {
  console.log("--- List Contacts --- ");
  try {
    return Contact.find();
  } catch (error) {
    console.error(error);
  }
}

async function getContactsById(id) {
  console.log(`--- List Contacts by id #{id} --- `);
  try {
    return Contact.findById(id);
  } catch (error) {
    console.error(error);
  }
}

async function addContact(contact) {
  return Contact.create(contact);
}



async function deleteContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

async function updateContact(contactId, updatedData) {
  try {
    // Găsește contactul după ID și actualizează complet
    return await Contact.findByIdAndUpdate(contactId, updatedData, { new: true, runValidators: true });
  } catch (error) {
    console.error("Error updating contact:", error);
    return null;
  }
}


async function updateStatusContact(contactId, updateData) {
  try {
    // Găsește contactul după ID și actualizează câmpul `favorite`
    return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
  } catch (error) {
    console.error("Error updating contact status:", error);
    return null;
  }
}



export default ContactsController;