"use client";

import React, { useState } from "react";

const AchievementsDashboard = () => {
  const [stats, setStats] = useState({
    pomodoros: 3,
    streak: 5,
    tasks: 23,
  });

  const [badges, setBadges] = useState([
    { name: "First Timer", done: true },
    { name: "5 Pomodoros", done: false },
    { name: "Week Streak", done: false },
    { name: "50 Tasks", done: false },
  ]);

  const addPomodoro = () => {
    setStats((prev) => ({ ...prev, pomodoros: prev.pomodoros + 1 }));
    if (stats.pomodoros + 1 >= 5) {
      setBadges((prev) =>
        prev.map((b) => (b.name === "5 Pomodoros" ? { ...b, done: true } : b))
      );
    }
  };

  const addTask = () => {
    setStats((prev) => ({ ...prev, tasks: prev.tasks + 1 }));
    if (stats.tasks + 1 >= 50) {
      setBadges((prev) =>
        prev.map((b) => (b.name === "50 Tasks" ? { ...b, done: true } : b))
      );
    }
  };

  const addStreak = () => {
    setStats((prev) => ({ ...prev, streak: prev.streak + 1 }));
    if (stats.streak + 1 >= 7) {
      setBadges((prev) =>
        prev.map((b) => (b.name === "Week Streak" ? { ...b, done: true } : b))
      );
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>My Achievements</h1>

      {/* Stats */}
      <div style={{ marginBottom: "30px" }}>
        <h2>My Stats</h2>
        <div style={{ fontSize: "18px" }}>
          <p>
            Pomodoros today: <strong>{stats.pomodoros}</strong>
          </p>
          <p>
            Current streak: <strong>{stats.streak} days</strong>
          </p>
          <p>
            Tasks completed: <strong>{stats.tasks}</strong>
          </p>
        </div>
      </div>

      {/* Test Buttons */}
      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <p>Test buttons:</p>
        <button
          onClick={addPomodoro}
          style={{
            padding: "8px 15px",
            margin: "5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Add Pomodoro
        </button>
        <button
          onClick={addTask}
          style={{
            padding: "8px 15px",
            margin: "5px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Add Task
        </button>
        <button
          onClick={addStreak}
          style={{
            padding: "8px 15px",
            margin: "5px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Add Streak Day
        </button>
      </div>

      {/* Badges */}
      <div>
        <h2>My Badges</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {badges.map((badge, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                textAlign: "center",
                backgroundColor: badge.done ? "#d4edda" : "#f8f9fa",
                minWidth: "120px",
                color: badge.done ? "#155724" : "#6c757d",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {badge.name}
              </div>
              {badge.done ? (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#155724",
                    padding: "4px 8px",
                    backgroundColor: "#c3e6cb",
                    borderRadius: "3px",
                  }}
                >
                  UNLOCKED
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6c757d",
                    padding: "4px 8px",
                    backgroundColor: "#e9ecef",
                    borderRadius: "3px",
                  }}
                >
                  LOCKED
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Streak Display */}
      <div style={{ marginTop: "30px" }}>
        <h2>This Week</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  textAlign: "center",
                  backgroundColor: index < stats.streak ? "#28a745" : "#e9ecef",
                  color: index < stats.streak ? "white" : "#6c757d",
                  borderRadius: "3px",
                  minWidth: "50px",
                  fontSize: "14px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{day}</div>
                <div style={{ fontSize: "12px", marginTop: "5px" }}>
                  {index < stats.streak ? "DONE" : "NOT DONE"}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsDashboard;
