import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Check, X, Calendar, Target, ChevronRight, Clock, Tag } from "lucide-react";

// Mock goal data
const mockGoals = [
  {
    id: 1,
    title: "Complete JavaScript course",
    description: "Finish the advanced JavaScript course on Udemy",
    progress: 75,
    targetDate: "2023-12-31",
    status: "in_progress",
    category: "career"
  },
  {
    id: 2,
    title: "Run 5K",
    description: "Train for and complete a 5K run",
    progress: 60,
    targetDate: "2023-11-15",
    status: "in_progress",
    category: "health"
  },
  {
    id: 3,
    title: "Read 12 books this year",
    description: "Read one book per month to expand knowledge",
    progress: 50,
    targetDate: "2023-12-31",
    status: "in_progress",
    category: "personal"
  }
];

interface Goal {
  id: number;
  title: string;
  description?: string;
  progress: number;
  targetDate?: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  category?: string;
}

export default function GoalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "personal"
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddGoal = () => {
    if (!newGoal.title) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: goals.length + 1,
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      targetDate: newGoal.targetDate,
      status: "not_started",
      category: newGoal.category
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      targetDate: "",
      category: "personal"
    });
    setShowAddForm(false);

    toast({
      title: "Goal added",
      description: "Your new goal has been added successfully",
    });
  };

  const updateGoalProgress = (id: number, progress: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const status = progress >= 100 ? "completed" : "in_progress";
        return { ...goal, progress, status };
      }
      return goal;
    }));

    toast({
      title: "Progress updated",
      description: "Goal progress has been updated",
    });
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "career":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          progress: "bg-blue-500"
        };
      case "health":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          progress: "bg-green-500"
        };
      case "finance":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          progress: "bg-yellow-500"
        };
      case "relationships":
        return {
          bg: "bg-pink-100",
          text: "text-pink-800",
          border: "border-pink-200",
          progress: "bg-pink-500"
        };
      default:
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-200",
          progress: "bg-purple-500"
        };
    }
  };

  const filteredGoals = activeCategory 
    ? goals.filter(goal => goal.category === activeCategory)
    : goals;

  const categories = Array.from(new Set(goals.map(goal => goal.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Goals</h1>
              <p className="text-sm text-gray-500 mt-1">Set, track, and achieve your personal goals</p>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-gradient-to-r from-blue-500 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button 
              variant={activeCategory === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              All Goals
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

          {/* Add goal form */}
          {showAddForm && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                Add New Goal
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Enter goal title"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Enter goal description"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date
                    </label>
                    <Input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="personal">Personal</option>
                      <option value="career">Career</option>
                      <option value="health">Health</option>
                      <option value="finance">Finance</option>
                      <option value="relationships">Relationships</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddGoal} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                    Save Goal
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Goals list */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filteredGoals.length > 0 ? (
              filteredGoals.map((goal) => {
                const colorScheme = getCategoryColor(goal.category);
                return (
                  <div 
                    key={goal.id} 
                    className={`bg-white rounded-lg shadow-sm border-l-4 ${colorScheme.border} hover:shadow-md transition-shadow`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${colorScheme.bg} ${colorScheme.text}`}>
                              {goal.category}
                            </span>
                            {goal.status === "completed" && (
                              <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">
                                Completed
                              </span>
                            )}
                          </div>
                          {goal.description && (
                            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                          )}
                          <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3 gap-3">
                            {goal.targetDate && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Target className="h-3 w-3 mr-1" />
                              <span>Progress: {goal.progress}%</span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full mb-3">
                            <div
                              className={`h-2 rounded-full ${colorScheme.progress}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[0, 25, 50, 75, 100].map((progress) => (
                              <button
                                key={progress}
                                onClick={() => updateGoalProgress(goal.id, progress)}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  goal.progress === progress
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                disabled={goal.status === "completed"}
                              >
                                {progress}%
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No goals</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new goal.</p>
                <div className="mt-6">
                  <Button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Goal
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