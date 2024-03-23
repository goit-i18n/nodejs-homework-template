const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const sendVerificationEmail = async (email, verificationLink) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = "Please verify your email address";
  sendSmtpEmail.htmlContent = `<html><body><p>Please verify your email address by clicking on the following link: <a href="${verificationLink}">Verify Email</a>.</p></body></html>`;
  sendSmtpEmail.sender = {
    name: "Inicev",
    email: "andreeabartic20@gmail.com",
  };
  sendSmtpEmail.to = [{ email: email }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = sendVerificationEmail;
