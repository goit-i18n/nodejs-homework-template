const { BASE_URL } = process.env;
const { User } = require("../../models/user");
const { HttpError, sendEmail } = require("../../helpers");

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Something went wrong, please contact support");
  }

  if (user.verify) {
    throw HttpError(400, "Email is already verified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email has been successfully sent",
  });
};

module.exports = resendVerifyEmail;
