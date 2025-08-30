const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  focusTime: { type: Number, required: true }, // minutes spent focusing
  breakTime: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
