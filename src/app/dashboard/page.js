"use client";
import { useState, useEffect } from "react";
import API from "@/utils/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [timer, setTimer] = useState(25 * 60); // 25 min default
  const [isRunning, setIsRunning] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add a task
  const addTask = async () => {
    if (!newTask) return;
    try {
      const res = await API.post("/tasks", { title: newTask });
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const formatTime = (t) => {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">PulsePlan Dashboard</h1>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-w-md bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{task.title}</span>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pomodoro Timer */}
      <div className="w-full max-w-sm bg-white shadow rounded p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Pomodoro Timer</h2>
        <p className="text-4xl font-mono mb-4">{formatTime(timer)}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTimer(25 * 60);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
