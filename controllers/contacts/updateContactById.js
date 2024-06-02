const { Contact } = require("../../models/contact");
const { HttpError } = require("../../helpers");

const updateContactById = async (req, res) => {
  const { contactId } = req.params;

  const data = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json(data);
};

module.exports = updateContactById;
