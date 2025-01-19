const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = process.env;

if (!SENDGRID_API_KEY) {
  throw new Error(
    "SENDGRID_API_KEY is not defined in the environment variables."
  );
}

sgMail.setApiKey(SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: "silvia198070@gmail.com",
    subject: "Verification Email",
    text: `Hello! Please verify your email by clicking the link: http://localhost:3000/verify/${verificationToken}`,
    html: `<p>Hello!</p><p>Please verify your email by clicking the link: <a href="http://localhost:3000/verify/${verificationToken}">http://localhost:3000/verify/${verificationToken}</a></p>`,
  };
  try {
    await sgMail.send(msg);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
