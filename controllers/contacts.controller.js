import express from "express";
import Contact from "../models/contact.model.js"; // Importăm modelul Contact
import auth from "../middlewares/auth.js"; // Middleware de autentificare

const router = express.Router();

// Crearea unui nou contact (ruta POST /contacts)
router.post("/", auth, async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;

    // Crearea unui nou contact cu proprietatea `owner` setată la ID-ul utilizatorului autenticat
    const newContact = new Contact({
      name,
      email,
      phone,
      favorite,
      owner: req.user._id, // ID-ul utilizatorului din middleware-ul de autentificare
    });

    await newContact.save();
    res.status(201).json(newContact); // Returnăm noul contact creat
  } catch (error) {
    next(error); // În caz de eroare, transmitem eroarea mai departe
  }
});

export default router;
