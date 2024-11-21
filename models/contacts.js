const fs = require("fs/promises"); // Importă modulul fs pentru lucrul cu fișierele

let contacts = []; // Inițializează array-ul contacts cu un array gol

// Funcția pentru citirea datelor din fișierul contacts.json
const loadContacts = async () => {
  try {
    const data = await fs.readFile("models/contacts.json"); // Citește conținutul fișierului
    contacts = JSON.parse(data); // Parsează conținutul JSON într-un array
  } catch (error) {
    // În caz de eroare la citire, afișează un mesaj de eroare
    console.error("Error loading contacts:", error);
  }
};

// Funcția pentru scrierea datelor în fișierul contacts.json
const saveContacts = async () => {
  try {
    await fs.writeFile(
      "models/contacts.json",
      JSON.stringify(contacts, null, 2)
    ); // Scrie array-ul contacts în fișierul JSON
    console.log("Contacts saved successfully.");
  } catch (error) {
    // În caz de eroare la scriere, afișează un mesaj de eroare
    console.error("Error saving contacts:", error);
  }
};

// Apelează funcția de încărcare a contactelor la pornirea aplicației
loadContacts();

// Restul funcțiilor CRUD rămân la fel ca în implementarea anterioară...

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
    await saveContacts(); // După ștergere, salvează noile date în fișier
    return 1;
  }
};

const addContact = async (contact) => {
  contacts.push(contact);
  await saveContacts(); // După adăugare, salvează noile date în fișier
};

const updateContact = async (contactId, body) => {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  } else {
    const updatedContact = {
      id: contactId,
      ...body,
    };
    contacts[index] = updatedContact;
    await saveContacts(); // După actualizare, salvează noile date în fișier
    return updatedContact;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
