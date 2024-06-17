// contacts.js
import express from 'express';
import ContactsController from '../../controller/contactsController.js';
import { STATUS_CODES } from '../../utils/constants.js';
import passport from "passport";
import "../../passport.js"; // Asigură importul configurărilor pentru Passport
import AuthController from '../../controller/authController.js';

const router = express.Router();

// Middleware-ul AuthController.validateAuth va asigura autentificarea pe toate rutele relevante
// Lista de contacte - GET
router.get('/', AuthController.validateAuth, async (req, res) => {
  try {
    const ownerId = req.user._id; // Asigură-te că acesta este corect setat
    const contacts = await ContactsController.listContacts(ownerId);
    res.status(200).json({ message: 'Lista a fost returnata cu succes', data: contacts });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
}
});

// Căutare contact după ID - GET
router.get('/:id', AuthController.validateAuth, async (req, res) => {
    try {
        const ownerId = req.user._id; // Asigură-te că acesta este corect setat
        const contacts = await ContactsController.listContacts(ownerId);
        res.status(200).json({ message: 'Lista a fost returnata cu succes', data: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Adăugare contact - POST
router.post('/', AuthController.validateAuth, async (req, res) => {
    try {
        const contact = { ...req.body, owner: req.user._id };
        const addedContact = await ContactsController.addContact(contact);
        res.status(STATUS_CODES.created).json({ message: `Contactul ${addedContact.name} a fost adaugat cu succes`, data: addedContact });
    } catch (error) {
        res.status(STATUS_CODES.error).json({ message: error.message });
    }
});

// Ștergerea contactului - DELETE
router.delete('/:id', AuthController.validateAuth, async (req, res) => {
    try {
        const contact = await ContactsController.deleteContact(req.params.id);
        if (!contact) {
            return res.status(STATUS_CODES.notFound).json({ message: 'Contactul nu a fost gasit' });
        }
        res.status(200).json({ message: 'Contactul a fost sters' });
    } catch (error) {
        res.status(STATUS_CODES.error).json({ message: error.message });
    }
});

// Modificarea unui contact - PUT
router.put('/:id', AuthController.validateAuth, async (req, res) => {
    try {
        const updatedContact = await ContactsController.updateContact(req.params.id, req.body);
        if (!updatedContact) {
            return res.status(STATUS_CODES.notFound).json({ message: 'Contactul nu a fost gasit' });
        }
        res.status(STATUS_CODES.success).json({ message: `Contactul ${updatedContact.name} a fost modificat cu succes.`, data: updatedContact });
    } catch (error) {
        res.status(STATUS_CODES.error).json({ message: error.message });
    }
});

// Actualizarea stării "favorite" a unui contact - PATCH
router.patch('/:contactId/favorite', AuthController.validateAuth, async (req, res) => {
    const { favorite } = req.body;
    if (favorite === undefined) {
        return res.status(400).json({ message: "missing field favorite" });
    }
    try {
        const updatedContact = await ContactsController.updateStatusContact(req.params.contactId, favorite);
        if (!updatedContact) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json({ message: 'Favorite status updated successfully', data: updatedContact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
