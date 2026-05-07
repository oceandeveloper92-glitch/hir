// routes/passportRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPassport,
  getAllPassports,
  getPassportById,
  updatePassport,
  deletePassport,
} = require("../controllers/passportController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/add", authenticated, createPassport);
router.get("/getall", authenticated, getAllPassports);
router.get("/get/:id", authenticated, getPassportById);
router.put("/update/:id", authenticated, updatePassport);
router.delete("/delete/:id", authenticated, deletePassport);

module.exports = router;
