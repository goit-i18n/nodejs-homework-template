import express from "express";
import contactsController from "../../controller/contactsController.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const contacts = await contactsController.listContacts();
		console.dir(contacts);
		res
			.status(200)
			.json({ message: "Lista a fost returnata cu succes", data: contacts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

router.get("/:contactId", async (req, res) => {
	try {
		const contact = await contactsController.getContactsById(
			req.params.contactId
		);
		if (!contact) {
			return res.status(404).json({ message: "Contactul nu a fost gasit" });
		}
		console.dir(contact);
		res
			.status(200)
			.json({ message: "Contactul a fost returnat cu succes", data: contact });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

router.post("/", async (req, res) => {
	try {
		const { error } = contactsController.validateContact(req.body);
		if (error) {
			return res
				.status(400)
				.json({ message: `Validation error: ${error.details[0].message}` });
		}

		const newContact = await contactsController.addContact(req.body);
		res.status(201).json({
			message: `Contactul ${newContact.name} a fost adaugat cu succes`,
			data: newContact,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

router.put("/:contactId", async (req, res) => {
	try {
		const { error } = contactsController.validateContact(req.body);
		if (error) {
			return res
				.status(400)
				.json({ message: `Validation error: ${error.details[0].message}` });
		}

		const contactId = req.params.contactId;
		const updatedContact = await contactsController.updateContact(
			contactId,
			req.body
		);

		if (!updatedContact) {
			return res.status(404).json({ message: "Contactul nu a fost gasit" });
		}

		res.status(200).json({
			message: "Contactul a fost actualizat cu succes",
			data: updatedContact,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

router.delete("/:contactId", async (req, res) => {
	try {
		const contactId = req.params.contactId;
		const contact = await contactsController.getContactsById(contactId);

		if (!contact) {
			return res.status(404).json({ message: "Contactul nu a fost gasit" });
		}

		await contactsController.deleteContact(contactId);

		res
			.status(200)
			.json({ message: `Contactul cu ID ${contactId} a fost sters cu succes` });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

router.patch("/:contactId/favorite", async (req, res) => {
	const { contactId } = req.params;
	const { favorite } = req.body;

	const { error } = contactsController.validateFavorite(req.body);
	if (error) {
		return res
			.status(400)
			.json({ message: `Validation error: ${error.details[0].message}` });
	}

	try {
		const updatedContact = await contactsController.updateStatusContact(
			contactId,
			{ favorite }
		);

		if (!updatedContact) {
			return res.status(404).json({ message: "Not found" });
		}

		res.status(200).json({
			message: "Contactul a fost actualizat cu succes",
			data: updatedContact,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

export default router;
