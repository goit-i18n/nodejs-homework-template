import express from "express";
import User from "../../models/user.model.js";
import auth from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import multer from "multer"; // Importă Multer pentru gestionarea fișierelor
import Jimp from "jimp"; // Importă Jimp pentru redimensionarea imaginilor
import fs from "fs/promises"; // Pentru a manipula fișierele
import path from "path";

const router = express.Router();

// Configurare Multer pentru a salva fișiere temporar în folderul tmp
const tmpDir = path.join(process.cwd(), "tmp");
const avatarsDir = path.join(process.cwd(), "public", "avatars");

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Schema de validare pentru Joi (înregistrare)
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Endpoint pentru înregistrare
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validare date folosind Joi
    const { error } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Verificare email dacă există deja în baza de date
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Creare nou utilizator și generare avatar folosind gravatar
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const user = new User({ email, password, avatarURL });
    await user.save();

    return res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint pentru actualizarea avatarului
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const { path: tempPath, originalname } = req.file;
      const extension = path.extname(originalname);
      const avatarName = `${req.user._id}${extension}`;
      const avatarPath = path.join(process.cwd(), "public/avatars", avatarName);

      // Redimensionare avatar cu Jimp
      const image = await jimp.read(tempPath);
      await image.resize(250, 250).writeAsync(avatarPath);

      // Șterge fișierul temporar
      await fs.unlink(tempPath);

      // Actualizează avatarURL în baza de date
      const avatarURL = `/avatars/${avatarName}`;
      req.user.avatarURL = avatarURL;
      await req.user.save();

      res.status(200).json({ avatarURL });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validare date
    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Găsește utilizatorul în baza de date
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Creează un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Salvează token-ul în utilizator
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logica pentru deconectare
router.get("/logout", auth, async (req, res, next) => {
  try {
    const user = req.user;
    user.token = null;
    await user.save();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

export default router;
