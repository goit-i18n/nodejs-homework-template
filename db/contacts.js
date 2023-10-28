const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

//* const listContacts = async () => {};
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.error("Error in reading file listContacts:", error);
    throw error;
  }
}

// *const getContactById = async (contactId) => {};
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id === contactId);
    // const contact = contacts.find((contact) => contact.id === contactId);

    if (!contact) {
      throw new Error(`Contact with id=${contactId} not found`);
    }
    console.table(contact);
    return contact;
  } catch (error) {
    console.error("Error in getting contact by id:", error);
    throw error;
  }
}

// *const removeContact = async (contactId) => {};
async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      console.error(`Contact with id=${contactId} not found`);
      return;
    }
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error("Error in removing contact:", error);
    throw error;
  }
}

//* const addContact = async (body) => {};
async function addContact(body) {
  if (!body.name || !body.email || !body.phone) {
    console.error("Missing required name field");
    return;
  }
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const newContact = { ...body, id: String(Date.now()) };
    contacts.push(newContact);
    console.table(contacts);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("New contact added!");
    return newContact;
  } catch (error) {
    console.error("Error in adding contact:", error);
  }
}

// *const updateContact = async (contactId, body) => {}
async function updateContact(contactId, body) {
  if (!body.name || !body.email || !body.phone) {
    console.error("Missing required name, email or phone field");
    return;
  }
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      console.error(`Contact with id=${contactId} not found`);
      return;
    }
    const updatedContact = { ...contacts[index], ...body };
    contacts[index] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("Contact updated successfully!");
    return updatedContact;
  } catch (error) {
    console.error("Error in updating contact:", error);
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
