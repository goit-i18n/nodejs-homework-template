const fs = require('fs').promises;
const path = require('path');
const {nanoid} = require('nanoid');

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
 const data=await fs.readFile(contactsPath);
 return JSON.parse(data);
};


const getById = async (id) => {
  const contactId = String(id);
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  return result || null;  
}
  

const removeContact = async (id) => { 
  const contactId = String(id);
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts.splice(index, 1); 
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return "Contact deleted successfully";
}

const addContact = async (data) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data
  }
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact; 
}

const updateContact = async (contactId, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id: contactId, ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}


module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
}
