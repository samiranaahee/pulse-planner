"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Timer,
  BarChart3,
  Settings,
  Plus,
  ArrowRight,
  Target,
  Zap,
  BookOpen,
  Briefcase,
  Home,
  TrendingUp,
  CheckSquare, // Task icon
} from "lucide-react";

const PulsePlannerDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  // Update time and greeting
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    return () => clearInterval(timer);
  }, []);

  // Features including Login/Register
  const features = [
    {
      id: "pomodoro",
      title: "Pomodoro Timer",
      description: "Boost productivity with focused work sessions",
      icon: Timer,
      color: "from-red-500 to-pink-500",
      route: "/pomodoro",
      stats: "25 min sessions",
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "Manage your schedule and appointments",
      icon: Calendar,
      color: "from-blue-500 to-indigo-500",
      route: "/calender",
      stats: "3 events today",
    },
    {
      id: "fbtracking",
      title: "FB Tracking",
      description: "Track and analyze your Facebook activities",
      icon: BarChart3,
      color: "from-purple-500 to-violet-500",
      route: "/fbtracking",
      stats: "Analytics ready",
    },
    {
      id: "notes",
      title: "Notes",
      description: "Quick notes and documentation",
      icon: BookOpen,
      color: "from-slate-500 to-gray-500",
      route: "/notes",
      stats: "12 notes",
    },
    {
      id: "hide_distractions",
      title: "Hide Distractions",
      description: "Block distracting websites and apps",
      icon: Settings,
      color: "from-red-500 to-orange-500",
      route: "/hide_distractions",
      stats: "5 sites blocked",
    },
    {
      id: "achievement",
      title: "Achievements",
      description: "Track your productivity milestones",
      icon: Target,
      color: "from-yellow-500 to-amber-500",
      route: "/achievement",
      stats: "12 unlocked",
    },
    {
      id: "alarm",
      title: "Alarm",
      description: "Set reminders and alarms",
      icon: Clock,
      color: "from-indigo-500 to-purple-500",
      route: "/alarm",
      stats: "3 active alarms",
    },
    {
      id: "login",
      title: "Login",
      description: "Access your account",
      icon: Clock,
      color: "from-green-500 to-teal-500",
      route: "/login",
      stats: "",
    },
    {
      id: "register",
      title: "Register",
      description: "Create a new account",
      icon: Plus,
      color: "from-blue-500 to-indigo-500",
      route: "/register",
      stats: "",
    },
  ];

  const quickActions = [
    { title: "Start Pomodoro", icon: Timer, route: "/pomodoro" },
    { title: "Login", icon: Clock, route: "/login" },
    { title: "Register", icon: Plus, route: "/register" },
  ];

  const recentActivity = [
    {
      action: 'Completed task: "Design wireframes"',
      time: "2 hours ago",
      type: "task",
    },
    {
      action: "Started Pomodoro session",
      time: "3 hours ago",
      type: "pomodoro",
    },
    {
      action: "Added team meeting to calendar",
      time: "5 hours ago",
      type: "calendar",
    },
    { action: "Updated project progress", time: "1 day ago", type: "project" },
  ];

  // Feature Card Component
  const FeatureCard = ({ feature }) => (
    <Link href={feature.route}>
      <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div
            className={`h-32 bg-gradient-to-br ${feature.color} p-6 relative`}
          >
            <feature.icon className="text-white" size={32} />
            {feature.stats && (
              <div className="absolute top-4 right-4 text-white text-sm font-medium">
                {feature.stats}
              </div>
            )}
            <div className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={20} />
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  // Quick Action Button Component
  const QuickActionButton = ({ action }) => (
    <Link href={action.route}>
      <button className="flex items-center space-x-3 w-full p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 group">
        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <action.icon className="text-blue-600" size={20} />
        </div>
        <span className="font-medium text-gray-800">{action.title}</span>
        <ArrowRight
          className="text-gray-400 ml-auto group-hover:text-gray-600 transition-colors"
          size={16}
        />
      </button>
    </Link>
  );

  // Activity Item Component
  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case "task":
          return CheckSquare;
        case "pomodoro":
          return Timer;
        case "calendar":
          return Calendar;
        case "project":
          return Briefcase;
        default:
          return Zap;
      }
    };
    const Icon = getIcon(activity.type);
    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="text-gray-600" size={16} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{activity.action}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Pulse Planner
              </h1>
              <p className="text-gray-600 mt-1">
                {greeting}! Ready to boost your productivity?
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-800">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-600">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Home className="mr-3 text-blue-600" size={28} /> Your Productivity
          Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Zap className="mr-2 text-yellow-500" size={24} /> Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((a, i) => (
                <QuickActionButton key={i} action={a} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="mr-2 text-green-500" size={24} /> Recent
              Activity
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentActivity.map((r, i) => (
                <ActivityItem key={i} activity={r} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="relative group">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PulsePlannerDashboard;
