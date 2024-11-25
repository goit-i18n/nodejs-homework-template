import fs from "fs/promises";
import path from "path";

const contactsPath = path.resolve("models", "contacts.json");

const ContactsService = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(id) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === id);
}

async function addContact(newContact) {
  const contacts = await listContacts();
  const contact = { id: Date.now().toString(), ...newContact };
  contacts.push(contact);
  await saveContactsToFile(contacts);
  return contact;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;
  const [deletedContact] = contacts.splice(index, 1);
  await saveContactsToFile(contacts);
  return deletedContact;
}

async function updateContact(id, updatedData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...updatedData };
  await saveContactsToFile(contacts);
  return contacts[index];
}

async function saveContactsToFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
}

export default ContactsService;




