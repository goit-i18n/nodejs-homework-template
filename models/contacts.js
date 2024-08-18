const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');
require("colors");

const pathContacts = path.join(__dirname, 'contacts.json');

const readContacts = async()=> {
  try{
    const data = await fs.readFile(pathContacts, 'utf-8');
    console.log('Contacts successfully read!');
    return JSON.parse(data);
  }catch(err){
    console.error('Error reading contacts:', err.message);
    return [];
  }
}

const writeContactsFile = async (contacts) => {
  try {
    await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 2));
    console.log('Contacts successfully written to file!'.green);
  } catch (err) {
    console.error('Error writing contacts to file!', err.red);
  }
};

const listContacts = async () => {
  const contacts = await readContacts();
  console.log('Contacts successfully returned!'.blue);
  console.table(contacts);
  return contacts;
}

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contactById = contacts.find(contact => contact.id === contactId);
  console.log(`Contact with ID ${contactId} is displayed!`.blue);
  return contactById;
}

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if(index > -1){
    const removedContact = contacts.splice(index, 1);
    await writeContactsFile(contacts);
    console.log(`Contact with ID ${contactId} is removed!`.blue);
    console.table(contacts);
    return removedContact[0];
  }
  console.log('Contact not found for remove!'.red);
  return null;
}


const addContact = async (body) => {
  console.log('Body received:', body);
  const contacts = await readContacts();

  const newContact = {
    id: nanoid(),
    ...body
  };
  contacts.push(newContact);
  console.log('Contacts before writing:', contacts);
  await writeContactsFile(contacts);
  console.log(`Contact with ID ${newContact.id} added successfully!`.blue);
  console.table(contacts);
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index > -1) {
    const updatedContact = {
      ...contacts[index],
      ...body
    };
    contacts[index] = updatedContact;
    await writeContactsFile(contacts);
    console.log(`Contact with ID ${contactId} updated!`.blue);
    return updatedContact;
  }
  console.log('Contact not found for update!'.red);
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
