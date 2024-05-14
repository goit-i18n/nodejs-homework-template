const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("./models/contacts");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// GET /api/contacts
app.get("/api/contacts", (req, res) => {
  const contacts = listContacts();
  res.json(contacts);
});

// GET /api/contacts/:id
app.get("/api/contacts/:id", (req, res) => {
  const contact = getContactById(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// POST /api/contacts
app.post("/api/contacts", (req, res) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const contact = addContact(req.body);
  res.status(201).json(contact);
});

// DELETE /api/contacts/:id
app.delete("/api/contacts/:id", (req, res) => {
  const result = removeContact(req.params.id);
  if (result) {
    res.json({ message: "Contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// PUT /api/contacts/:id
app.put("/api/contacts/:id", (req, res) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const contact = updateContact(req.params.id, req.body);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

function validateContact(contact) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });
  return schema.validate(contact);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul asculta la portul ${PORT}`);
});
