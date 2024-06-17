// import fs from "fs/promises";
// import { nanoid } from "nanoid";
import contacts from "./contacts.json" assert { type: "json" };
import { v4 as uuidv4 } from "uuid";

const contactsService = {
	listContacts,
	getById,
	removeContact,
	addContact,
	updateContact,
};

async function listContacts() {
	return contacts;
}

async function getById(contactId) {
	return contacts.find((el) => el.id === contactId);
}

async function removeContact(contactId) {
	const index = contacts.findIndex((contact) => contact.id === contactId);
	if (index !== -1) {
		contacts.splice(index, 1);
		return true;
	} else {
		return false;
	}
}

async function addContact(contact) {
	const preparedContact = {
		id: uuidv4(),
		...contact,
	};
	contacts.push(preparedContact);
}
async function updateContact(contactId, body) {
	const index = contacts.findIndex((contact) => contact.id === contactId);
	if (index !== -1) {
		contacts[index] = { ...contacts[index], ...body };
		return contacts[index];
	} else {
		return null;
	}
}

export default contactsService;
