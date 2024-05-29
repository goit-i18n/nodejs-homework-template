const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  return await readContacts();
}

async function getContactById(id) {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === id);
}

async function addContact({ name, email, phone }) {
  const contacts = await readContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function removeContact(id) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const [removedContact] = contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

async function updateContact(id, { name, email, phone }) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], name, email, phone };
  await writeContacts(contacts);
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
