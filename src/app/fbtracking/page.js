"use client";
import React, { useState } from "react";

const FocusTracker = () => {
  // Simple state to track sessions
  const [pomodoroCount, setPomodoroCount] = useState(4);
  const [focusMinutes, setFocusMinutes] = useState(100);
  const [breakMinutes, setBreakMinutes] = useState(20);

  // List of today's sessions
  const [sessions, setSessions] = useState([
    "Focus - 25 minutes at 9:00 AM",
    "Break - 5 minutes at 9:25 AM",
    "Focus - 25 minutes at 9:30 AM",
    "Break - 5 minutes at 9:55 AM",
  ]);

  // Add a new session
  const addFocusSession = () => {
    setPomodoroCount(pomodoroCount + 1);
    setFocusMinutes(focusMinutes + 25);
    setSessions([
      ...sessions,
      `Focus - 25 minutes at ${new Date().toLocaleTimeString()}`,
    ]);
  };

  const addBreakSession = () => {
    setBreakMinutes(breakMinutes + 5);
    setSessions([
      ...sessions,
      `Break - 5 minutes at ${new Date().toLocaleTimeString()}`,
    ]);
  };

  // Convert minutes to hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} hours ${mins} minutes`;
    }
    return `${mins} minutes`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Title */}
      <h1 style={{ color: "black", fontSize: "24px" }}>My Focus Tracker</h1>
      <p>See how much you studied today</p>

      <br />

      {/* Today's Numbers */}
      <div>
        <h2 style={{ color: "blue", fontSize: "20px" }}>Today's Stats</h2>

        <div
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>Pomodoros Completed</h3>
          <p style={{ fontSize: "30px", color: "red" }}>{pomodoroCount}</p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>Focus Time</h3>
          <p style={{ fontSize: "30px", color: "blue" }}>
            {formatTime(focusMinutes)}
          </p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>Break Time</h3>
          <p style={{ fontSize: "30px", color: "green" }}>
            {formatTime(breakMinutes)}
          </p>
        </div>
      </div>

      <br />

      {/* Simple Progress Bar */}
      <div>
        <h2 style={{ color: "blue", fontSize: "20px" }}>Focus vs Break Time</h2>

        <p>Focus Time:</p>
        <div
          style={{
            width: "100%",
            height: "30px",
            backgroundColor: "lightgray",
            border: "1px solid black",
          }}
        >
          <div
            style={{
              width: `${(focusMinutes / (focusMinutes + breakMinutes)) * 100}%`,
              height: "30px",
              backgroundColor: "blue",
            }}
          ></div>
        </div>
        <p>
          {Math.round((focusMinutes / (focusMinutes + breakMinutes)) * 100)}%
          Focus
        </p>

        <br />

        <p>Break Time:</p>
        <div
          style={{
            width: "100%",
            height: "30px",
            backgroundColor: "lightgray",
            border: "1px solid black",
          }}
        >
          <div
            style={{
              width: `${(breakMinutes / (focusMinutes + breakMinutes)) * 100}%`,
              height: "30px",
              backgroundColor: "green",
            }}
          ></div>
        </div>
        <p>
          {Math.round((breakMinutes / (focusMinutes + breakMinutes)) * 100)}%
          Break
        </p>
      </div>

      <br />

      {/* This Week */}
      <div>
        <h2 style={{ color: "blue", fontSize: "20px" }}>This Week</h2>

        <div style={{ border: "1px solid gray", padding: "15px" }}>
          <p>
            <strong>Monday:</strong> 6 pomodoros, 150 minutes focus
          </p>
          <p>
            <strong>Tuesday:</strong> 4 pomodoros, 100 minutes focus
          </p>
          <p>
            <strong>Wednesday:</strong> 5 pomodoros, 125 minutes focus
          </p>
          <p>
            <strong>Thursday:</strong> 3 pomodoros, 75 minutes focus
          </p>
          <p>
            <strong>Friday:</strong> 4 pomodoros, 100 minutes focus
          </p>
          <p>
            <strong>Saturday:</strong> 2 pomodoros, 50 minutes focus
          </p>
          <p>
            <strong>Sunday:</strong> 4 pomodoros, 100 minutes focus
          </p>

          <br />
          <p>
            <strong>Total this week:</strong> 28 pomodoros, 700 minutes focus
          </p>
        </div>
      </div>

      <br />

      {/* Session List */}
      <div>
        <h2 style={{ color: "blue", fontSize: "20px" }}>Today's Sessions</h2>

        <div style={{ border: "1px solid gray", padding: "15px" }}>
          {sessions.map((session, index) => (
            <p
              key={index}
              style={{
                padding: "5px",
                backgroundColor: session.includes("Focus")
                  ? "lightblue"
                  : "lightgreen",
                marginBottom: "5px",
              }}
            >
              {session}
            </p>
          ))}
        </div>
      </div>

      <br />

      {/* Test Buttons */}
      <div>
        <h2>Add New Session (for testing)</h2>

        <button
          onClick={addFocusSession}
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            fontSize: "16px",
            marginRight: "10px",
          }}
        >
          Add Focus Session
        </button>

        <button
          onClick={addBreakSession}
          style={{
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            fontSize: "16px",
          }}
        >
          Add Break Session
        </button>
      </div>
    </div>
  );
};

export default FocusTracker;
