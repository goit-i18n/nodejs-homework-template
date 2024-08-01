const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');


const contactsPath = path.join(__dirname, "./contacts.json");

console.log(contactsPath);



const writeContacts=async (contacts)=>{
  try{ 
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
console.log("contacts written!")}
catch(error){
  console.error("Error writing contacts:", error.message)
}}

const readContacts=async ()=>{
  try{
    const data=await fs.readFile(contactsPath, "utf8");
    console.log("Contacts readed!");
    console.table(listContacts());
    return JSON.parse(data);
  }
  catch(error){
    console.error("Error reading contacts:", error.message)
    return[]
  }
}

const listContacts = async () => {
  
 const data=await readContacts();
 console.log("Contacts readed!");
 console.table(data);
 return data;
}
 


const getById = async (contactId) => {
  const contacts = await readContacts();
  const result = contacts.find(item => item.id === contactId);
  console.log(`Contact with ID: ${contactId} `)
  return result || null;  
}
  

const removeContact = async (contactId) => { 
  const contacts = await readContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index > -1) {
    const removedContact=contacts.splice(index, 1);
    if(removeContact.length===contacts.length){
      console.log('Error in deleting contact!')
        return contacts;
  }
   
  await writeContacts(contacts);
  console.log('Contact removed!');
  console.table(contacts);
  return removedContact[0];
}
console.log('Contact not found!');
return null;
}

const addContact = async (body) => {
  console.log('Received data:', body)
  const contacts = await readContacts();
  const newContact = {
    id:crypto.randomUUID(),
    ...body
  }
  contacts.push(newContact);
  console.log(contacts);
  await writeContacts(contacts);
  return newContact; 
}

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index >-1) {
    const updatedContact = {...contacts[index], ...body
  }
  contacts[index] = updatedContact;
  await writeContacts(contacts);
  return updatedContact;
} return null
}


module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
}
