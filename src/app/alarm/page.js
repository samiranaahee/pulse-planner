"use client";
import React, { useState } from "react";

const FocusTracker = () => {
  // Simple state to track sessions
  const [pomodoroCount, setPomodoroCount] = useState(4);
  const [focusMinutes, setFocusMinutes] = useState(100);
  const [breakMinutes, setBreakMinutes] = useState(20);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // List of today's sessions
  const [sessions, setSessions] = useState([
    "Focus - 25 minutes at 9:00 AM",
    "Break - 5 minutes at 9:25 AM",
    "Focus - 25 minutes at 9:30 AM",
    "Break - 5 minutes at 9:55 AM",
  ]);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSound, setCurrentSound] = useState("bell");

  // Add a new session
  const addFocusSession = () => {
    setPomodoroCount(pomodoroCount + 1);
    setFocusMinutes(focusMinutes + 25);
    setSessions([
      ...sessions,
      `Focus - 25 minutes at ${new Date().toLocaleTimeString()}`,
    ]);

    // Play notification sound and show alert
    playNotification("Focus session completed! Time for a break.");
  };

  const addBreakSession = () => {
    setBreakMinutes(breakMinutes + 5);
    setSessions([
      ...sessions,
      `Break - 5 minutes at ${new Date().toLocaleTimeString()}`,
    ]);

    // Play notification sound and show alert
    playNotification("Break time is over! Ready to focus?");
  };

  // Notification function
  const playNotification = (message) => {
    // Show browser notification if enabled
    if (notificationsEnabled) {
      // Check if browser supports notifications
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Pulse Plan", {
            body: message,
            icon: "/favicon.ico",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
              new Notification("Pulse Plan", {
                body: message,
                icon: "/favicon.ico",
              });
            }
          });
        }
      }

      // Show alert as backup
      alert(message);
    }

    // Play sound if enabled
    if (soundEnabled) {
      playAlarmSound();
    }
  };

  // Play alarm sound
  const playAlarmSound = () => {
    try {
      // Create audio context for different sounds
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      if (currentSound === "bell") {
        // Simple bell sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
      } else if (currentSound === "beep") {
        // Simple beep sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.log("Sound not supported");
    }
  };

  // Test notification
  const testNotification = () => {
    playNotification("This is a test notification!");
  };

  // Request notification permission
  const enableNotifications = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          setNotificationsEnabled(true);
          alert("Notifications enabled!");
        } else {
          alert("Please allow notifications in your browser settings");
        }
      });
    } else {
      alert("Your browser does not support notifications");
    }
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

      {/* Sound & Notification Settings */}
      <div
        style={{
          border: "2px solid black",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "purple", fontSize: "20px" }}>
          Sound & Notifications
        </h2>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            <span style={{ marginLeft: "5px" }}>
              Play sound when session ends
            </span>
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Sound Type: </label>
          <select
            value={currentSound}
            onChange={(e) => setCurrentSound(e.target.value)}
            style={{ padding: "5px", fontSize: "14px" }}
          >
            <option value="bell">Bell</option>
            <option value="beep">Beep</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
            <span style={{ marginLeft: "5px" }}>
              Show desktop notifications
            </span>
          </label>
        </div>

        <button
          onClick={enableNotifications}
          style={{
            padding: "8px 15px",
            backgroundColor: "orange",
            color: "white",
            fontSize: "14px",
            marginRight: "10px",
          }}
        >
          Enable Notifications
        </button>

        <button
          onClick={testNotification}
          style={{
            padding: "8px 15px",
            backgroundColor: "purple",
            color: "white",
            fontSize: "14px",
          }}
        >
          Test Notification
        </button>
      </div>

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
