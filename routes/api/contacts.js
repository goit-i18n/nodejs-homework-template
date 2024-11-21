
const express = require('express');
const { addContact, getContacts } = require('../controllers/contactController');

const router = express.Router();


router.post('/', addContact);


router.get('/', getContacts);

module.exports = router;
