const { error } = require('console');
const fs = require('fs/promises');
// const { nanoid } = require('nanoid');
const path = require('path');


let nanoid;

const loadNanoid = async () => {
  if (!nanoid) {
    nanoid = (await import('nanoid')).nanoid;
  }
  return nanoid;
};

const dataFile = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(contacts);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('File not found, returning empty array');
      return [];
    } else {
      console.error('Error reading contacts file:', error);
      throw error;
    }
  }
};


const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  try {
    let contacts = await listContacts();
    contacts = contacts.filter(contact => contact.id !== contactId);
    await fs.writeFile(dataFile, JSON.stringify(contacts, null, 2), 'utf-8');
    return contacts;
  } catch (error) {
    console.error('Error writing to contacts file:', error);
  }
};

const addContact = async ( name, email, phone ) => {
  
  try {
    const contacts = await listContacts();
    const nanoid = await loadNanoid();
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(dataFile, JSON.stringify(contacts, null, 2), 'utf-8');
    return newContact;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};



const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact with id=${contactId} not found`);
  }
  contacts[contactIndex] = { ...contacts[contactIndex], ...body };
  await fs.writeFile(dataFile, JSON.stringify(contacts, null, 2), 'utf-8');
  return contacts[contactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
