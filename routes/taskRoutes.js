const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

// Get all tasks for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task for logged-in user
router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = new Task({
      user: req.user._id,
      title,
      description,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
