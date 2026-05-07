const express = require("express");
const router = express.Router();
const airTicketController = require("../controllers/airTicketController");

router.get("/", airTicketController.getAllAirTickets);
router.post("/", airTicketController.createAirTicket);
router.get("/:id", airTicketController.getAirTicketById);
router.put("/:id", airTicketController.updateAirTicket);
router.delete("/:id", airTicketController.deleteAirTicket);
router.post("/refund", airTicketController.createRefundTicket);

module.exports = router;
