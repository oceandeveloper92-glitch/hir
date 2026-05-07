const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { authenticated } = require("../middleware/authMiddleware");

router.get("/getall", authenticated, leadController.getAllLeads); // Get all leads
router.post("/add", authenticated, leadController.createLead); // Create a lead
router.get("/get/:id", authenticated, leadController.getLeadById); // Get a lead by ID
router.put("/update/:id", authenticated, leadController.updateLead); // Update a lead by ID
router.delete("/delete/:id", authenticated, leadController.deleteLead); // Delete a lead by ID
router.put("/reassign/:id", authenticated, leadController.reassignLead); // Reassign a lead
module.exports = router;
