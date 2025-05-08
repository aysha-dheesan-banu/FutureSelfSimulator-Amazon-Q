import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Habit, WeekLog } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

export default function HabitsTrackerCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: habits, isLoading } = useQuery<Habit[]>({
    queryKey: [user ? `/api/users/${user.id}/habits` : null],
    enabled: !!user
  });
  
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
  
  const handleToggleHabit = (habit: Habit) => {
    // Check if the habit was already completed today
    const today = new Date().getDay();
    const weekLog = habit.weekLog as WeekLog || Array(7).fill(false);
    const isCompleted = weekLog[today];
    
    // Toggle completion status
    toggleHabitMutation.mutate({
      id: habit.id,
      completed: !isCompleted
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between animate-pulse">
            <h3 className="text-lg font-medium text-gray-900">Daily Habits</h3>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="mt-1 w-full bg-gray-100 h-1 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Daily Habits</h3>
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
            Today
          </Badge>
        </div>
        <div className="mt-4 space-y-4">
          {habits && habits.length > 0 ? (
            habits.map((habit) => {
              // Get the week log for this habit
              const weekLog = habit.weekLog as WeekLog || Array(7).fill(false);
              
              // Check if the habit is completed today
              const today = new Date().getDay();
              const isCompletedToday = weekLog[today];
              
              return (
                <div key={habit.id} className="flex items-center">
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
                      {habit.streakCount ? (
                        <span className={cn(
                          "text-xs font-medium",
                          habit.streakCount > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {habit.streakCount > 0 
                            ? `${habit.streakCount} day streak` 
                            : "Streak lost"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">New habit</span>
                      )}
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
            })
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No habits tracked yet</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button variant="link" asChild className="p-0 h-auto text-sm font-medium text-primary hover:text-primary/80">
            <Link href="/goals">
              Add new habit <Plus className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
