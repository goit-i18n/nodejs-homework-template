const Contact = require("../models/contact.js");

const listContacts = async () => {
  const contacts = await Contact.find({});
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndRemove(contactId);
  console.log(deletedContact, "deleted");
  return deletedContact;
};

const addContact = async (name, email, phone, favorite) => {
  const newContact = await Contact.create({ name, email, phone, favorite });
  console.log(newContact, "added");
  return newContact;
};

const updateContact = async (contactId, update) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, update, {
    new: true,
  });
  console.log(updatedContact);
  return updatedContact;
};

const updateStatusContact = async (contactId, body) => {
  const updatedStatus = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return updatedStatus;
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
