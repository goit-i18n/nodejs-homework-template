const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const contactsPath = path.join(__dirname, '..', 'data', 'contacts.json');

function readContacts() {
    const data = fs.readFileSync(contactsPath, 'utf8');
    return JSON.parse(data);
}

function writeContacts(contacts) {
    fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');
}

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).required()
});

// @ GET /api/contacts
router.get('/', (req, res) => {
    const contacts = readContacts();
    res.status(200).json(contacts);
});

// @ GET /api/contacts/:id
router.get('/:id', (req, res) => {
    const contacts = readContacts();
    const contact = contacts.find(c => c.id === req.params.id);
    if (!contact) {
        return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(contact);
});

// @ POST /api/contacts
router.post('/', (req, res) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, phone } = req.body;
    const newContact = { id: uuidv4(), name, email, phone };
    const contacts = readContacts();
    contacts.push(newContact);
    writeContacts(contacts);

    res.status(201).json(newContact);
});

// @ DELETE /api/contacts/:id
router.delete('/:id', (req, res) => {
    const contacts = readContacts();
    const contactIndex = contacts.findIndex(c => c.id === req.params.id);
    if (contactIndex === -1) {
        return res.status(404).json({ message: 'Not found' });
    }

    contacts.splice(contactIndex, 1);
    writeContacts(contacts);

    res.status(200).json({ message: 'contact deleted' });
});

// @ PUT /api/contacts/:id
router.put('/:id', (req, res) => {
    const { error } = contactSchema.validate(req.body, { allowUnknown: true });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, phone } = req.body;
    const contacts = readContacts();
    const contactIndex = contacts.findIndex(c => c.id === req.params.id);
    if (contactIndex === -1) {
        return res.status(404).json({ message: 'Not found' });
    }

    const updatedContact = { ...contacts[contactIndex], name, email, phone };
    contacts[contactIndex] = updatedContact;
    writeContacts(contacts);

    res.status(200).json(updatedContact);
});

module.exports = router;
