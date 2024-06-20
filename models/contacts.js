import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	favorite: {
		type: Boolean,
		default: false,
	},
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
