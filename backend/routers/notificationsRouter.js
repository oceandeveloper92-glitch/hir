// routers/notifications.js
const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationsController");
const { authenticated } = require("../middleware/authMiddleware");

// Get all notifications
router.get("/getall", authenticated, getAllNotifications);
router.get("/get/:id", authenticated, getNotificationById);
router.put("/update/:id", authenticated, updateNotification);
router.delete("/delete/:id", authenticated, deleteNotification);

module.exports = router;
