const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const { nanoid } = require("nanoid");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (err) {
    throw err;
  }
};
const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);

    const contact = contacts.find((c) => c.id === contactId);

    if (contact) {
      return contact;
    } else {
      throw new Error("Contact not found");
    }
  } catch (err) {
    throw err;
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);

    const indexToRemove = contacts.findIndex(
      (c) => c.id === contactId.toString()
    );

    if (indexToRemove !== -1) {
      contacts.splice(indexToRemove, 1);

      await fs.writeFile(
        contactsPath,
        JSON.stringify(contacts, null, 2),
        "utf8"
      );

      console.log(`Contact with ID ${contactId} removed successfully`);
      return true;
    } else {
      console.log(`Contact with ID ${contactId} not found`);
      return false;
    }
  } catch (err) {
    console.error("Error updating contacts file:", err);
    throw err;
  }
};

const addContact = async (name, email, phone) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    const newContact = {
      id: nanoid(),
      name: name.toString(),
      email,
      phone,
    };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");

    console.log(`Contact with ID ${newContact.id} added successfully`);
  } catch (err) {
    console.error("Error updating contacts file:", err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    const updatedContacts = contacts.map((c) =>
      c.id === contactId.toString() ? { ...c, ...body } : c
    );

    await fs.writeFile(
      contactsPath,
      JSON.stringify(updatedContacts, null, 2),
      "utf8"
    );

    console.log(`Contact with ID ${contactId} updated successfully`);
  } catch (err) {
    console.error("Error updating contacts file:", err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
