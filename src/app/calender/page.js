"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week"); // 'day' or 'week'
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Morning Planning Session",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      duration: 25,
      type: "work",
      completed: false,
      priority: "high",
    },
    {
      id: 2,
      title: "Deep Work - Code Review",
      date: new Date().toISOString().split("T")[0],
      startTime: "10:30",
      duration: 50,
      type: "work",
      completed: false,
      priority: "medium",
    },
    {
      id: 3,
      title: "Quick Break",
      date: new Date().toISOString().split("T")[0],
      startTime: "11:20",
      duration: 5,
      type: "break",
      completed: true,
      priority: "low",
    },
    {
      id: 4,
      title: "Team Meeting Prep",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      startTime: "14:00",
      duration: 25,
      type: "work",
      completed: false,
      priority: "high",
    },
    {
      id: 5,
      title: "Project Research",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      startTime: "15:30",
      duration: 90,
      type: "work",
      completed: false,
      priority: "medium",
    },
    {
      id: 6,
      title: "Weekly Review",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      startTime: "16:00",
      duration: 25,
      type: "work",
      completed: false,
      priority: "high",
    },
  ]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    duration: 25,
    type: "work",
    priority: "medium",
  });

  // Get days for week view
  const getDaysInWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Get tasks for specific date
  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return tasks
      .filter((task) => task.date === dateString)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Check if task is upcoming (within next 2 hours)
  const isUpcoming = (task) => {
    const now = new Date();
    const taskDateTime = new Date(`${task.date}T${task.startTime}`);
    const diffInMinutes = (taskDateTime - now) / (1000 * 60);
    return diffInMinutes > 0 && diffInMinutes <= 120 && !task.completed;
  };

  // Check if task is happening now
  const isHappeningNow = (task) => {
    const now = new Date();
    const taskStart = new Date(`${task.date}T${task.startTime}`);
    const taskEnd = new Date(taskStart.getTime() + task.duration * 60000);
    return now >= taskStart && now <= taskEnd && !task.completed;
  };

  // Navigation functions
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  // Task management functions
  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        ...newTask,
        id: Date.now(),
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        duration: 25,
        type: "work",
        priority: "medium",
      });
      setShowTaskForm(false);
    }
  };

  const updateTask = () => {
    setTasks(
      tasks.map((task) => (task.id === editingTask.id ? editingTask : task))
    );
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Utility functions
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-red-50";
      case "medium":
        return "border-yellow-300 bg-yellow-50";
      case "low":
        return "border-green-300 bg-green-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getTaskStatusStyle = (task) => {
    if (task.completed) {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }
    if (isHappeningNow(task)) {
      return "bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-200";
    }
    if (isUpcoming(task)) {
      return "bg-orange-100 text-orange-800 border-orange-300 ring-2 ring-orange-200";
    }
    if (task.type === "work") {
      return "bg-red-50 text-red-700 border-red-200";
    }
    return "bg-green-50 text-green-700 border-green-200";
  };

  // Get upcoming tasks for sidebar
  const getUpcomingTasks = () => {
    return tasks
      .filter((task) => isUpcoming(task) || isHappeningNow(task))
      .sort((a, b) => {
        const aTime = new Date(`${a.date}T${a.startTime}`);
        const bTime = new Date(`${b.date}T${b.startTime}`);
        return aTime - bTime;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Calendar */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Pomodoro Calendar
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setView("day")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      view === "day"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setView("week")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      view === "week"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Week
                  </button>
                </div>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  view === "week" ? navigateWeek(-1) : navigateDay(-1)
                }
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {view === "week"
                  ? `Week of ${formatDate(getDaysInWeek(currentDate)[0])}`
                  : formatDate(currentDate)}
              </h2>
              <button
                onClick={() =>
                  view === "week" ? navigateWeek(1) : navigateDay(1)
                }
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Content */}
            {view === "week" ? (
              <div className="grid grid-cols-7 gap-3">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 pb-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {getDaysInWeek(currentDate).map((day, index) => {
                  const dayTasks = getTasksForDate(day);
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border-2 min-h-40 transition-all hover:shadow-md ${
                        isToday(day)
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div
                        className={`text-sm font-semibold mb-3 ${
                          isToday(day) ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-2">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-2 rounded-lg text-xs cursor-pointer transition-all hover:scale-105 border ${getTaskStatusStyle(
                              task
                            )} ${task.completed ? "opacity-60" : ""}`}
                            onClick={() => setEditingTask(task)}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              {isHappeningNow(task) && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                              {isUpcoming(task) && (
                                <AlertCircle className="w-3 h-3 text-orange-600" />
                              )}
                              <div
                                className={`font-medium truncate ${
                                  task.completed ? "line-through" : ""
                                }`}
                              >
                                {task.title}
                              </div>
                            </div>
                            <div className="text-xs opacity-75 flex items-center justify-between">
                              <span>{task.startTime}</span>
                              <span>{task.duration}min</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {getTasksForDate(currentDate).map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md border-2 ${getTaskStatusStyle(
                      task
                    )} ${task.completed ? "opacity-60" : ""}`}
                    onClick={() => setEditingTask(task)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskComplete(task.id)}
                          className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-2">
                          {isHappeningNow(task) && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium">NOW</span>
                            </div>
                          )}
                          {isUpcoming(task) && !isHappeningNow(task) && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">SOON</span>
                            </div>
                          )}
                        </div>
                        <div className={task.completed ? "line-through" : ""}>
                          <div className="font-semibold text-lg">
                            {task.title}
                          </div>
                          <div className="text-sm opacity-75 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.startTime}
                            </span>
                            <span>{task.duration} minutes</span>
                            <span className="capitalize">{task.type}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </div>
                    </div>
                  </div>
                ))}
                {getTasksForDate(currentDate).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No tasks scheduled for this day</p>
                    <p className="text-sm">
                      Click the + button to add a new task
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Tasks Sidebar */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 lg:w-80">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Upcoming Sessions
            </h3>
            <div className="space-y-3">
              {getUpcomingTasks().map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                    isHappeningNow(task)
                      ? "bg-blue-100 border-blue-300 ring-2 ring-blue-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                  onClick={() => setEditingTask(task)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isHappeningNow(task) ? (
                      <div className="flex items-center gap-1 text-blue-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold">HAPPENING NOW</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">UPCOMING</span>
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-gray-800">{task.title}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-between mt-1">
                    <span>{task.startTime}</span>
                    <span>{task.duration} min</span>
                  </div>
                </div>
              ))}
              {getUpcomingTasks().length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No upcoming sessions</p>
                  <p className="text-xs">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Form Modal */}
        {(showTaskForm || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingTask ? "Edit Task" : "New Pomodoro Session"}
                </h3>
                <button
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={editingTask ? editingTask.title : newTask.title}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        : setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingTask ? editingTask.date : newTask.date}
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              date: e.target.value,
                            })
                          : setNewTask({ ...newTask, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={
                        editingTask ? editingTask.startTime : newTask.startTime
                      }
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              startTime: e.target.value,
                            })
                          : setNewTask({
                              ...newTask,
                              startTime: e.target.value,
                            })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={
                        editingTask ? editingTask.duration : newTask.duration
                      }
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              duration: parseInt(e.target.value),
                            })
                          : setNewTask({
                              ...newTask,
                              duration: parseInt(e.target.value),
                            })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={5}>5 min</option>
                      <option value={25}>25 min</option>
                      <option value={50}>50 min</option>
                      <option value={90}>90 min</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={editingTask ? editingTask.type : newTask.type}
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              type: e.target.value,
                            })
                          : setNewTask({ ...newTask, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="work">Work</option>
                      <option value="break">Break</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={
                        editingTask ? editingTask.priority : newTask.priority
                      }
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              priority: e.target.value,
                            })
                          : setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {editingTask && (
                  <button
                    onClick={() => {
                      deleteTask(editingTask.id);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? updateTask : addTask}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingTask ? "Update" : "Add"} Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
