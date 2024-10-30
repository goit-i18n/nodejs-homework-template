import express from "express";
import logger from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import contactsRouter from "./routes/api/contacts.js";
import usersRouter from "./routes/api/users.js";
import auth from "./middlewares/auth.middleware.js"; // middleware-ul pentru autentificare

// Use __dirname in ES module (pentru a folosi __dirname cu modulele ES)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Formatul logger-ului, în funcție de mediul de dezvoltare
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Setare pentru a servi fișiere statice din folderul 'public/avatars'
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.use(logger(formatsLogger)); // Logger pentru a monitoriza cererile HTTP
app.use(cors()); // Cors pentru securitate
app.use(express.json()); // Middleware pentru parsarea JSON-urilor

// Rute pentru contacte și utilizatori
app.use("/api/contacts", auth, contactsRouter); // Protejat prin middleware-ul de autentificare
app.use("/api/users", usersRouter); // Endpoint pentru utilizatori

// Rutele utilizatorilor și contactelor sunt deja definite mai sus, deci nu trebuie să le duplezi

// Dacă nicio rută nu corespunde, returnăm un răspuns 404
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Gestionarea erorilor
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
