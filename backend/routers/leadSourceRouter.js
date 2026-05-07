const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { authenticated } = require("../middleware/authMiddleware");

router.get("/getall", authenticated, leadController.getAllLeadSources);
router.post("/add", authenticated, leadController.createLeadSource);
router.get("/get/:id", authenticated, leadController.getLeadSourceById);
router.put("/update/:id", authenticated, leadController.updateLeadSource);
router.delete("/delete/:id", authenticated, leadController.deleteLeadSource);

module.exports = router;
