import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for habits
const mockHabits = [
  {
    id: 1,
    name: "Sleep",
    icon: "😴",
    unit: "hours",
    target: 8,
    entries: [
      { date: "2023-06-01", value: 7.5 },
      { date: "2023-06-02", value: 8 },
      { date: "2023-06-03", value: 6.5 },
      { date: "2023-06-04", value: 7 },
      { date: "2023-06-05", value: 8.2 },
      { date: "2023-06-06", value: 7.8 },
      { date: "2023-06-07", value: 7.2 },
    ],
    category: "health",
    color: "#4f46e5",
    streakDays: 7,
  },
  {
    id: 2,
    name: "Water",
    icon: "💧",
    unit: "glasses",
    target: 8,
    entries: [
      { date: "2023-06-01", value: 6 },
      { date: "2023-06-02", value: 8 },
      { date: "2023-06-03", value: 5 },
      { date: "2023-06-04", value: 7 },
      { date: "2023-06-05", value: 8 },
      { date: "2023-06-06", value: 6 },
      { date: "2023-06-07", value: 4 },
    ],
    category: "health",
    color: "#0ea5e9",
    streakDays: 4,
  },
  {
    id: 3,
    name: "Screen Time",
    icon: "📱",
    unit: "hours",
    target: 2,
    entries: [
      { date: "2023-06-01", value: 3 },
      { date: "2023-06-02", value: 2.5 },
      { date: "2023-06-03", value: 1.8 },
      { date: "2023-06-04", value: 3.5 },
      { date: "2023-06-05", value: 2.8 },
      { date: "2023-06-06", value: 2 },
      { date: "2023-06-07", value: 2.2 },
    ],
    category: "productivity",
    color: "#f59e0b",
    streakDays: 2,
    lowerIsBetter: true,
  },
  {
    id: 4,
    name: "Meditation",
    icon: "🧘‍♂️",
    unit: "minutes",
    target: 20,
    entries: [
      { date: "2023-06-01", value: 15 },
      { date: "2023-06-02", value: 20 },
      { date: "2023-06-03", value: 15 },
      { date: "2023-06-04", value: 0 },
      { date: "2023-06-05", value: 25 },
      { date: "2023-06-06", value: 20 },
      { date: "2023-06-07", value: 15 },
    ],
    category: "mindfulness",
    color: "#8b5cf6",
    streakDays: 3,
  },
  {
    id: 5,
    name: "Exercise",
    icon: "🏋️‍♂️",
    unit: "minutes",
    target: 30,
    entries: [
      { date: "2023-06-01", value: 35 },
      { date: "2023-06-02", value: 0 },
      { date: "2023-06-03", value: 45 },
      { date: "2023-06-04", value: 30 },
      { date: "2023-06-05", value: 0 },
      { date: "2023-06-06", value: 60 },
      { date: "2023-06-07", value: 30 },
    ],
    category: "health",
    color: "#10b981",
    streakDays: 1,
  },
  {
    id: 6,
    name: "Reading",
    icon: "📚",
    unit: "pages",
    target: 20,
    entries: [
      { date: "2023-06-01", value: 15 },
      { date: "2023-06-02", value: 25 },
      { date: "2023-06-03", value: 20 },
      { date: "2023-06-04", value: 10 },
      { date: "2023-06-05", value: 30 },
      { date: "2023-06-06", value: 5 },
      { date: "2023-06-07", value: 15 },
    ],
    category: "productivity",
    color: "#ec4899",
    streakDays: 7,
  },
];

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  streak: 12,
  points: 850,
  level: 5,
};

// Type definitions
type Habit = {
  id: number;
  name: string;
  icon: string;
  unit: string;
  target: number;
  entries: { date: string; value: number }[];
  category: string;
  color: string;
  streakDays: number;
  lowerIsBetter?: boolean;
};

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

