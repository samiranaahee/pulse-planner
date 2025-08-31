"use client";

import { useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Finish Pulse Planner MVP", done: false },
  ]);
  const [newGoal, setNewGoal] = useState("");

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now(), title: newGoal, done: false }]);
    setNewGoal("");
  };

  const toggleGoal = (id) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Goals</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter a new goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={addGoal}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add
        </button>
      </div>

      <div className="grid gap-4">
        {goals.map((g) => (
          <div
            key={g.id}
            onClick={() => toggleGoal(g.id)}
            className={`p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer ${
              g.done ? "bg-green-50 line-through text-gray-500" : ""
            }`}
          >
            <h3 className="text-xl font-semibold">{g.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
