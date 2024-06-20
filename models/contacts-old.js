import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertirea URL-ului modulului curent la calea fișierului
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, 'contacts.json');
let contacts = null;

async function loadContacts() {
  if (!contacts) {
    const data = await fs.readFile(contactsPath, 'utf-8');
    contacts = JSON.parse(data);
  }
}

const ContactService = {
  listContacts: async () => {
    await loadContacts();
    return contacts;
  },
  getContactById: async (contactId) => {
    await loadContacts();
    return contacts.find(contact => contact.id === contactId);
  },
  addContact: async (contact) => {
    await loadContacts();
    const newContact = { id: uuidv4(), ...contact };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    return newContact;
  },
  removeContact: async (contactId) => {
    await loadContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) throw new Error('Contact not found');
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
  },
  updateContact: async (contactId, updatedContact) => {
    await loadContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) throw new Error('Contact not found');
    contacts[index] = { ...contacts[index], ...updatedContact };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    return contacts[index];
  },
};

export default ContactService;
