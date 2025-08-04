"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Clock } from "lucide-react";

export default function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cycle, setCycle] = useState(1);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto-switch between work and break
      if (isBreak) {
        setIsBreak(false);
        setTimeLeft(workDuration * 60);
        setCycle((prev) => prev + 1);
      } else {
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
      }
      setIsActive(false);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, workDuration, breakDuration, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? breakDuration * 60 : workDuration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100
    : ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100;

  const handleWorkDurationChange = (value) => {
    const newDuration = Math.max(1, Math.min(60, value));
    setWorkDuration(newDuration);
    if (!isBreak && !isActive) {
      setTimeLeft(newDuration * 60);
    }
  };

  const handleBreakDurationChange = (value) => {
    const newDuration = Math.max(1, Math.min(30, value));
    setBreakDuration(newDuration);
    if (isBreak && !isActive) {
      setTimeLeft(newDuration * 60);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">Pomodoro</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-700 mb-4">Timer Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={workDuration}
                  onChange={(e) =>
                    handleWorkDurationChange(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={breakDuration}
                  onChange={(e) =>
                    handleBreakDurationChange(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full mb-4 ${
              isBreak ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          <h2
            className={`text-lg font-medium mb-2 ${
              isBreak ? "text-green-600" : "text-red-600"
            }`}
          >
            {isBreak ? "Break Time" : "Focus Time"}
          </h2>

          <div className="relative mb-6">
            {/* Progress Ring */}
            <div className="relative w-64 h-64 mx-auto">
              <svg
                className="w-64 h-64 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 45 * (1 - progress / 100)
                  }`}
                  className={`transition-all duration-1000 ${
                    isBreak ? "text-green-500" : "text-red-500"
                  }`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-gray-800">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Cycle {cycle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={toggleTimer}
            className={`p-4 rounded-full text-white font-semibold transition-all transform hover:scale-105 ${
              isBreak
                ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200"
                : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
            }`}
          >
            {isActive ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
        </div>

        {/* Status */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {isActive
              ? isBreak
                ? "Take a break!"
                : "Stay focused!"
              : "Ready to start?"}
          </p>
        </div>
      </div>
    </div>
  );
}
