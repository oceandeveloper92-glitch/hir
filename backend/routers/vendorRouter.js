const express = require("express");
const router = express.Router();

const {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");

// Create a new Vendor
router.post("/add", createVendor);

// Get all Vendors
router.get("/getall", getAllVendors);

// Get a Vendor by ID
router.get("/get/:id", getVendorById);

// Update a Vendor
router.put("/update/:id", updateVendor);

// Delete a Vendor
router.delete("/delete/:id", deleteVendor);

module.exports = router;
