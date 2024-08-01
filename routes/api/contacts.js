const express = require('express')
const Joi=require("joi");


const router = express.Router()

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,}=require('../../models/contacts')

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(), 
  phone: Joi.string().pattern(/^[0-9]{10}/).required(),
})

router.get('/', async (req, res, next) => {
  try {
    const result = await listContacts();
    res.status(200).json(result);
  }
  catch (error) {
    next(error);
   }  
})

router.get('/:contactId', async (req, res, next) => {
  try {
      const result = await getById(req.params.contactId);
    if (result) {
    res.status(200).json(result);
      } else {
      res.status(404).json({ message: "Not found" });
     
    }
  }
  catch (error) {
    next(error);

  }
})

router.post('/', async (req, res, next) => {
  console.log('POST/api/contacts route')
  try {
    const { error } = addSchema.validate(req.body);
   if (error) {
    return res.status(400).json({ message: error.details[0].message });
    }
     const newContact = await addContact(req.body);

     if(newContact) { 
      res.status(201).json({message:'Contact created!',newContact});
    }
      res.status(400).json({ message: "missing required name field" });
      }  
  catch (error) {
    next(error);    
  } 
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const removedContact = await removeContact(contactId);
    if(removedContact){
      res.status(200).json({message: "Contact deleted", removedContact})
    }else{
      res.status(404).json({message: "Not found"})
    }
  }
  catch (error) {
    next(error);    
  }
})

router.put('/:contactId', async (req, res, next) => {
  const{contactId} = req.params;
  try{
    const {error} = addSchema.validate(req.body);
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
