// routes/quotationRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  copyQuotation,
  getQuotationByEnquiryNo
} = require("../controllers/quotationController");
const { authenticated } = require("../middleware/authMiddleware");

router.get("/getall", authenticated, getAllQuotations);
router.get("/get/:id", authenticated, getQuotationById);
router.post("/add", authenticated, createQuotation);
router.put("/update/:id", authenticated, updateQuotation);
router.delete("/delete/:id", authenticated, deleteQuotation);
router.put('/revision/:id', authenticated, copyQuotation);
router.get('/getByEnquiryNo/:EnquiryNo', authenticated, getQuotationByEnquiryNo);

module.exports = router;
