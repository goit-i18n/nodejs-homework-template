import express from 'express';
import ContactService from '../../models/contacts.js';
import Joi from 'joi';  // Adăugarea importului Joi

const router = express.Router();
const STATUS_CODES = {
  success: 200,  
  created: 201,  
  noContent: 204,
  notFound: 404, 
  error: 500,
}

// Definirea schemei Joi pentru validarea datelor contactului
const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(3).required(),
});

// Funcție care validează un contact folosind schema definită
function validateContact(contact) {
  const { error } = contactSchema.validate(contact);
  return error ? error.details[0].message : null;
}

// Ruta pentru redarea listei de contacte - GET
router.get('/', async (req, res) => {
  try {
    const contacts = await ContactService.listContacts();
    res.status(STATUS_CODES.success).json({ message: 'Lista a fost returnata cu succes', data: contacts });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: error.message });
  }
});

// Ruta pentru căutare contact după ID - GET
router.get('/:id', async (req, res) => {
  try {
    const contact = await ContactService.getContactById(req.params.id);
    if (!contact) {
      return res.status(STATUS_CODES.notFound).json({ message: 'Contactul nu a fost gasit' });
    }
    res.status(STATUS_CODES.success).json({ message: 'Contactul a fost returnat cu succes', data: contact });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: error.message });
  }
});

// Ruta pentru adăugare contact - POST
router.post('/', async (req, res) => {
  const errorMessage = validateContact(req.body);
  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }
  try {
    const contact = await ContactService.addContact(req.body);
    res.status(STATUS_CODES.created).json({ message: `Contactul ${contact.name} a fost adaugat cu succes`, data: contact });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: error.message });
  }
});

// Ruta pentru ștergerea contactului - DELETE
router.delete('/:id', async (req, res) => {
  try {
    await ContactService.removeContact(req.params.id);
    res.status(200).json({ message: 'Contactul a fost sters' });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: 'Contactul nu a fost gasit' });
  }
});

// Ruta pentru modificarea unui contact - PUT
router.put('/:id', async (req, res) => {
  const errorMessage = validateContact(req.body);
  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }
  try {
    const updatedContact = await ContactService.updateContact(req.params.id, req.body);
    if (!updatedContact) {
      return res.status(STATUS_CODES.notFound).json({ message: 'Contactul nu a fost gasit' });
    }
    res.status(STATUS_CODES.success).json({ message: `Contactul ${updatedContact.name} a fost modificat cu succes.`, data: updatedContact });
  } catch (error) {
    res.status(STATUS_CODES.notFound).json({ message: 'Contactul nu a fost gasit' });
  }
});

export default router;
