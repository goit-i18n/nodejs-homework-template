// routes/api/contacts.js
const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware'); 
const { getContacts, addContact, updateContact, deleteContact } = require('../controllers/contactController'); 

const router = express.Router();

// Rute pentru gestionarea contactelor
router.get('/', authenticate, getContacts); // Obține toate contactele
router.post('/', authenticate, addContact); // Adaugă un contact
router.patch('/:id', authenticate, updateContact); // Actualizează un contact
router.delete('/:id', authenticate, deleteContact); // Șterge un contact

module.exports = router;
