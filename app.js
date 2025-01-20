const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs").promises;
const joi = require("joi");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const contactsFilePath = path.join(__dirname, "db", "contacts.json");

const contactSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
});

async function readContacts() {
  const data = await fs.readFile(contactsFilePath, "utf8");
  return JSON.parse(data);
}

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await readContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const contacts = await readContacts();
    const contact = contacts.find((c) => c.id === id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/contacts", async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: `missing required ${error.details[0].context.key} field`,
    });
  }

  try {
    const contacts = await readContacts();
    const newContact = {
      id: String(contacts.length + 1),
      ...req.body,
    };
    contacts.push(newContact);

    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let contacts = await readContacts();
    const contactIndex = contacts.findIndex((c) => c.id === id);
    if (contactIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    contacts.splice(contactIndex, 1);
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "missing fields" });
  }

  try {
    let contacts = await readContacts();
    const contactIndex = contacts.findIndex((c) => c.id === id);
    if (contactIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    const updatedContact = { ...contacts[contactIndex], ...req.body };
    contacts[contactIndex] = updatedContact;

    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
