import contacts from "./contacts.json" assert { type: "json" };
import color from "colors";
import { nanoid } from "nanoid";

async function listContacts() {
  return contacts;
}

async function getContactById(contactId) {
  const contact = contacts.find((contact) => contact.id === contactId);
  console.log(contact);
  return contact;
}

async function removeContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    return contacts.splice(index, 1)[0];
  }
  return null;
}

async function addContact(body) {
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(newContact);
  return newContact;
}

async function updateContact(contactId, body) {
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index !== -1) {
    const updatedContact = { ...contacts[index], ...body };
    contacts[index] = updatedContact;
    return updatedContact;
  }
  return null;
}

const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

getContactById("qdggE76Jtbfd9eWJHrssH");

export default contactsService;
