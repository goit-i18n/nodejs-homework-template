import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Load contacts data
const contactsData = JSON.parse(
  fs.readFileSync("./models/contacts.json", "utf-8")
);

const contacts = [...contactsData];

const ContactsService = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};

async function listContacts() {
  return contacts;
}

async function getContactById(id) {
  return contacts.find((el) => el.id === id);
}

async function addContact(contact) {
  const newContact = {
    id: uuidv4(),
    ...contact,
  };

  contacts.push(newContact);
  return newContact;
}

async function updateContact(updatedContact, contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    throw new Error("Contactul nu a fost găsit.");
  }

  contacts[index] = { ...updatedContact, id: contactId };
  return contacts[index];
}

async function removeContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    throw new Error("Contactul nu a fost găsit.");
  }

  const [removedContact] = contacts.splice(index, 1);
  return removedContact;
}

export default ContactsService;
