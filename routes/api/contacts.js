const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const contactsPath = path.join(__dirname, '../../contacts.json');

// Citire date
const getContacts = () => JSON.parse(fs.readFileSync(contactsPath, 'utf8'));

// Salvare date
const saveContacts = (contacts) => {
    fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
};

// Obține toate contactele
router.get('/', (req, res) => {
    const contacts = getContacts();
    res.json(contacts);
});

// Adaugă un contact
router.post('/', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const contacts = getContacts();
    const newContact = { id: String(Date.now()), name, email, phone };
    contacts.push(newContact);
    saveContacts(contacts);

    res.status(201).json(newContact);
});

// Șterge un contact
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const contacts = getContacts();
    const filteredContacts = contacts.filter((contact) => contact.id !== id);

    if (contacts.length === filteredContacts.length) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    saveContacts(filteredContacts);
    res.status(204).send();
});

// Actualizează un contact
router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const contacts = getContacts();

    const contactIndex = contacts.findIndex((contact) => contact.id === id);
    if (contactIndex === -1) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    contacts[contactIndex] = {...contacts[contactIndex], ...updates };
    saveContacts(contacts);

    res.json(contacts[contactIndex]);
});

module.exports = router;