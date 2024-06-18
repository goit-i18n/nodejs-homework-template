const { Contact } = require("../../models/contact");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 20, favorite } = req.query;

  const skip = (page - 1) * limit;

  const searchConditions = { owner };
  if (favorite !== undefined) {
    searchConditions.favorite = favorite;
  }

  const data = await Contact.find(searchConditions, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");

  res.json(data);
};

module.exports = getAllContacts;
