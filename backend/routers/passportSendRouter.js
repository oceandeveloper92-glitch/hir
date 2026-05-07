const express = require('express');
const router = express.Router();

const passportSendMailController = require('../controllers/passportSendMailController');

router.post('/send-to-user/new/:passportId', passportSendMailController.sendPassportMailToUser);
router.post('/send-to-user/renew/:passportId', passportSendMailController.sendPassportMailToUserRenewal);
module.exports = router;