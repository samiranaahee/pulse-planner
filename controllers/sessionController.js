const Session = require("../models/Session");

// Log a new session
exports.createSession = async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, user: req.user.id });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all sessions for analytics
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).populate("task");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
