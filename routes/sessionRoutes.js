const express = require("express");
const router = express.Router();
const {
  createSession,
  getSessions,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSession);
router.get("/", protect, getSessions);

module.exports = router;
