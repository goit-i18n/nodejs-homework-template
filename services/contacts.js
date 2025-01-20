const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Calea către fișierul contacts.json
const contactsPath = path.join(__dirname, "../db/contacts.json");

// Funcție pentru a lista toate contactele
async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

// Funcție pentru a găsi un contact după ID
async function getById(id) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === id);
}

// Funcție pentru a adăuga un nou contact
async function addContact(contact) {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), ...contact };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

// Funcție pentru a șterge un contact după ID
async function removeContact(id) {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter((contact) => contact.id !== id);
  if (contacts.length === filteredContacts.length) {
    return false; // Contactul nu a fost găsit
  }
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
  return true; // Contact șters cu succes
}

// Funcție pentru a actualiza un contact
async function updateContact(id, updatedFields) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null; // Contactul nu a fost găsit
  }
  contacts[index] = { ...contacts[index], ...updatedFields };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
