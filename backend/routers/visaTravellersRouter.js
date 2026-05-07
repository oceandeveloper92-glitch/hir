const express = require("express");
const router = express.Router();
const visaTravellersController = require("../controllers/visaTravellersController");

router.get("/", visaTravellersController.getAllVisaTravellers);
router.get("/visa/:visaId", visaTravellersController.getAllVisaByVisaId);
router.post("/create-visa-traveller", visaTravellersController.createVisaTraveller);
router.get("/:id", visaTravellersController.getVisaTravellerById);
router.put("/update-visa-traveller/:id", visaTravellersController.updateVisaTraveller);
router.delete("/delete-visa-traveller/:id", visaTravellersController.deleteVisaTraveller);

module.exports = router;