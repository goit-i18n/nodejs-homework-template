
import Contact from '../models/contacts.js';

const ContactsController = {
    listContacts,
    getContactsById,
    addContact,
    deleteContact,
    updateContact,
    updateStatusContact
}

async function listContacts(ownerId) {
    console.log('---List contacts ---')
    try {
        return Contact.find({ owner: ownerId });
    } catch (error) {
        console.error('Error listing contacts:', error);
        throw error;
    }
    
}

async function getContactsById(id) {
    console.log('---List contacts by id #{id} ---')
    try {
        
        return Contact.findById(id);
        
    } catch (error) {
        console.error(error);
    }
    
}

async function addContact(contact) {
    return Contact.create(contact);
    
}

async function deleteContact(contactId) {
    return Contact.findByIdAndDelete(contactId);
    
}

async function updateContact(contactId, contactData) {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
        return updatedContact;
    } catch (error) {
        console.error('Failed to update contact: ', error);
        throw error;
    }
}

async function updateStatusContact(contactId, favoriteStatus) {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, { favorite: favoriteStatus }, { new: true });
        if (!updatedContact) {
            throw new Error('Contact not found');
        }
        return updatedContact;
    } catch (error) {
        console.error('Failed to update favorite status: ', error);
        throw error;
    }
}

export default ContactsController;