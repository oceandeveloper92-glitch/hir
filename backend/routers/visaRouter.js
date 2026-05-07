// routes/visaRoutes.js
const express = require("express");
const router = express.Router();
const {
  createVisa,
  getAllVisas,
  getVisaById,
  updateVisa,
  deleteVisa,
  sendEmailToClient,
  sendWhatsappMessageLink
} = require("../controllers/visaController");
const { authenticated } = require("../middleware/authMiddleware");
// CRUD Routes
router.post("/add", authenticated, createVisa);
router.get("/getall", authenticated, getAllVisas);
router.get("/get/:id", authenticated, getVisaById);
router.put("/update/:id", authenticated, updateVisa);
router.delete("/delete/:id", authenticated, deleteVisa);
router.post("/send-to-client/:id", authenticated, sendEmailToClient);
router.get("/send-whatsapp/:id", authenticated, sendWhatsappMessageLink);

module.exports = router;
