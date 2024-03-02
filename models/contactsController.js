const fs = require("fs");
const path = require("path");
const contactsPath = path.resolve(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = JSON.parse(fs.readFileSync(contactsPath, "utf-8"));
  console.table(contacts);
};

const getContactById = async (contactId) => {
  const contacts = JSON.parse(fs.readFileSync(contactsPath, "utf-8"));
  const contact = contacts.find((c) => c.id === contactId);
  console.log(contact);
};

const removeContact = async (contactId) => {
  let contacts = JSON.parse(fs.readFileSync(contactsPath, "utf-8"));
  contacts = contacts.filter((c) => c.id !== contactId);
  fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
  console.log(`Contact ${contactId} has been removed`);
};

const addContact = async (body) => {
  const contacts = JSON.parse(fs.readFileSync(contactsPath, "utf-8"));
  const newContact = {
    id: contacts.length + 1,
    body,
  };
  contacts.push(newContact);
  fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
  console.log("Contact has been added");
};

const updateContact = async (contactId, body) => {
  const contacts = JSON.parse(fs.readFileSync(contactsPath, "utf-8"));
  const contact = contacts.find((c) => c.id === contactId);
  if (contact === -1) {
    return null;
  }
  contacts[contact] = { ...contacts[contact], ...body };
  fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[contact];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
