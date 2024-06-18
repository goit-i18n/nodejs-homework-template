import Joi from "joi";
import Contact from "../models/contacts.js";

const contactSchema = Joi.object({
	name: Joi.string().min(3).required(),
	email: Joi.string().email().required(),
	favorite: Joi.boolean(),
});

const favoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const contactsController = {
	validateContact: (data) => contactSchema.validate(data),
	validateFavorite: (data) => favoriteSchema.validate(data),
	addContact: async (contact) => {
		try {
			const newContact = await Contact.create(contact);
			return newContact;
		} catch (error) {
			throw error;
		}
	},
	updateStatusContact: async (contactId, update) => {
		try {
			const updatedContact = await Contact.findByIdAndUpdate(
				contactId,
				update,
				{ new: true }
			);
			if (!updatedContact) {
				return null;
			}
			return updatedContact;
		} catch (error) {
			throw error;
		}
	},
	// Alte metode (listContacts, getContactsById, updateContact, deleteContact)
	listContacts: async () => {
		console.log("--- List Contacts ---");
		try {
			return Contact.find();
		} catch (error) {
			console.error(error);
		}
	},

	getContactsById: async (contactId) => {
		console.log(`--- List Contacts by id #{contactId} --- `);
		try {
			return Contact.findById(contactId);
		} catch (error) {
			console.error(error);
		}
	},

	deleteContact: async (contactId) => {
		try {
			const deletedContact = await Contact.findByIdAndDelete(contactId);
			return deletedContact;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	updateContact: async (contactId, body) => {
		try {
			const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
				new: true,
			});
			return updatedContact;
		} catch (error) {
			throw error;
		}
	},
};

export default contactsController;
