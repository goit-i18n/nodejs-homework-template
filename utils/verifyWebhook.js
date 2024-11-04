
const crypto = require('crypto');

function verifyWebhook(signature, timestamp, token) {
    const hmac = crypto.createHmac('sha256', process.env.MAILGUN_SIGNING_KEY)
                       .update(timestamp + token)
                       .digest('hex');
    return hmac === signature;
}

module.exports = verifyWebhook;
