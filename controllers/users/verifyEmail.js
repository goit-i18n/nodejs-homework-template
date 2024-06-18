const { User } = require("../../models/user");
const { HttpError } = require("../../helpers");

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "Something went wrong, please contact support");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Email verification successful",
  });
};

module.exports = verifyEmail;
