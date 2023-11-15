const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contact = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
    minLength: 2,
  },
  email: { type: String, required: true, minLength: 2 },
  phone: { type: String, required: true, minLength: 2 },
  favorite: { type: Boolean, required: true },
  age: { type: Number, required: true, minLength: 1 },
});

const Contact = mongoose.model("contacts", contact);

module.exports = Contact;
