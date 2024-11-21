const Contact = require('../models/contacts');

// Adaugă un contact
const addContact = async (req, res) => {
    const { name, email, phone } = req.body;

    // Verificare simplă
    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required.' });
    }

    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: 'Error creating contact', error });
    }
};

// Obține toate contactele
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
};

// Actualizează un contact
const updateContact = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: 'Error updating contact', error });
    }
};

// Șterge un contact
const deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
};

// Exportă funcțiile
module.exports = { addContact, getContacts, updateContact, deleteContact };
