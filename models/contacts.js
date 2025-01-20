
import fs from 'node:fs/promises';
import path from 'node:path';
import { dirname } from 'node:path'; 
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { error } from 'node:console';


const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log(`Calea este :" ${__dirname }`);

const contactsPath = `${__dirname}/contacts.json`;
// console.log(contactsPath);


export async function listContacts() {
    try {
      const contents = await readFile(contactsPath, { encoding: "utf8" });
      const contacts = JSON.parse(contents);
      return contacts;

    } catch (error) {
        console.log("There is an error");
        console.error(error);
  }
};



export async function getContactById(contactId) {
    try {
        const contents = await readFile(contactsPath, { encoding: "utf8" });
        const contacts = JSON.parse(contents);

        const contact = contacts.find((contact) => contact.id === String(contactId));

        if (contact) {
          // console.table(contact);
          return contact;
        } else {
            console.log(`Contact with ID ${contactId} not found.`);
        }
    } catch (error) {
        console.log("There is an error");
        console.error(error);
    }
}


export async function addContact(contact) {
  try {
    const contents = await readFile(contactsPath, { encoding: "utf8" });
    const contacts = JSON.parse(contents);
    const newContactId = randomUUID();
      
    const isValid = contact?.name && contact?.email && contact?.phone;
    if (!isValid) {
      throw new Error('The contact does not have all required parametres'); 
    }

    const newContact = {
        id: newContactId,
        ...contact,
    };
  //   console.dir(newContact);
    contacts.push(newContact);
    const parsedContact = JSON.stringify(contacts, null, 2);
    await writeFile(contactsPath, parsedContact);


    console.log('The contact has been ceated successfully !');
    return newContact;
    

  } catch (error) {
      console.log("There is an error");
      console.error(error);
  }
}



export async function updateContact(updatedFields, contactId) {
  try {
    const contents = await readFile(contactsPath, { encoding: "utf8" });
    const contacts = JSON.parse(contents);

    // Găsim contactul după ID
    const contactIndex = contacts.findIndex((contact) => contact.id === contactId);
    if (contactIndex === -1) {
      return null; // Contactul nu există
    }

    // Actualizam doar câmpurile specificate în body
    const updatedContact = {
      ...contacts[contactIndex],
      ...updatedFields,
    };
    contacts[contactIndex] = updatedContact;

    // Salvam modificările în fișier
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact; // Returnează contactul actualizat
  } catch (error) {
    console.error("There is an error", error);
    throw error; // Aruncă eroarea pentru a fi gestionată de apelant
  }
}





export async function removeContact(contactId) {
  try {
    const contents = await readFile(contactsPath, { encoding: "utf8" });
    const contacts = JSON.parse(contents);

    // Găsim contactul care trebuie șters
    const contactIndex = contacts.findIndex((contact) => contact.id === String(contactId));
    if (contactIndex === -1) {
      console.log(`Contact with ID ${contactId} does not exist.`);
      return null; // Returnează null dacă nu există
    }

    // Salvam contactul care urmează să fie șters
    const removedContact = contacts[contactIndex];

    // Filtrăm contactele
    const updatedContacts = contacts.filter((contact) => contact.id !== String(contactId));
    await writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));

    console.log(`The contact with ID ${contactId} has been removed successfully!`);
    console.table(updatedContacts);

    // Returnează contactul șters
    return removedContact;
  } catch (error) {
    console.error("There is an error", error);
    throw error; 
  }
}


const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

export default contactsService;
