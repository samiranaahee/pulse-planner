"use client";
import { useEffect, useState } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [pomodoros, setPomodoros] = useState({});
  const [loading, setLoading] = useState(true);

  const userId = "68adc6c97bd94b04e034f35b"; // Replace with your MongoDB user ID

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${userId}`);
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Toggle task completion
  const toggleComplete = async (task) => {
    try {
      await fetch(`http://localhost:5000/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Start Pomodoro
  const startPomodoro = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/pomodoro/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, userId }),
      });
      const data = await res.json();
      setPomodoros((prev) => ({ ...prev, [taskId]: data._id }));
    } catch (err) {
      console.error(err);
    }
  };

  // Stop Pomodoro
  const stopPomodoro = async (taskId) => {
    try {
      const pomodoroId = pomodoros[taskId];
      if (!pomodoroId) return;

      await fetch(`http://localhost:5000/pomodoro/stop/${pomodoroId}`, {
        method: "POST",
      });
      setPomodoros((prev) => ({ ...prev, [taskId]: null }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">My Tasks</h1>
      {tasks.length === 0 && (
        <p className="text-center text-gray-500">
          No tasks found. Create some tasks!
        </p>
      )}
      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`border rounded-lg p-4 shadow flex flex-col md:flex-row md:justify-between md:items-center
              ${task.completed ? "bg-gray-100" : "bg-white"}
            `}
          >
            <div className="mb-3 md:mb-0">
              <p
                className={`font-semibold text-lg ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </p>
              <p className="text-gray-600">{task.description}</p>
              {task.dueDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              {task.priority && (
                <span
                  className={`text-sm font-medium px-2 py-1 rounded mt-1 inline-block
                  ${
                    task.priority === "High"
                      ? "bg-red-200 text-red-800"
                      : task.priority === "Medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }
                `}
                >
                  {task.priority}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:items-center">
              <button
                onClick={() => toggleComplete(task)}
                className={`px-4 py-2 rounded font-medium text-white
                  ${
                    task.completed
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }
                `}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
              >
                Delete
              </button>

              {pomodoros[task._id] ? (
                <button
                  onClick={() => stopPomodoro(task._id)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
                >
                  Stop Pomodoro
                </button>
              ) : (
                <button
                  onClick={() => startPomodoro(task._id)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
                >
                  Start Pomodoro
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
