const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/compaignController");
const multer = require("multer");
const path = require("path");

// Multer storage setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post("/", upload.single("image"), campaignController.createCampaign);
router.get("/getAll", campaignController.getAllCampaigns);

module.exports = router;
