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

router.get('/', authMiddleware, listContacts);

router.get('/:id', authMiddleware, getContactById);

router.post('/', authMiddleware, addContact);

router.delete('/:id', authMiddleware, removeContact);

router.put('/:id', authMiddleware, updateContact);

module.exports = router;