// GET /api/contacts
app.get("/api/contacts", (req, res) => {
  const contacts = listContacts();
  res.json(contacts);
});

// GET /api/contacts/:id
app.get("/api/contacts/:id", (req, res) => {
  const contact = getById(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// POST /api/contacts
app.post("/api/contacts", (req, res) => {
  // Validăm datele primite în corpul cererii
  const { error } = validateContact(req.body);
  // Dacă există erori de validare, returnăm un răspuns cu status code 400 și mesajul de eroare
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Dacă datele sunt valide, adăugăm contactul și returnăm un răspuns cu status code 201 și contactul adăugat
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
  // Validăm datele primite în corpul cererii
  const { error } = validateContact(req.body);
  // Dacă există erori de validare, returnăm un răspuns cu status code 400 și mesajul de eroare
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Dacă datele sunt valide, actualizăm contactul cu ID-ul specificat
  const contactId = req.params.id;
  const updatedContact = req.body;
  const success = updateContact(contactId, updatedContact);
  // Dacă contactul a fost actualizat, returnăm contactul actualizat și status code 200
  if (success) {
    res.json(success);
  } else {
    // Dacă ID-ul specificat nu există, returnăm un răspuns cu status code 404 și un mesaj
    res.status(404).json({ message: "Contact not found" });
  }
});
