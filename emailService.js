import nodemailer from "nodemailer";

// Configure the transporter with Gmail settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your Gmail app password from .env
  },
});

// Function to send verification email
export const sendVerificationEmail = async (userEmail, verificationToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Verify your email",
    text: `Click here to verify: http://localhost:3000/users/verify/${verificationToken}`,
  };
  await transporter.sendMail(mailOptions);
};
