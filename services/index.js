const Contact = require("./schemas/ContactSchema");

const getContacts = async () => {
  return Contact.find();
};

const getContactById = async (id) => {
  console.log(id);
  return Contact.findById(id);
};

const createContact = async ({ name, email, phone, favorite = false }) => {
  return Contact.create({ name, email, phone, favorite });
};

const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};

const changeContact = async (id, { name, email, phone }) => {
  return Contact.findByIdAndUpdate(id, { name, email, phone }, { new: true });
};

const updateContact = async (id, favoriteUpdate) => {
  console.log(id, favoriteUpdate);
  console.log(favoriteUpdate);
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: favoriteUpdate },
    { new: true }
  );
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  changeContact,
  updateContact,
};
