const Contact = require("../models/contacts");

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().exec();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  const newContact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  });

  try {
    const createdContact = await newContact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  const filter = { _id: req.params.id };
  const update = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const updatedContact = await Contact.findOneAndUpdate(filter, update);
    res.status(201).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(
      req.params.id
    ).exec();
    if (deletedContact) {
      res.json({
        message: `Contact with name ${deletedContact.name} was deleted succesfully`,
      });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateStatusContact = async (req, res) => {
  const id = req.params.id;
  const newFavoriteStatus = req.body.favorite;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite: newFavoriteStatus },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
