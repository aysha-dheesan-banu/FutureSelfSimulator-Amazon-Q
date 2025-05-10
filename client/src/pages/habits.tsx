import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Check, X, Calendar, Repeat, Zap, Flame, Award, ChevronRight } from "lucide-react";

// Mock habit data
const mockHabits = [
  {
    id: 1,
    title: "Morning meditation",
    description: "10 minutes of mindfulness meditation each morning",
    frequency: "daily",
    streak: 5,
    longestStreak: 14,
    targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
    completedToday: false,
    category: "mindfulness"
  },
  {
    id: 2,
    title: "Exercise",
    description: "30 minutes of physical activity",
    frequency: "daily",
    streak: 3,
    longestStreak: 10,
    targetDays: [1, 3, 5], // Monday, Wednesday, Friday
    completedToday: true,
    category: "health"
  },
  {
    id: 3,
    title: "Read",
    description: "Read for 20 minutes",
    frequency: "daily",
    streak: 7,
    longestStreak: 21,
    targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
    completedToday: false,
    category: "learning"
  }
];

interface Habit {
  id: number;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  streak: number;
  longestStreak: number;
  targetDays?: number[];
  completedToday: boolean;
  category?: string;
}

export default function HabitsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    frequency: "daily",
    targetDays: [0, 1, 2, 3, 4, 5, 6], // Default to all days
    category: "personal"
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddHabit = () => {
    if (!newHabit.title) {
      toast({
        title: "Error",
        description: "Habit title is required",
        variant: "destructive",
      });
      return;
    }

    const habit: Habit = {
      id: habits.length + 1,
      title: newHabit.title,
      description: newHabit.description,
      frequency: newHabit.frequency as "daily" | "weekly" | "monthly",
      streak: 0,
      longestStreak: 0,
      targetDays: newHabit.targetDays,
      completedToday: false,
      category: newHabit.category
    };

    setHabits([...habits, habit]);
    setNewHabit({
      title: "",
      description: "",
      frequency: "daily",
      targetDays: [0, 1, 2, 3, 4, 5, 6],
      category: "personal"
    });
    setShowAddForm(false);

    toast({
      title: "Habit added",
      description: "Your new habit has been added successfully",
    });
  };

  const toggleHabitCompletion = (id: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completedToday = !habit.completedToday;
        const streak = completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        const longestStreak = Math.max(habit.longestStreak, streak);
        
        return { ...habit, completedToday, streak, longestStreak };
      }
      return habit;
    }));

    toast({
      title: "Habit updated",
      description: "Your habit completion has been recorded",
    });
  };

  const getDayName = (dayIndex: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayIndex];
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "health":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          accent: "text-green-500"
        };
      case "mindfulness":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          accent: "text-blue-500"
        };
      case "learning":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-200",
          accent: "text-purple-500"
        };
      case "productivity":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          accent: "text-yellow-500"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          accent: "text-gray-500"
        };
    }
  };

  const filteredHabits = activeCategory 
    ? habits.filter(habit => habit.category === activeCategory)
    : habits;

  const categories = Array.from(new Set(habits.map(habit => habit.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Habits</h1>
              <p className="text-sm text-gray-500 mt-1">Build positive habits for long-term success</p>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-gradient-to-r from-green-500 to-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                  <Flame className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Current Streak</div>
                  <div className="text-2xl font-bold">{Math.max(...habits.map(h => h.streak))} days</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <Award className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Longest Streak</div>
                  <div className="text-2xl font-bold">{Math.max(...habits.map(h => h.longestStreak))} days</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                  <Repeat className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Active Habits</div>
                  <div className="text-2xl font-bold">{habits.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button 
              variant={activeCategory === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              All Habits
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                className={`${activeCategory === category ? "" : getCategoryColor(category).text} ${activeCategory === category ? "" : getCategoryColor(category).bg}`}
                onClick={() => setActiveCategory(category)}
              >
                {category?.charAt(0).toUpperCase() + category?.slice(1)}
              </Button>
            ))}
          </div>

          {/* Add habit form */}
          {showAddForm && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-green-500" />
                Add New Habit
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    placeholder="Enter habit title"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    placeholder="Enter habit description"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newHabit.category}
                      onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                    >
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="mindfulness">Mindfulness</option>
                      <option value="learning">Learning</option>
                      <option value="productivity">Productivity</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const targetDays = newHabit.targetDays.includes(day)
                            ? newHabit.targetDays.filter(d => d !== day)
                            : [...newHabit.targetDays, day];
                          setNewHabit({ ...newHabit, targetDays });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          newHabit.targetDays.includes(day)
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {getDayName(day)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHabit} className="bg-gradient-to-r from-green-500 to-teal-600">
                    Save Habit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Habits list */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              </div>
            ) : filteredHabits.length > 0 ? (
              filteredHabits.map((habit) => {
                const colorScheme = getCategoryColor(habit.category);
                return (
                  <div 
                    key={habit.id} 
                    className={`bg-white rounded-lg shadow-sm border-l-4 ${colorScheme.border} hover:shadow-md transition-shadow`}
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{habit.title}</h3>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${colorScheme.bg} ${colorScheme.text}`}>
                              {habit.category}
                            </span>
                            <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-medium">
                              {habit.frequency}
                            </span>
                          </div>
                          {habit.description && (
                            <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                          )}
                          <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3 gap-4">
                            <div className="flex items-center">
                              <Flame className={`h-3 w-3 mr-1 ${colorScheme.accent}`} />
                              <span>Streak: {habit.streak} days</span>
                            </div>
                            <div className="flex items-center">
                              <Award className={`h-3 w-3 mr-1 ${colorScheme.accent}`} />
                              <span>Best: {habit.longestStreak} days</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {habit.targetDays?.map((day) => (
                              <span
                                key={day}
                                className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {getDayName(day)}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant={habit.completedToday ? "outline" : "default"}
                              size="sm"
                              onClick={() => toggleHabitCompletion(habit.id)}
                              className={habit.completedToday ? "border-green-500 text-green-500" : ""}
                            >
                              {habit.completedToday ? (
                                <>
                                  <Check className="h-4 w-4 mr-1 text-green-500" />
                                  Completed Today
                                </>
                              ) : (
                                "Mark Complete"
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {habit.streak > 0 && (
                            <div className="flex flex-col items-center">
                              <div className={`h-12 w-12 rounded-full ${colorScheme.bg} flex items-center justify-center`}>
                                <span className={`text-lg font-bold ${colorScheme.text}`}>{habit.streak}</span>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">days</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Repeat className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No habits</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new habit.</p>
                <div className="mt-6">
                  <Button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-green-500 to-teal-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Habit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}