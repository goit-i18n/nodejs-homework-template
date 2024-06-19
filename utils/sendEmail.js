import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export default async function sendWithSendGrid(email, token) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const verificationLink = `localhost:3000/api/auth/verify/:verificationToken/verify/${token}`;
  const msg = {
    to: email,
    from: "sovar_robert_ionut@yahoo.com",
    subject: "Hello",
    text: "and easy to do anywhere, even with Node.js",
    html: `Hello from <strong>Robert</strong> <br />
    <a href="${verificationLink}/api/auth/verify/:verificationToken/verify/${token}">${verificationLink}}</a> to validate your account. <br />`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent succesfully to ${email}`);
  } catch (error) {
    if (error?.response) {
      console.error(error.response.body);
    } else {
      console.error(error);
    }
  }
}
