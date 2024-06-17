
import express from 'express';
import ContactsController from '../../controller/contactsController.js';
import { STATUS_CODES } from '../../utils/constants.js';
import passport from "passport";
import "../../passport.js";
import AuthController from '../../controller/authController.js';

const router = express.Router();


// Ruta pentru redarea listei de contacte - GET
router.get(
  '/', 
  AuthController.validateAuth, 
  async (req, res) => {
  try {
    const contacts = await ContactsController.listContacts();
           
    res
    .status(STATUS_CODES.success)
    .json({ message: 'Lista a fost returnata cu succes', data: contacts });
  } catch (error) {
    respondWithError(res, error);
  }
});

function respondWithError(res, error) {
  console.error(error);
  res.status(STATUS_CODES.error).json({ message: error.message });
}

// Ruta pentru căutare contact după ID - GET
router.get('/:id', async (req, res) => {
  try {
    const contact = await ContactsController.getContactsById(req.params.id);
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
  try {
    const isValid = checkIsContactValid(req.body);
    if (!isValid) {
      throw new Error("Contactul introdus nu are toate campurile necesare.");
    }

    const contact = req.body;
    await ContactsController.addContact(contact);
    res
    .status(STATUS_CODES.created)
    .json({ message: `Contactul ${contact.name} a fost adaugat cu succes`, data: contact });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: error.message });
  }
});

// Ruta pentru ștergerea contactului - DELETE
router.delete('/:id', async (req, res) => {
  try {
    await ContactsController.deleteContact(req.params.id);
    res
    .status(200)
    .json({ message: 'Contactul a fost sters' });
  } catch (error) {
    res.status(STATUS_CODES.error).json({ message: 'Contactul nu a fost gasit' });
  }
});

// Ruta pentru modificarea unui contact - PUT
router.put('/:id', async (req, res) => {
  try {
    const isValid = checkIsContactValid(req.body);
    if (!isValid) {
      throw new Error("Contactul introdus nu este valid.");
    }

    const updatedContact = await ContactsController.updateContact(req.params.id, req.body);
    if (!updatedContact) {
      return res.status(STATUS_CODES.notFound).json({ message: 'Contactul nu a fost gasit' });
    }
    res.status(STATUS_CODES.success).json({ message: `Contactul ${updatedContact.name} a fost modificat cu succes.`, data: updatedContact });
  } catch (error) {
    res.status(STATUS_CODES.notFound).json({ message: 'Contactul nu a fost gasit' });
  }
});

// Ruta pentru actualizarea stării contactului - PATCH
router.patch('/:contactId/favorite', async (req, res) => {
  const { favorite } = req.body;
  if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
  }

  try {
      const updatedContact = await ContactsController.updateStatusContact(req.params.contactId, favorite);
      res
      .status(200)
      .json({ message: 'Favorite status updated successfully', data: updatedContact });
  } catch (error) {
      if (error.message === 'Contact not found') {
          res.status(404).json({ message: 'Not found' });
      } else {
          res.status(500).json({ message: error.message });
      }
  }
});

function checkIsContactValid(contact) {
  if (!contact?.name || !contact?.email || !contact?.phone) {
    return false;
  }

  return true;
}
export default router;
