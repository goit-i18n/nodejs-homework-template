const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
}

async function addContact(contact) {
  const contacts = await listContacts();
  const newId =
    contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1; // Generate new ID
  const newContact = { id: newId, ...contact };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  if (contacts.length === filteredContacts.length) {
    return false; 
  }
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
  return true; 
}

async function updateContact(contactId, updates) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (contactIndex === -1) {
    return null; 
  }
  const updatedContact = { ...contacts[contactIndex], ...updates };
  contacts[contactIndex] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
