import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { getMockHabitPlan } from "./mock-data";
import { generateHabitPlan } from "./habit-plan-generator";

interface HabitPlanFormProps {
  onSuccess?: (plan: string) => void;
}

export function HabitPlanForm({ onSuccess }: HabitPlanFormProps) {
  const { toast } = useToast();
  const [habitDescription, setHabitDescription] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  
  // Generate habit plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      try {
        // Always generate a direct habit plan based on the user's input
        console.log("Generating personalized habit plan for:", habitDescription);
        const personalizedPlan = generateHabitPlan(habitDescription);
        return { plan: personalizedPlan };
        
        /* Commenting out API calls for now to ensure personalized responses
        const response = await apiRequest("POST", "/api/coach/habit-plan", {
          habitDescription
        });
        return response.json();
        */
      } catch (error) {
        console.log("Error generating habit plan:", error);
        // Generate a direct plan even if there's an error
        const personalizedPlan = generateHabitPlan(habitDescription);
        return { plan: personalizedPlan };
      }
    },
    onSuccess: (data) => {
      setPlan(data.plan);
      toast({
        title: "Success",
        description: "Your habit plan has been generated.",
        variant: "default",
      });
      
      if (onSuccess) {
        onSuccess(data.plan);
      }
    },
    onError: (error) => {
      console.error("Habit plan generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate habit plan. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitDescription.trim() && !generatePlanMutation.isPending) {
      generatePlanMutation.mutate();
    }
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea 
          placeholder="What habit do you want to develop or change?"
          value={habitDescription}
          onChange={(e) => setHabitDescription(e.target.value)}
          className="min-h-[120px]"
          disabled={generatePlanMutation.isPending}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!habitDescription.trim() || generatePlanMutation.isPending}
            className="flex items-center"
          >
            {generatePlanMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Habit Plan
              </>
            )}
          </Button>
        </div>
      </form>
      
      {generatePlanMutation.isPending && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-gray-500">Creating your personalized habit building plan...</p>
        </div>
      )}
      
      {plan && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: plan.replace(/\n/g, '<br>') }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}