import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export default async function sendWithSendGrid(email, token) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const host = process.env.HOSTNAME;
  const verificationLink = `${host}/api/auth/verify/${token}`;
  const msg = {
    to: email,
    from: "laescristina2102@gmail.com", // Use the email address or domain you verified above
    subject: "Hello from ContactApp!",
    text: "and easy to do anywhere, even with Node.js",
    html: `Hello from <strong>ContactsApp</strong> <br />
    <a href="${verificationLink}"><br />Click here</a> to validate your account. <br />
    Or insert the link in the URL: ${verificationLink}`,
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