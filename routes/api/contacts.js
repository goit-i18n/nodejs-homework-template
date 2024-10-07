const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');

async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
}

async function getById(id) {
  const contacts = await listContacts();
  return contacts.find(contact => contact.id === id);
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== id);
  if (contacts.length === filteredContacts.length) {
    return null;
  }
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
  return id;
}

async function updateContact(id, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = { listContacts, getById, addContact, removeContact, updateContact };
