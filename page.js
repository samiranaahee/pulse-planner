"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";

// Mock API service - replace with your actual API calls
const taskAPI = {
  async getTasks() {
    // Replace with actual API call
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  },

  async createTask(task) {
    const tasks = await this.getTasks();
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current-user", // Replace with actual user
    };
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    return newTask;
  },

  async updateTask(id, updates) {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) throw new Error("Task not found");

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: "current-user", // Replace with actual user
    };
    tasks[taskIndex] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return updatedTask;
  },

  async deleteTask(id) {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    return {
      id,
      deletedAt: new Date().toISOString(),
      deletedBy: "current-user",
    };
  },
};

// Task Form Component
const TaskForm = ({ task, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    status: task?.status || "pending",
    dueDate: task?.dueDate || "",
    category: task?.category || "",
    tags: task?.tags || [],
  });

  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h3>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Work, Personal, Health"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.title.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Task"
                  : "Create Task"}
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showDetails, setShowDetails] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-none ${
              statusColors[task.status]
            }`}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </div>
          )}
          {task.category && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {task.category}
            </div>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {showDetails ? "Hide" : "Show"} Activity Details
        </button>

        {showDetails && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-xs space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>Created by {task.createdBy || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
            {task.updatedAt !== task.createdAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Last updated: {formatDate(task.updatedAt)}</span>
              </div>
            )}
            {task.lastModifiedBy && task.updatedAt !== task.createdAt && (
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>Last modified by: {task.lastModifiedBy}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Task Management Component
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    loadTasks();
    loadActivityLog();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskAPI.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLog = () => {
    const stored = localStorage.getItem("taskActivityLog");
    setActivityLog(stored ? JSON.parse(stored) : []);
  };

  const logActivity = (action, taskTitle, details = {}) => {
    const newActivity = {
      id: Date.now().toString(),
      action,
      taskTitle,
      timestamp: new Date().toISOString(),
      user: "current-user", // Replace with actual user
      ...details,
    };

    const updatedLog = [newActivity, ...activityLog].slice(0, 100); // Keep last 100 activities
    setActivityLog(updatedLog);
    localStorage.setItem("taskActivityLog", JSON.stringify(updatedLog));
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskAPI.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      setShowForm(false);
      logActivity("created", newTask.title, { taskId: newTask.id });
    } catch (err) {
      setError("Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskAPI.updateTask(editingTask.id, taskData);
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updatedTask : t))
      );
      setEditingTask(null);
      logActivity("updated", updatedTask.title, {
        taskId: updatedTask.id,
        changes: Object.keys(taskData),
      });
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const taskToDelete = tasks.find((t) => t.id === taskId);
      await taskAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      logActivity("deleted", taskToDelete?.title || "Unknown", { taskId });
    } catch (err) {
      setError("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const oldStatus = task.status;
      const updatedTask = await taskAPI.updateTask(taskId, {
        status: newStatus,
      });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      logActivity("status_changed", task.title, {
        taskId,
        from: oldStatus,
        to: newStatus,
      });
    } catch (err) {
      setError("Failed to update task status");
      console.error("Error updating status:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "createdAt")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "dueDate")
      return (
        new Date(a.dueDate || "9999-12-31") -
        new Date(b.dueDate || "9999-12-31")
      );
    if (sortBy === "priority") {
      const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError(null)} className="float-right">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {sortedTasks.length} of {tasks.length} tasks
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}

        {sortedTasks.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No tasks found</p>
            <p className="text-sm">Create your first task to get started</p>
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activityLog.slice(0, 10).map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-600"> {activity.action} </span>
                <span className="font-medium">{activity.taskTitle}</span>
                {activity.from && activity.to && (
                  <span className="text-gray-600">
                    {" "}
                    from {activity.from} to {activity.to}
                  </span>
                )}
              </div>
              <div className="text-gray-400 text-xs">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}

          {activityLog.length === 0 && (
            <p className="text-gray-500 text-center py-4">No activity yet</p>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          isEditing={!!editingTask}
        />
      )}
    </div>
  );
};

export default TaskManager;
