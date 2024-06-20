import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export default async function sendWithSendGrid(email, token) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const host = process.env.HOSTNAME;
	const verificationLink = `${host}/api/auth/verify/:verificationToken/verify/${token}`;
	const msg = {
		to: email,
		from: "oxana.slivinschi@gmail.com", // Use the email address or domain you verified above
		subject: "Hello from ContactsApp!",
		text: `Verification link: ${host}/api/auth/verify/:verificationToken/verify/${token}`,
		html: `Hello from <strong>ContactsApp</strong> <br />
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
