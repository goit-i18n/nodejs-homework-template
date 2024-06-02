const { Contact } = require("../../models/contact");
const { HttpError } = require("../../helpers");

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const data = await Contact.findByIdAndRemove(contactId);
  // const data = await Contact.findByIdAndDelete(contactId);

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json(data);
  // res.status(204).send();
};

module.exports = deleteContact;
