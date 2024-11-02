import express from "express";
import logger from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import contactsRouter from "./routes/api/contacts.js";
import usersRouter from "./routes/api/users.js";
import auth from "./middlewares/auth.middleware.js";

// Use __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

//  fisiere statice din folderul public
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", auth, contactsRouter);
app.use("/api/users", usersRouter);

app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => console.log("Server is running on port 3000"));

export default app;
