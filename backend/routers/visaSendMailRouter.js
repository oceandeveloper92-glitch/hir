const express = require('express');
const router = express.Router();

const visaSendMailController = require('../controllers/visaSendMailController');

router.post('/send-to-user/:visaId', visaSendMailController.sendVisaMailToUser);

module.exports = router;