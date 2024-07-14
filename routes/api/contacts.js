const express = require('express')

const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
} = require('../../models/contacts')

const {validateContact, validateContactUpdate} = require('./validate');

router.get('/', async (req, res, next) => {
  try{
    const contacts = await listContacts();
    res.status(200).json(contacts);

  }catch(err){
    next(err);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try{
    const contact = await getContactById(req.params.contactId);
    if(contact){
      res.status(200).json(contact);
    }else{
      res.status(404).json({message: 'Not found'})
    }
  }catch(err){
    next(err);
  }
})

router.post('/', async (req, res, next) => {
  console.log('POST /api/contacts route hit');
  try{
    const {error} = validateContact(req.body)
    if(error){
      return res.status(400).json({ message: error.details[0].message });
    }
    newContact = await addContact(req.body);
    if(newContact){
      res.status(201).json({ message: 'Contact created!', newContact });
    }
  }catch(err){
   next(err); 
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const {contactId}= req.params;
  try{
    const removedContact = await removeContact(contactId);
    if(removedContact){
      res.status(200).json({message: "contact deleted", removedContact})
    }else{
      res.status(404).json({message: "Not found"})
    }
  }catch{
    res.status(500).json({err: "Internal Server Error"})
    next(err);
  }
  
})

router.put('/:contactId', async (req, res, next) => {
  const{contactId} = req.params;
  try{
    const {error} = validateContactUpdate(req.body);
    if(error){
      return res.status(404).json({message: error.details[0].message});
    }
    const contact = await updateContact(contactId, req.body);
    if(contact){
      res.status(200).json(contact);

    }
  }catch(err){
    next(err)
  }
})

module.exports = router
