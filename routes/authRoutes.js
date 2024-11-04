const express = require('express');
const { verifyWebhook } = require('../service/emailService'); 
const router = express.Router();

router.post('/webhook', (req, res) => {
    const { signature } = req.body; 

  
    if (!verifyWebhook(signature)) {
        return res.status(400).json({ message: 'Invalid signature' });
    }


    const eventData = req.body['event-data'];

    
    console.log('Event Data:', eventData);

    res.status(200).json({ message: 'Webhook received and verified' });
});

module.exports = router;
