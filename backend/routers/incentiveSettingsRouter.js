const express = require('express');
const router = express.Router();
const incentiveController = require('../controllers/incentiveSettingsController');
const { authenticated } = require('../middleware/authMiddleware');

const checkAdmin = (req, res, next) => {
    if (req.user && req.user.userType === 'master') {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admin access required" });
    }
};

router.use(authenticated, checkAdmin);

router.get('/', incentiveController.getAllIncentives);
router.get('/:id', incentiveController.getIncentiveById);
router.post('/', incentiveController.createIncentive);
router.put('/:id', incentiveController.updateIncentive);
router.delete('/:id', incentiveController.deleteIncentive);

module.exports = router;