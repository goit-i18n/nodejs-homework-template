import express from "express";
import ContactsController from "../../controller/contactsController.js";

const router = express.Router();
const STATUS_CODES = {
  success: 200,
  deleted: 204,
  error: 500,
};

/* GET localhost:3000/api/contacts */
router.get("/", async (req, res, next) => {
  try {
    const contacts = await ContactsController.listContacts();

    res
      .status(STATUS_CODES.success)
      .json({ message: "Lista a fost returnata cu succes", data: contacts });
  } catch (error) {
    respondWithError(res, error);
  }
});

/* GET localhost:3000/api/contacts/:id */
router.get("/:id", async (req, res, next) => {
  try {
    const contact = await ContactsController.getContactsById(req.params.id);
    if (!contact) {
      throw new Error("Contactul nu a fost gasit");
    }
    res
      .status(STATUS_CODES.success)
      .json({ message: "Contactul a fost returnat cu succes", data: contact});
  } catch (error) {
    respondWithError(res, error);
  }
});

/* POST localhost:3000/api/contacts/ */
router.post("/", async (req, res, next) => {
  try {
    const isValid = checkIsContactValid(req.body);
    if (!isValid) {
      throw new Error("Contactul introdus nu are toate campurile necesare.");
    }

    const contact = req.body;
    await ContactsController.addContact(contact);
    res
      .status(201)
      .json({ message: `Contactul ${contact.name} a fost adaugat cu succes.` });
  } catch (error) {
    respondWithError(res, error);
  }
});

/* DELETE localhost:3000/api/contacts/:id */
router.delete("/:id", async (req, res, next) => {
  try {
    await ContactsController.deleteContact(req.params.id);

    res
      .status(STATUS_CODES.deleted)
      .json({ message: "Contactul a fost sters cu succes" });
  } catch (error) {
    respondWithError(res, error);
  }
});

/* PUT localhost:3000/api/contacts/:id */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, favorite } = req.body;

    // Verifică dacă toate câmpurile necesare există
    if (!name || !email || !phone || favorite === undefined) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const updatedContact = await ContactsController.updateContact(id, { name, email, phone, favorite });
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", data: updatedContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


/* PATCH localhost:3000/api/contacts/:id */
router.patch("/:id/favorite", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const updatedContact = await ContactsController.updateStatusContact(id, { favorite });
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", data: updatedContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



export default router;

function checkIsContactValid(contact) {
  if (!contact?.name || !contact?.email || !contact?.phone) {
    return false;
  }

  return true;
}

function respondWithError(res, error) {
  console.error(error);
  res.status(STATUS_CODES.error).json({ message: `${error}` });
}