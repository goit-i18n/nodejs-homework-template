const Contact = require('../models/contacts'); 

const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  const result = await Contact.findByIdAndDelete(contactId); 
  return result; 
};

const addContact = async (body) => {
  const newContact = new Contact(body); 
  await newContact.save();
  return newContact;
};

const updateContact = async (contactId, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, { new: true }); 
  return updatedContact; 
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
