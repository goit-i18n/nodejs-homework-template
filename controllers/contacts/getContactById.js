const { Contact } = require("../../models/contact");
const { HttpError } = require("../../helpers");

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const data = await Contact.findById(contactId);
  // const data = await Contact.findOne({ _id: contactId });

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json(data);
};

module.exports = getContactById;
