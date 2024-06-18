const { Contact } = require("../../models/contact");

const addContact = async (req, res) => {
  const { _id: owner } = req.user;

  const data = await Contact.create({ ...req.body, owner });

  res.status(201).json(data);
};

module.exports = addContact;
