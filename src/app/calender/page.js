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
  const [view, setView] = useState('week'); // 'day' or 'week'
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Morning Planning Session',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      duration: 25,
      type: 'work',
      completed: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Deep Work - Code Review',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:30',
      duration: 50,
      type: 'work',
      completed: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Quick Break',
      date: new Date().toISOString().split('T')[0],
      startTime: '11:20',
      duration: 5,
      type: 'break',
      completed: true,
      priority: 'low'
    },
    {
      id: 4,
      title: 'Team Meeting Prep',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '14:00',
      duration: 25,
      type: 'work',
      completed: false,
      priority: 'high'
    },
    {
      id: 5,
      title: 'Project Research',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '15:30',
      duration: 90,
      type: 'work',
      completed: false,
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Weekly Review',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '16:00',
      duration: 25,
      type: 'work',
      completed: false,
      priority: 'high'
    }
  ]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    duration: 25,
    type: 'work',
    priority: 'medium'
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

     
