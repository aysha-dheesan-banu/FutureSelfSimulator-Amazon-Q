import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Goal, Habit, InsertGoal, InsertHabit } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Check, Trash2, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { insertGoalSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export default function Goals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("goals");
  
  // Fetch goals and habits
  const { data: goals, isLoading: isLoadingGoals } = useQuery<Goal[]>({
    queryKey: [user ? `/api/users/${user.id}/goals` : null],
    enabled: !!user
  });
  
  const { data: habits, isLoading: isLoadingHabits } = useQuery<Habit[]>({
    queryKey: [user ? `/api/users/${user.id}/habits` : null],
    enabled: !!user
  });
  
  // Goal form
  const goalForm = useForm<InsertGoal>({
    resolver: zodResolver(insertGoalSchema.extend({
      dueDate: (schema) => schema.date().optional(),
    })),
    defaultValues: {
      userId: user?.id,
      title: "",
      description: "",
      category: "Career",
      progress: 0,
      completed: false
    }
  });
  
  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (data: InsertGoal) => {
      const response = await apiRequest("POST", "/api/goals", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache to refetch goals
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/goals` : null] });
      toast({
        title: "Success",
        description: "Your goal has been created.",
        variant: "default",
      });
      goalForm.reset({
        userId: user?.id,
        title: "",
        description: "",
        category: "Career",
        progress: 0,
        completed: false
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create your goal. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update goal progress mutation
  const updateGoalProgressMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: number, progress: number }) => {
      const response = await apiRequest("PATCH", `/api/goals/${id}`, { progress });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache to refetch goals
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/goals` : null] });
    }
  });
  
  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/goals/${id}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate cache to refetch goals
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/goals` : null] });
      toast({
        title: "Success",
        description: "Your goal has been deleted.",
        variant: "default",
      });
    }
  });
  
  // Habit states
  const [newHabit, setNewHabit] = useState("");
  
  // Create habit mutation
  const createHabitMutation = useMutation({
    mutationFn: async (title: string) => {
      const data: InsertHabit = {
        userId: user?.id!,
        title,
        streakCount: 0,
        weekLog: Array(7).fill(false)
      };
      const response = await apiRequest("POST", "/api/habits", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache to refetch habits
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/habits` : null] });
      setNewHabit("");
      toast({
        title: "Success",
        description: "Your habit has been created.",
        variant: "default",
      });
    }
  });
  
  // Toggle habit completion mutation
  const toggleHabitMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number, completed: boolean }) => {
      const response = await apiRequest("PATCH", `/api/habits/${id}/complete`, { completed });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache to refetch habits
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/habits` : null] });
    }
  });
  
  // Delete habit mutation
  const deleteHabitMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/habits/${id}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate cache to refetch habits
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/habits` : null] });
      toast({
        title: "Success",
        description: "Your habit has been deleted.",
        variant: "default",
      });
    }
  });
  
  // Handle goal form submission
  const onSubmitGoal = (data: InsertGoal) => {
    createGoalMutation.mutate(data);
  };
  
  // Handle habit creation
  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim() && !createHabitMutation.isPending) {
      createHabitMutation.mutate(newHabit);
    }
  };
  
  // Handle habit toggle
  const handleToggleHabit = (habit: Habit) => {
    // Check if the habit was already completed today
    const today = new Date().getDay();
    const weekLog = habit.weekLog as boolean[] || Array(7).fill(false);
    const isCompleted = weekLog[today];
    
    // Toggle completion status
    toggleHabitMutation.mutate({
      id: habit.id,
      completed: !isCompleted
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold leading-6 text-gray-900 pb-5 border-b border-gray-200">
              Goals & Habits
            </h2>
            
            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="habits">Habits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="goals" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Create New Goal</CardTitle>
                          <CardDescription>Set a SMART goal to track your progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...goalForm}>
                            <form onSubmit={goalForm.handleSubmit(onSubmitGoal)} className="space-y-4">
                              <FormField
                                control={goalForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Goal Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Learn Machine Learning" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={goalForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Complete a certification and build a project" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={goalForm.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Career">Career</SelectItem>
                                        <SelectItem value="Health">Health</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Personal">Personal</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                        <SelectItem value="Relationships">Relationships</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={goalForm.control}
                                name="dueDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                      <div className="flex">
                                        <Input 
                                          type="date" 
                                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} 
                                          value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="pt-2">
                                <Button type="submit" disabled={createGoalMutation.isPending}>
                                  {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Goals</CardTitle>
                          <CardDescription>Track and update your progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoadingGoals ? (
                            <div className="space-y-4">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                                  <div className="flex justify-between mb-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full mb-4"></div>
                                  <div className="h-10 bg-gray-100 rounded"></div>
                                </div>
                              ))}
                            </div>
                          ) : goals && goals.length > 0 ? (
                            <div className="space-y-6">
                              {goals.map((goal) => (
                                <div key={goal.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{goal.title}</h3>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteGoalMutation.mutate(goal.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{goal.category}</span>
                                    {goal.dueDate && (
                                      <span className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {format(new Date(goal.dueDate), 'MMM d, yyyy')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Progress 
                                      value={goal.progress} 
                                      className="flex-1 h-2" 
                                      indicatorClassName={
                                        goal.category === "Career" ? "bg-primary" :
                                        goal.category === "Health" ? "bg-secondary-500" : 
                                        "bg-accent-500"
                                      }
                                    />
                                    <span className="text-sm">{goal.progress}%</span>
                                  </div>
                                  <div className="pt-2">
                                    <Label htmlFor={`progress-${goal.id}`} className="text-sm">Update Progress</Label>
                                    <div className="flex items-center space-x-4">
                                      <Slider
                                        id={`progress-${goal.id}`}
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={[goal.progress]}
                                        onValueChange={(values) => 
                                          updateGoalProgressMutation.mutate({ 
                                            id: goal.id, 
                                            progress: values[0]
                                          })
                                        }
                                        className="flex-1"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10">
                              <p className="text-gray-500">You don't have any goals yet.</p>
                              <p className="text-gray-500">Create your first goal to start tracking your progress.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="habits" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Create New Habit</CardTitle>
                          <CardDescription>Build consistency with daily habits</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleCreateHabit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="habit-title">Habit Title</Label>
                              <Input 
                                id="habit-title"
                                placeholder="Daily Meditation"
                                value={newHabit}
                                onChange={(e) => setNewHabit(e.target.value)}
                              />
                            </div>
                            <Button 
                              type="submit" 
                              disabled={!newHabit.trim() || createHabitMutation.isPending}
                            >
                              {createHabitMutation.isPending ? "Creating..." : "Create Habit"}
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Habits</CardTitle>
                          <CardDescription>Track your daily consistency</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoadingHabits ? (
                            <div className="space-y-6">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center animate-pulse">
                                  <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                                  <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-100 h-1 rounded-full"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : habits && habits.length > 0 ? (
                            <div className="space-y-6">
                              {habits.map((habit) => {
                                // Get the week log for this habit
                                const weekLog = habit.weekLog as boolean[] || Array(7).fill(false);
                                
                                // Check if the habit is completed today
                                const today = new Date().getDay();
                                const isCompletedToday = weekLog[today];
                                
                                return (
                                  <div key={habit.id} className="flex items-center group">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className={cn(
                                        "h-6 w-6 rounded-full p-0",
                                        isCompletedToday ? "bg-primary border-primary" : "border-gray-300"
                                      )}
                                      onClick={() => handleToggleHabit(habit)}
                                    >
                                      <Check className={cn(
                                        "h-3 w-3",
                                        isCompletedToday ? "text-white" : "text-transparent"
                                      )} />
                                    </Button>
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">{habit.title}</span>
                                        <div className="flex items-center">
                                          {habit.streakCount ? (
                                            <span className={cn(
                                              "text-xs font-medium mr-2",
                                              habit.streakCount > 0 ? "text-green-600" : "text-red-600"
                                            )}>
                                              {habit.streakCount > 0 
                                                ? `${habit.streakCount} day streak` 
                                                : "Streak lost"}
                                            </span>
                                          ) : (
                                            <span className="text-xs text-gray-500 font-medium mr-2">New habit</span>
                                          )}
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => deleteHabitMutation.mutate(habit.id)}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="mt-1 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                        <div className="flex">
                                          {weekLog.map((day, i) => (
                                            <div 
                                              key={i}
                                              className={cn(
                                                "h-1 w-4",
                                                i < 6 ? "mr-0.5" : "",
                                                day ? "bg-green-500" : "bg-gray-200"
                                              )}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-10">
                              <p className="text-gray-500">You don't have any habits yet.</p>
                              <p className="text-gray-500">Create your first habit to start building consistency.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
