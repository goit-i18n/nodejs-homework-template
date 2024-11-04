import express from "express";
import logger from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import contactsRouter from "./routes/api/contacts.js";
import usersRouter from "./routes/api/users.js";
import auth from "./middlewares/auth.middleware.js"; // Middleware for authentication

// Use __dirname in ES module (for compatibility with ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set logger format based on environment
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Serve static files from the 'public/avatars' folder
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.use(logger(formatsLogger)); // HTTP request logger
app.use(cors()); // Enable CORS for security
app.use(express.json()); // Middleware to parse JSON payloads

// Routes for contacts and users
app.use("/api/contacts", auth, contactsRouter); // Protected with authentication middleware
app.use("/api/users", usersRouter); // Endpoint for user-related operations

// Handle 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
