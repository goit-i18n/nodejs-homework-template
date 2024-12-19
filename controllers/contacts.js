const Contact = require('../models/contact');

const listContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const favoriteBool = favorite === 'true'; 
    const query = favorite !== undefined ? { owner: req.user._id, favorite: favoriteBool } : { owner: req.user._id };

    const contacts = await Contact.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ message: 'Contacts fetched successfully', contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving contact' });
  }
};

const addContact = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const sanitizedPhone = phone.trim();

    const contact = new Contact({ name, phone: sanitizedPhone, owner: req.user._id });
    await contact.save();

    res.status(201).json({ message: 'Contact added successfully', contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding contact' });
  }
};

const removeContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact updated successfully', contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contact' });
  }
};

module.exports = { listContacts, getContactById, addContact, removeContact, updateContact };