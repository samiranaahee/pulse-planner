const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  sent: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
