// controllers/notificationsController.js
const { Notification, Passport } = require("../models");

// GET /notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: Passport }],
    });

    return res.json({
      data: notifications,
      message: "Notifications fetched successfully",
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /notifications/:id
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id, {
      include: [{ model: Passport }],
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({
      data: notification,
      message: "Notification fetched successfully",
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PATCH /notifications/:id
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update(updateData);

    return res.json({
      data: notification,
      message: "Notification updated successfully",
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE /notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    return res.json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
