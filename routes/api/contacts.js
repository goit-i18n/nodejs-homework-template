const express = require('express');
const { 
  listContacts, 
  getContactById, 
  addContact, 
  removeContact, 
  updateContact 
} = require('../controllers/contacts');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Route to get all contacts
router.get('/', authMiddleware, listContacts);

// Route to get a single contact by ID
router.get('/:id', authMiddleware, getContactById);

// Route to add a new contact
router.post('/', authMiddleware, addContact);

// Route to delete a contact by ID
router.delete('/:id', authMiddleware, removeContact);

// Route to update a contact by ID
router.put('/:id', authMiddleware, updateContact);

module.exports = router;