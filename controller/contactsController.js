import Contact from "../models/contacts.js";

const contactsController = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};

export default contactsController;

export async function listContacts() {
  try {
    const result = await Contact.find();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getContactById(id) {
  try {
    const contact = await Contact.findById(id);
    return contact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addContact(body) {
  try {
    const newContact = new Contact(body);
    await newContact.save();
    return newContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeContact(contactId) {
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateContact(contactId, body) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return updatedContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateStatusContact(contactId, body) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: body.favorite },
      { new: true }
    );
    return updatedContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
