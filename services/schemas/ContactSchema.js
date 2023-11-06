const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contact = new Schema({
  name: { type: String, require: [true, "Set name for contact"], minLenght: 2 },
  email: { type: String, minLenght: 4 },
  phone: { type: String, minLenght: 4 },
  favorite: { type: Boolean },
  age: { type: Number, minLenght: 1 },
});

const Contact = mongoose.model("contacts", contact);

module.exports = Contact;
