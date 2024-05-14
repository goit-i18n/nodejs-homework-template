// const fs = require('fs/promises')
const contacts = require("./contacts.json");

const listContacts = async () => {
  return contacts;
};

const getContactById = async (contactId) => {
  return contacts.find((el) => el.id === contactId);
};

const removeContact = async (contactId) => {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  } else {
    contacts.splice(index, 1);
    return 1;
  }
};

const addContact = async (contact) => {
  contacts.push(contact);
};

const updateContact = async (contactId, body) => {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  } else {
    const contact = {
      id: contactId,
      ...body,
    };
    contacts[index] = contact;
    return contact;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
