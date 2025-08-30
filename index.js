const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/pulseplannerDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// =====================
// Schemas
// =====================

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: Boolean,
  priority: String,
  userId: mongoose.Schema.Types.ObjectId,
});
const Task = mongoose.model("Task", taskSchema);

// Pomodoro schema
const pomodoroSchema = new mongoose.Schema({
  taskId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  startTime: Date,
  endTime: Date,
});
const Pomodoro = mongoose.model("Pomodoro", pomodoroSchema);

// =====================
// Routes
// =====================

// Root
app.get("/", (req, res) => {
  res.send("PulsePlanner Backend Running");
});

// ---------- Users ----------

// Create user
app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ---------- Tasks ----------

// Create task
app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get tasks for a user
app.get("/tasks/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Toggle task completion
app.patch("/tasks/:taskId", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete task
app.delete("/tasks/:taskId", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// ---------- Pomodoro ----------

// Start Pomodoro
app.post("/pomodoro/start", async (req, res) => {
  const { taskId, userId } = req.body;
  try {
    const newPomodoro = await Pomodoro.create({
      taskId,
      userId,
      startTime: new Date(),
      endTime: null,
    });
    res.json(newPomodoro);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Stop Pomodoro
app.post("/pomodoro/stop/:pomodoroId", async (req, res) => {
  try {
    const updated = await Pomodoro.findByIdAndUpdate(
      req.params.pomodoroId,
      { endTime: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json(err);
  }
});

// =====================
// Start server
// =====================
app.listen(5000, () => console.log("Server running on port 5000"));
