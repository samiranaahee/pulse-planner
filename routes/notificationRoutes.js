const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createNotification);
router.get("/", protect, getNotifications);

module.exports = router;
