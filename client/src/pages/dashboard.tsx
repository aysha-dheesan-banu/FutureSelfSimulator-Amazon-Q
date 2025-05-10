import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Sparkles, Target, Repeat, BookOpen, TrendingUp, Award } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Track your progress and shape your future</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Award className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm font-medium text-blue-700">Level {user?.level || 1}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <img
                  src={user?.avatarUrl || "/avatars/neutral-1.png"}
                  alt="Avatar"
                  className="h-7 w-7 rounded-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">
                {user?.name || user?.username}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Goals</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="text-green-500 font-medium">67%</span> completion rate
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Habits</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Repeat className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="text-green-500 font-medium">4 day</span> streak
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Journal Entries</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="text-green-500 font-medium">+2</span> this week
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="text-2xl font-bold">{user?.points || 120}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="text-green-500 font-medium">+15</span> since yesterday
              </div>
            </div>
          </div>
          
          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/goals">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Goals</h2>
                </div>
                <p className="text-gray-600 mb-4">Set, track, and achieve your personal and professional goals.</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">3 active goals</div>
                  <Button variant="outline" size="sm">Manage Goals</Button>
                </div>
              </div>
            </Link>
            
            <Link href="/habits">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
                    <Repeat className="h-6 w-6 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Habits</h2>
                </div>
                <p className="text-gray-600 mb-4">Build positive habits with our science-based tracking system.</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">5 active habits</div>
                  <Button variant="outline" size="sm">Manage Habits</Button>
                </div>
              </div>
            </Link>
            
            <Link href="/journal">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Journal</h2>
                </div>
                <p className="text-gray-600 mb-4">Record your thoughts with AI-powered sentiment analysis.</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Last entry: Today</div>
                  <Button variant="outline" size="sm">Write Entry</Button>
                </div>
              </div>
            </Link>
          </div>
          
          {/* FuturePredict Feature */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-3/5 p-8">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
                  <h2 className="text-2xl font-bold text-white">FuturePredict</h2>
                </div>
                <p className="text-blue-100 mb-6">
                  Our AI-powered feature analyzes your data to predict your future trajectory across multiple life dimensions.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="h-2 w-16 bg-blue-200 bg-opacity-30 rounded-full mr-2">
                        <div className="h-2 w-3/4 bg-yellow-300 rounded-full"></div>
                      </div>
                      <span className="text-xs font-medium text-white">Career</span>
                    </div>
                    <div className="text-xs text-blue-100">Improving trajectory</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="h-2 w-16 bg-blue-200 bg-opacity-30 rounded-full mr-2">
                        <div className="h-2 w-1/2 bg-yellow-300 rounded-full"></div>
                      </div>
                      <span className="text-xs font-medium text-white">Health</span>
                    </div>
                    <div className="text-xs text-blue-100">Stable trajectory</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="h-2 w-16 bg-blue-200 bg-opacity-30 rounded-full mr-2">
                        <div className="h-2 w-4/5 bg-yellow-300 rounded-full"></div>
                      </div>
                      <span className="text-xs font-medium text-white">Relationships</span>
                    </div>
                    <div className="text-xs text-blue-100">Improving trajectory</div>
                  </div>
                </div>
                <Link href="/future-predict">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Predict My Future
                  </Button>
                </Link>
              </div>
              <div className="md:w-2/5 bg-blue-600 p-8 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 h-20 w-20 bg-yellow-300 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-8 -right-8 h-16 w-16 bg-blue-300 rounded-full opacity-20"></div>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white bg-opacity-10 mb-4">
                      <TrendingUp className="h-12 w-12 text-white" />
                    </div>
                    <div className="text-white font-bold text-xl">Positive Trajectory</div>
                    <div className="text-blue-200 text-sm mt-1">Based on your current habits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}