const { User } = require("../../models/user");
const { HttpError } = require("../../helpers");

const updateUserSubscription = async (req, res) => {
  const { _id } = req.user;

  const data = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json(data);
};

module.exports = updateUserSubscription;
