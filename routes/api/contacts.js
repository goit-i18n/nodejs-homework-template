const express = require('express');
const Joi = require('joi');
const Contact = require('../../service/contactDatabaseSchema');

const router = express.Router();
const { updateStatusContact } = require('../favorite/contactFav');

router.get('/', async (req, res, next) => {
  try {
    const allContacts = await Contact.find();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contactById = await Contact.findById(req.params.contactId)
    if (contactById) {
      res.status(200).json(contactById);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  console.log('POST /api/contacts route');
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newContact = new Contact(req.body);
    newContact.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const deleteContact = await Contact.findByIdAndDelete(contactId);
    if (deleteContact) {
      res.status(200).json({ message: "Contact deleted...", deleteContact });
    } else {
      res.status(404).json({ message: "Not found..." });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});




router.patch('/:contactId/favorite', async(req, res, next) => {
  const {contactId} = req.params;
  const {favorite} = req.body;
  if(favorite === undefined){
    return res.status(400).json({message: 'missing field favorite'});
  }
  try{
    const favoriteContact =  await updateStatusContact(contactId, {favorite});
    res.status(200).send(favoriteContact);
  }catch(err){
    if(err.message = 'Contact not found'){
      return res.status(404).json({message: 'Not found'});
    }else{
      next(err);
    }
  }
});

module.exports = router;
