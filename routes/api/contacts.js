import express from "express";
import contactsService from "../../models/contacts.js";
import Joi from "joi";

const router = express.Router();

const contactSchema = Joi.object({
	name: Joi.string().min(1).required(),
	email: Joi.string().email().required(),
	phone: Joi.string()
		.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
		.required(),
});

router.get("/", async (req, res, next) => {
	try {
		const contacts = await contactsService.listContacts();
		console.dir(contacts);
		res
			.status(200)
			.json({ message: "Lista a fost returnata cu succes", data: contacts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

router.get("/:contactId", async (req, res, next) => {
	try {
		const contact = await contactsService.getById(req.params.contactId);
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

router.post("/", async (req, res, next) => {
	try {
		const { error } = contactSchema.validate(req.body);
		if (error) {
			return res
				.status(400)
				.json({ message: `Validation error: ${error.details[0].message}` });
		}

		await contactsService.addContact(req.body);
		res.status(201).json({
			message: `Contactul ${req.body.name} a fost adaugat cu succes`,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

router.put("/:contactId", async (req, res, next) => {
	try {
		const { error } = contactSchema.validate(req.body);
		if (error) {
			return res
				.status(400)
				.json({ message: `Validation error: ${error.details[0].message}` });
		}

		const contactId = req.params.contactId;
		const updatedContact = await contactsService.updateContact(
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

router.delete("/:contactId", async (req, res, next) => {
	try {
		const contactId = req.params.contactId;
		const contact = await contactsService.getContactById(contactId);

		if (!contact) {
			return res.status(404).json({ message: "Contactul nu a fost gasit" });
		}

		await contactsService.removeContact(contactId);

		res
			.status(200)
			.json({ message: `Contactul cu ID ${contactId} a fost sters cu succes` });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

export default router;
