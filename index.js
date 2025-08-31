const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/pulse_planner",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Task Schema
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  startTime: String,
  duration: { type: Number, default: 25 }, // in minutes
  type: { type: String, enum: ["work", "break"], default: "work" },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  completed: { type: Boolean, default: false },
  recurring: {
    enabled: { type: Boolean, default: false },
    interval: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    customDays: [Number], // 0-6 for Sunday-Saturday
  },
  createdAt: { type: Date, default: Date.now },
});

// Session Schema for tracking focus/break sessions
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  type: { type: String, enum: ["focus", "break"], required: true },
  duration: { type: Number, required: true }, // actual duration in minutes
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // 'first_timer', '5_pomodoros', 'week_streak', '50_tasks'
  unlockedAt: { type: Date, default: Date.now },
  name: String,
  description: String,
});

// User Stats Schema
const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalPomodoros: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: Date,
  weeklyProgress: [Boolean], // 7 booleans for each day of week
  totalFocusTime: { type: Number, default: 0 }, // in minutes
  totalBreakTime: { type: Number, default: 0 }, // in minutes
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);
const Session = mongoose.model("Session", sessionSchema);
const Achievement = mongoose.model("Achievement", achievementSchema);
const UserStats = mongoose.model("UserStats", userStatsSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback_secret",
    (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user;
      next();
    }
  );
};

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    // Create initial user stats
    const userStats = new UserStats({
      userId: user._id,
      weeklyProgress: [false, false, false, false, false, false, false],
    });
    await userStats.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback_secret"
    );
    res.status(201).json({ token, user: { id: user._id, email, name } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback_secret"
    );
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Task Routes
app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const { date, week } = req.query;
    let query = { userId: req.user.userId };

    if (date) {
      const targetDate = new Date(date);
      query.date = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      };
    }

    const tasks = await Task.find(query).sort({ date: 1, startTime: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.userId,
    });
    await task.save();

    // Update user stats
    await updateUserStats(req.user.userId, "task_created");

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Session Routes
app.post("/api/sessions", authenticateToken, async (req, res) => {
  try {
    const session = new Session({
      ...req.body,
      userId: req.user.userId,
    });
    await session.save();

    // Update user stats
    await updateUserStats(req.user.userId, "session_completed", session);

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/sessions", authenticateToken, async (req, res) => {
  try {
    const { date, week } = req.query;
    let query = { userId: req.user.userId };

    if (date) {
      const targetDate = new Date(date);
      query.startTime = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      };
    }

    const sessions = await Session.find(query).sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Stats Routes
app.get("/api/stats", authenticateToken, async (req, res) => {
  try {
    let userStats = await UserStats.findOne({ userId: req.user.userId });
    if (!userStats) {
      userStats = new UserStats({
        userId: req.user.userId,
        weeklyProgress: [false, false, false, false, false, false, false],
      });
      await userStats.save();
    }
    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/stats", authenticateToken, async (req, res) => {
  try {
    const userStats = await UserStats.findOneAndUpdate(
      { userId: req.user.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Achievements Routes
app.get("/api/achievements", authenticateToken, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.userId });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Helper function to update user stats and check achievements
async function updateUserStats(userId, action, data = null) {
  try {
    let userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      userStats = new UserStats({
        userId,
        weeklyProgress: [false, false, false, false, false, false, false],
      });
    }

    const today = new Date();
    const isNewDay =
      !userStats.lastActiveDate ||
      userStats.lastActiveDate.toDateString() !== today.toDateString();

    switch (action) {
      case "task_created":
        userStats.totalTasks += 1;
        await checkAndAwardAchievement(
          userId,
          "50_tasks",
          userStats.totalTasks >= 50
        );
        break;

      case "session_completed":
        if (data.type === "focus") {
          userStats.totalPomodoros += 1;
          userStats.totalFocusTime += data.duration;
          await checkAndAwardAchievement(
            userId,
            "first_timer",
            userStats.totalPomodoros >= 1
          );
          await checkAndAwardAchievement(
            userId,
            "5_pomodoros",
            userStats.totalPomodoros >= 5
          );
        } else {
          userStats.totalBreakTime += data.duration;
        }

        if (isNewDay) {
          userStats.currentStreak += 1;
          userStats.longestStreak = Math.max(
            userStats.longestStreak,
            userStats.currentStreak
          );

          // Update weekly progress
          const dayOfWeek = today.getDay();
          userStats.weeklyProgress[dayOfWeek] = true;

          await checkAndAwardAchievement(
            userId,
            "week_streak",
            userStats.currentStreak >= 7
          );
        }
        break;
    }

    userStats.lastActiveDate = today;
    userStats.updatedAt = new Date();
    await userStats.save();

    return userStats;
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
}

async function checkAndAwardAchievement(userId, type, condition) {
  if (!condition) return;

  const existingAchievement = await Achievement.findOne({ userId, type });
  if (existingAchievement) return;

  const achievementData = {
    first_timer: {
      name: "First Timer",
      description: "Complete your first Pomodoro session",
    },
    "5_pomodoros": {
      name: "5 Pomodoros",
      description: "Complete 5 Pomodoro sessions",
    },
    week_streak: {
      name: "Week Streak",
      description: "Maintain a 7-day activity streak",
    },
    "50_tasks": { name: "50 Tasks", description: "Create 50 tasks" },
  };

  const achievement = new Achievement({
    userId,
    type,
    ...achievementData[type],
  });

  await achievement.save();
}

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
