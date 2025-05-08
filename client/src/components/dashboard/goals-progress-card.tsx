import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Goal } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function GoalsProgressCard() {
  const { user } = useAuth();
  
  const { data: goals, isLoading } = useQuery<Goal[]>({
    queryKey: [user ? `/api/users/${user.id}/goals` : null],
    enabled: !!user
  });
  
  const activeGoalsCount = goals?.filter(goal => !goal.completed).length || 0;
  
  // Function to format due date
  const formatDueDate = (dueDate: string | Date | undefined) => {
    if (!dueDate) return "No due date";
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 0) return "Overdue";
    if (diffDays < 7) return `Due in ${diffDays} days`;
    if (diffDays < 30) return `Due in ${Math.floor(diffDays / 7)} weeks`;
    if (diffDays < 365) return `Due in ${Math.floor(diffDays / 30)} months`;
    return `Due in ${Math.floor(diffDays / 365)} years`;
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between animate-pulse">
            <h3 className="text-lg font-medium text-gray-900">Goal Progress</h3>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2"></div>
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
          <h3 className="text-lg font-medium text-gray-900">Goal Progress</h3>
          {goals && goals.length > 0 && (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
              {activeGoalsCount} active
            </Badge>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
              <div key={goal.id} className="relative">
                <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>{goal.category}</span>
                  <span>{formatDueDate(goal.dueDate)}</span>
                </div>
                <Progress 
                  value={goal.progress} 
                  className="mt-1 h-2" 
                  indicatorClassName={
                    goal.category === "Career" ? "bg-primary" :
                    goal.category === "Health" ? "bg-secondary-500" : 
                    "bg-accent-500"
                  }
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No goals set yet</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button variant="link" asChild className="p-0 h-auto text-sm font-medium text-primary hover:text-primary/80">
            <Link href="/goals">
              View all goals <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
