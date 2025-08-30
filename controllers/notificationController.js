const Notification = require("../models/Notification");

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
