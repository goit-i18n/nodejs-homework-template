const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, '../data/contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
};

const getById = async (id) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === id) || null;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter((contact) => contact.id !== id);
  if (contacts.length === filteredContacts.length) return false;
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
  return true;
};

const updateContact = async (id, updatedFields) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...updatedFields };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = { listContacts, getById, addContact, removeContact, updateContact };