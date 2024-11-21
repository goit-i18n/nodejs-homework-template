const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

/**
 * @param {string} email 
 * @param {string} verificationToken 
 */
async function sendVerificationEmail(email, verificationToken) {
    const verificationLink = `http://localhost:3000/api/auth/verify/${verificationToken}`;
    
    const messageData = {
        from: 'noreply@sandbox38e12caaa31b41609c3ece224eb0b32b.mailgun.org',
        to: email,
        subject: 'Verify your email',
        text: `Click the following link to verify your email: ${verificationLink}`
    };
    
    try {
        await mailgun.messages().send(messageData);
        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

console.log('Verificare Mailgun:', process.env.MAILGUN_API_KEY, process.env.MAILGUN_DOMAIN);

module.exports = { sendVerificationEmail };