type NewHabit = {
  name: string;
  icon: string;
  unit: string;
  target: number;
  category: string;
  color: string;
};

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [todayEntries, setTodayEntries] = useState<Record<number, number>>({});
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Don't forget to log your water intake", read: false },
    { id: 2, message: "You're on a 12-day streak! Keep it up!", read: false },
    { id: 3, message: "New feature: Weekly insights now available", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newHabit, setNewHabit] = useState<NewHabit>({
    name: "",
    icon: "📝",
    unit: "",
    target: 1,
    category: "productivity",
    color: "#4f46e5",
  });

  // Initialize today's entries
  useEffect(() => {
    const entries: Record<number, number> = {};
    habits.forEach((habit) => {
      const todayEntry = habit.entries[habit.entries.length - 1];
      entries[habit.id] = todayEntry.value;
    });
    setTodayEntries(entries);
  }, [habits]);

  const handleHabitValueChange = (habitId: number, value: number) => {
    setTodayEntries((prev) => ({
      ...prev,
      [habitId]: value,
    }));

    // Update the habits data with the new value
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const updatedEntries = [...habit.entries];
          updatedEntries[updatedEntries.length - 1].value = value;
          return {
            ...habit,
            entries: updatedEntries,
          };
        }
        return habit;
      })
    );
  };

  const handleAddHabit = () => {
    if (!newHabit.name || !newHabit.unit) return;

    const today = "2023-06-07";
    const newId = habits.length + 1;

    const habitToAdd: Habit = {
      id: newId,
      name: newHabit.name,
      icon: newHabit.icon,
      unit: newHabit.unit,
      target: Number(newHabit.target),
      entries: [
        { date: "2023-06-01", value: 0 },
        { date: "2023-06-02", value: 0 },
        { date: "2023-06-03", value: 0 },
        { date: "2023-06-04", value: 0 },
        { date: "2023-06-05", value: 0 },
        { date: "2023-06-06", value: 0 },
        { date: today, value: 0 },
      ],
      category: newHabit.category,
      color: newHabit.color,
      streakDays: 0,
    };

    setHabits([...habits, habitToAdd]);
    setTodayEntries((prev) => ({
      ...prev,
      [newId]: 0,
    }));

    setNewHabit({
      name: "",
      icon: "📝",
      unit: "",
      target: 1,
      category: "productivity",
      color: "#4f46e5",
    });

    setShowAddHabitModal(false);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const calculateProgress = (habit: Habit) => {
    const todayValue = todayEntries[habit.id] || 0;
    let progress = (todayValue / habit.target) * 100;

    // If lower is better, invert the progress calculation
    if (habit.lowerIsBetter) {
      progress = 100 - (todayValue / habit.target) * 100;
      progress = Math.max(0, progress); // Ensure not negative
    }

    return Math.min(100, progress);
  };

  // Weekly summary stats
  const calculateAverages = () => {
    const categories: Record<
      string,
      { total: number; count: number; color: string }
    > = {};
    habits.forEach((habit) => {
      if (!categories[habit.category]) {
        categories[habit.category] = {
          total: 0,
          count: 0,
          color: habit.color,
        };
      }

      const completion = habit.entries.reduce((acc, entry) => {
        if (habit.lowerIsBetter) {
          return acc + (entry.value <= habit.target ? 1 : 0);
        }
        return acc + (entry.value >= habit.target ? 1 : 0);
      }, 0);

      categories[habit.category].total +=
        (completion / habit.entries.length) * 100;
      categories[habit.category].count += 1;
    });

    // Calculate averages and format for chart
    return Object.keys(categories).map((category) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: categories[category].total / categories[category].count,
      color: categories[category].color,
    }));
  };

  const weeklyAverages = calculateAverages();

  // Calculate overall completion rate
  const calculateOverallCompletion = () => {
    let totalCompletions = 0;
    let totalEntries = 0;

    habits.forEach((habit) => {
      habit.entries.forEach((entry) => {
        totalEntries++;
        if (habit.lowerIsBetter) {
          if (entry.value <= habit.target) totalCompletions++;
        } else {
          if (entry.value >= habit.target) totalCompletions++;
        }
      });
    });

    return (totalCompletions / totalEntries) * 100;
  };

  const overallCompletion = calculateOverallCompletion();

  return (
    <div className="relative">
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar (Mobile) */}
        <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-gray-900 bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <motion.nav
              className="absolute top-0 left-0 bottom-0 flex w-80 flex-col overflow-y-auto bg-white py-6 px-4"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 flex items-center px-4">
                <h1 className="text-2xl font-bold text-primary-600 font-heading">
                  HabitTrack
                </h1>
              </div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center rounded-lg px-4 py-3 text-gray-700 ${
                    activeTab === "dashboard"
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab("stats");
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center rounded-lg px-4 py-3 text-gray-700 ${
                    activeTab === "stats"
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Stats
                </button>
                <button
                  onClick={() => {
                    setActiveTab("habits");
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center rounded-lg px-4 py-3 text-gray-700 ${
                    activeTab === "habits"
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Habits
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setSidebarOpen(false);
                  }}
                  className="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
              </div>
              <div className="mt-auto">
                <div className="bg-gray-100 rounded-lg p-4 mt-6">
                  <div className="flex items-center">
                    <img
                      src={mockUser.avatar}
                      alt="User"
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {mockUser.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {mockUser.streak}-day streak
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
        </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex items-center justify-center flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-primary-600 font-heading">
                  HabitTrack
                </h1>
              </div>
              <nav className="mt-8 flex-1 space-y-1 px-2">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium w-full ${
                    activeTab === "dashboard"
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium w-full ${
                    activeTab === "stats"
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Stats
                </button>
                <button
                  onClick={() => setActiveTab("habits")}
                  className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium w-full ${
                    activeTab === "habits"
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Habits
                </button>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="group flex items-center rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 w-full"
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
              </nav>
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <img
                  src={mockUser.avatar}
                  alt="User"
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {mockUser.name}
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {mockUser.streak}-day streak
                    </span>
                    <span className="ml-2 inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
                      Level {mockUser.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="w-full">
          <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex flex-1 justify-between px-4 sm:px-6">
              <div className="flex flex-1">
                <div className="flex w-full md:ml-0">
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      className="block h-full w-full border-transparent py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search habits..."
                      type="search"
                    />
                  </div>
                </div>
              </div>

              <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                {/* Profile dropdown */}
                <div className="relative flex-shrink-0">
                  <div>
                    <button
                      className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <span className="sr-only">View notifications</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                      )}
                    </button>
                  </div>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-2 text-sm text-gray-500">
                            No notifications
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 ${
                                !notification.read ? "bg-primary-50" : ""
                              }`}
                              onClick={() =>
                                markNotificationAsRead(notification.id)
                              }
                            >
                              <p className="text-sm text-gray-900">
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <span className="mt-1 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                  New
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            {activeTab === "dashboard" && (
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <h1 className="text-2xl font-semibold text-gray-900 font-heading">
                    Dashboard
                  </h1>
                  <div className="mt-3 flex sm:mt-0 sm:ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddHabitModal(true)}
                      className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Habit
                    </motion.button>
                  </div>
                </div>

                {/* Dashboard overview */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="overflow-hidden rounded-lg bg-white shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-primary-100 p-3">
                          <svg
                            className="h-6 w-6 text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Current Streak
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {mockUser.streak} days
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="overflow-hidden rounded-lg bg-white shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                          <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Completion Rate
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {Math.round(overallCompletion)}%
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="overflow-hidden rounded-lg bg-white shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-secondary-100 p-3">
                          <svg
                            className="h-6 w-6 text-secondary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Habits Tracked
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {habits.length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Habits section */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">
                    Today's Habits
                  </h2>
                  <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {habits.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="overflow-hidden rounded-lg bg-white shadow"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xl">{habit.icon}</span>
                              <h3 className="ml-2 text-lg font-medium text-gray-900">
                                {habit.name}
                              </h3>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                              {habit.streakDays} day streak
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium text-gray-900">
                                {todayEntries[habit.id] || 0} / {habit.target}{" "}
                                {habit.unit}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="overflow-hidden rounded-full bg-gray-200">
                                <motion.div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${calculateProgress(habit)}%`,
                                    backgroundColor: habit.color,
                                  }}
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${calculateProgress(habit)}%` }}
                                  transition={{ duration: 1 }}
                                ></motion.div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor={`habit-${habit.id}`}
                              className="text-sm font-medium text-gray-700"
                            >
                              {habit.lowerIsBetter ? "Limit to" : "Target"}{" "}
                              {habit.target} {habit.unit}
                            </label>
                            <input
                              type="range"
                              id={`habit-${habit.id}`}
                              min="0"
                              max={habit.target * 2}
                              step={habit.unit === "hours" ? 0.5 : 1}
                              value={todayEntries[habit.id] || 0}
                              onChange={(e) =>
                                handleHabitValueChange(
                                  habit.id,
                                  parseFloat(e.target.value)
                                )
                              }
                              className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                              <span>0</span>
                              <span>{habit.target}</span>
                              <span>{habit.target * 2}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Weekly Overview Section */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">
                    Weekly Overview
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="overflow-hidden rounded-lg bg-white p-6 shadow"
                    >
                      <h3 className="text-base font-medium text-gray-900">
                        Habits by Category
                      </h3>
                      <div className="mt-2 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={weeklyAverages}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) =>
                                `${name}: ${Math.round(value)}%`
                              }
                            >
                              {weeklyAverages.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [
                                `${Math.round(value as number)}%`,
                                "Completion",
                              ]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="overflow-hidden rounded-lg bg-white p-6 shadow"
                    >
                      <h3 className="text-base font-medium text-gray-900">
                        Weekly Progress
                      </h3>
                      <div className="mt-2 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={habits.map((habit) => ({
                              name: habit.name,
                              progress:
                                (habit.entries.reduce((acc, entry) => {
                                  if (habit.lowerIsBetter) {
                                    return acc + (entry.value <= habit.target ? 1 : 0);
                                  }
                                  return acc + (entry.value >= habit.target ? 1 : 0);
                                }, 0) /
                                  habit.entries.length) *
                                100,
                              color: habit.color,
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis
                              label={{
                                value: "Completion %",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <Tooltip
                              formatter={(value) => [
                                `${Math.round(value as number)}%`,
                                "Completion Rate",
                              ]}
                            />
                            <Bar dataKey="progress">
                              {habits.map((habit, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={habit.color}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 font-heading">
                  Statistics
                </h1>

                {/* Weekly trends */}
                <div className="mt-6">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">
                        Weekly Trends
                      </h2>
                      <div className="mt-2 h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[0, 1, 2, 3, 4, 5, 6].map((day) => {
                              const date = new Date();
                              date.setDate(date.getDate() - (6 - day));
                              const dateStr = `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date.getDate()
                              ).padStart(2, "0")}`;

                              const result: Record<string, any> = {
                                date: dateStr,
                              };
                              habits.forEach((habit) => {
                                const entry = habit.entries.find(
                                  (e) => e.date === dateStr
                                );
                                result[habit.name] = entry ? entry.value : 0;
                              });

                              return result;
                            })}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {habits.map((habit) => (
                              <Line
                                key={habit.id}
                                type="monotone"
                                dataKey={habit.name}
                                stroke={habit.color}
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion rate */}
                <div className="mt-6">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">
                        Completion History
                      </h2>
                      <div className="mt-2 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[0, 1, 2, 3, 4, 5, 6].map((day) => {
                              const date = new Date();
                              date.setDate(date.getDate() - (6 - day));
                              const dayName = [
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                              ][date.getDay()];
                              const dateStr = `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date.getDate()
                              ).padStart(2, "0")}`;

                              let completed = 0;
                              let total = 0;

                              habits.forEach((habit) => {
                                const entry = habit.entries.find(
                                  (e) => e.date === dateStr
                                );
                                if (entry) {
                                  total++;
                                  if (habit.lowerIsBetter) {
                                    if (entry.value <= habit.target) completed++;
                                  } else {
                                    if (entry.value >= habit.target) completed++;
                                  }
                                }
                              });

                              return {
                                day: dayName,
                                date: dateStr,
                                completed,
                                total,
                                rate: total > 0 ? (completed / total) * 100 : 0,
                              };
                            })}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis
                              label={{
                                value: "Completion %",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <Tooltip
                              formatter={(value) => [
                                `${Math.round(value as number)}%`,
                                "Completion Rate",
                              ]}
                            />
                            <Bar dataKey="rate" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Streak records */}
                <div className="mt-6">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900">
                        Streak Records
                      </h2>
                      <div className="mt-5">
                        <ul className="divide-y divide-gray-200">
                          {habits
                            .sort((a, b) => b.streakDays - a.streakDays)
                            .map((habit) => (
                              <li key={habit.id} className="py-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="text-2xl">{habit.icon}</span>
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">
                                        {habit.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {habit.category.charAt(0).toUpperCase() +
                                          habit.category.slice(1)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="flex space-x-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={`h-2 w-2 rounded-full ${
                                            i < Math.min(5, habit.streakDays)
                                              ? "bg-primary-600"
                                              : "bg-gray-200"
                                          }`}
                                        ></div>
                                      ))}
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                      <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-0.5 text-sm font-medium text-primary-800">
                                        {habit.streakDays} days
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "habits" && (
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <h1 className="text-2xl font-semibold text-gray-900 font-heading">
                    My Habits
                  </h1>
                  <div className="mt-3 flex sm:mt-0 sm:ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddHabitModal(true)}
                      className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Habit
                    </motion.button>
                  </div>
                </div>

                {/* Habits list */}
                <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
                  <ul className="divide-y divide-gray-200">
                    {habits.map((habit) => (
                      <motion.li
                        key={habit.id}
                        className="p-4 sm:px-6"
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-full"
                              style={{
                                backgroundColor: `${habit.color}20`,
                              }}
                            >
                              <span className="text-2xl">{habit.icon}</span>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">
                                {habit.name}
                              </h3>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-gray-500">
                                  {habit.lowerIsBetter ? "Limit" : "Target"}:{" "}
                                  {habit.target} {habit.unit}
                                </span>
                                <span className="mx-2 text-gray-500">
                                  &middot;
                                </span>
                                <span className="text-sm text-gray-500 capitalize">
                                  {habit.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4">
                              <div className="text-sm text-gray-900 text-right">
                                Current streak
                              </div>
                              <div className="mt-1 flex items-center justify-end">
                                <svg
                                  className="h-5 w-5 text-primary-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-900">
                                  {habit.streakDays} days
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  Progress: {Math.round(calculateProgress(habit))}%
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  {todayEntries[habit.id] || 0} / {habit.target}{" "}
                                  {habit.unit}
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200">
                              <motion.div
                                style={{
                                  width: `${calculateProgress(habit)}%`,
                                  backgroundColor: habit.color,
                                }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                initial={{ width: "0%" }}
                                animate={{ width: `${calculateProgress(habit)}%` }}
                                transition={{ duration: 1 }}
                              ></motion.div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <input
                            type="range"
                            min="0"
                            max={habit.target * 2}
                            step={habit.unit === "hours" ? 0.5 : 1}
                            value={todayEntries[habit.id] || 0}
                            onChange={(e) =>
                              handleHabitValueChange(
                                habit.id,
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>0</span>
                            <span>{habit.target}</span>
                            <span>{habit.target * 2}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    
      {/* Add Habit Modal */}
      <AnimatePresence>
      {showAddHabitModal && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowAddHabitModal(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Add New Habit
                  </h3>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label
                        htmlFor="habit-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Habit Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="habit-name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="e.g., Drink Water"
                          value={newHabit.name}
                          onChange={(e) =>
                            setNewHabit({ ...newHabit, name: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="habit-icon"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Icon
                      </label>
                      <div className="mt-1">
                        <select
                          id="habit-icon"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={newHabit.icon}
                          onChange={(e) =>
                            setNewHabit({ ...newHabit, icon: e.target.value })
                          }
                        >
                          <option value="📝">📝 Note</option>
                          <option value="💧">💧 Water</option>
                          <option value="🏋️‍♂️">🏋️‍♂️ Exercise</option>
                          <option value="😴">😴 Sleep</option>
                          <option value="📚">📚 Reading</option>
                          <option value="🧘‍♂️">🧘‍♂️ Meditation</option>
                          <option value="📱">📱 Screen Time</option>
                          <option value="🥗">🥗 Healthy Eating</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="habit-unit"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Unit
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="habit-unit"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="glasses, pages, etc."
                            value={newHabit.unit}
                            onChange={(e) =>
                              setNewHabit({ ...newHabit, unit: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="habit-target"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Target
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="habit-target"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            min="1"
                            value={newHabit.target}
                            onChange={(e) =>
                              setNewHabit({
                                ...newHabit,
                                target: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="habit-category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category
                      </label>
                      <div className="mt-1">
                        <select
                          id="habit-category"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={newHabit.category}
                          onChange={(e) =>
                            setNewHabit({
                              ...newHabit,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="health">Health</option>
                          <option value="productivity">Productivity</option>
                          <option value="mindfulness">Mindfulness</option>
                          <option value="fitness">Fitness</option>
                          <option value="learning">Learning</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="habit-color"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Color
                      </label>
                      <div className="mt-1">
                        <div className="flex space-x-2">
                          {[
                            "#4f46e5",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#ec4899",
                          ].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                newHabit.color === color
                                  ? "ring-2 ring-offset-2 ring-gray-500"
                                  : ""
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                setNewHabit({ ...newHabit, color })
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
                  onClick={handleAddHabit}
                >
                  Add Habit
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
                  onClick={() => setShowAddHabitModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Settings Modal */}
    <AnimatePresence>
      {showSettingsModal && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowSettingsModal(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Settings
                  </h3>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Account
                      </h4>
                      <div className="mt-3 flex items-center">
                        <img
                          src={mockUser.avatar}
                          alt="User"
                          className="h-12 w-12 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {mockUser.name}
                          </div>
                          <button className="mt-1 text-xs text-primary-600">
                            Change profile picture
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h4>
                      <div className="mt-3 space-y-4">
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="reminders"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="reminders"
                              className="font-medium text-gray-700"
                            >
                              Daily Reminders
                            </label>
                            <p className="text-gray-500">
                              Receive notifications for habits you haven't
                              completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="weekly-summary"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="weekly-summary"
                              className="font-medium text-gray-700"
                            >
                              Weekly Summary
                            </label>
                            <p className="text-gray-500">
                              Get a weekly report of your habit progress
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm font-medium text-gray-900">
                        Theme
                      </h4>
                      <div className="mt-3">
                        <div className="flex items-center space-x-3">
                          <button className="h-8 w-8 rounded-full bg-white border border-gray-300 ring-2 ring-offset-2 ring-primary-500"></button>
                          <button className="h-8 w-8 rounded-full bg-gray-900"></button>
                          <button className="h-8 w-8 rounded-full bg-primary-600"></button>
                          <button className="h-8 w-8 rounded-full bg-secondary-600"></button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm font-medium text-gray-900">
                        Data Management
                      </h4>
                      <div className="mt-3 space-y-3">
                        <button className="text-sm text-primary-600">
                          Export Data
                        </button>
                        <div className="block">
                          <button className="text-sm text-red-600">
                            Reset All Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
                  onClick={() => setShowSettingsModal(false)}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  </div>
);
}
