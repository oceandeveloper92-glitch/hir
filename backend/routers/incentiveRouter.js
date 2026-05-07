const express = require('express');
const router = express.Router();
const incentiveController = require('../controllers/incentiveController');
const { authenticated } = require('../middleware/authMiddleware');

router.get('/get-all-incentives', authenticated, incentiveController.getAllIncentives);
router.post('/get-visa-calculation', incentiveController.getCalculationOfVisaIncentive);
router.post('/create-incentive', incentiveController.createIncentive);
router.put('/update-incentive/:id', incentiveController.updateIncentive);
router.delete('/delete-incentive/:id', incentiveController.deleteIncentive);
router.post('/get-air-ticket-calculation', incentiveController.getCalculationOfAirTicketIncentive);

module.exports = router;