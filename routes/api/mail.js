const express = require('express');
const mailgun = require('mailgun-js');
const router = express.Router();
const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;

const mg = mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });

router.post('/send', (req, res) => {
    const { to, subject, text } = req.body;

    const data = {
        from: 'Excited User <secaforce@gmail.com>',
        to,
        subject,
        text,
    };
    
    mg.messages().send(data, (error, body) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).send(body);
    });
});

module.exports = router;
