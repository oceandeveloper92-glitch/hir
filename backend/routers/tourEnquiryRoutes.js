const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryByEnquiryId,
  getWhatsAppMessage
} = require("../controllers/tourEnquiryController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/add", authenticated, createEnquiry);
router.get("/getall", authenticated, getAllEnquiries);
router.get("/get/:id", authenticated, getEnquiryById);
router.put("/update/:id", authenticated, updateEnquiry);
router.delete("/delete/:id", authenticated, deleteEnquiry);
router.get("/get-by-Enquiry-id/:EnquiryId", authenticated, getEnquiryByEnquiryId);
router.get("/send-Enquiry-whatsapp/:EnquiryNo", getWhatsAppMessage);
module.exports = router;
