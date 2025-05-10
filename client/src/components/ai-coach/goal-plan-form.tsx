import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { getMockGoalPlan } from "./mock-data";
import { getSpecializedPlan } from "./specialized-plans";
import { generateGoalPlan } from "./goal-plan-generator";

interface GoalPlanFormProps {
  onSuccess?: (plan: string) => void;
}

export function GoalPlanForm({ onSuccess }: GoalPlanFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goalDescription, setGoalDescription] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  
  // Generate goal plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      try {
        // Always generate a direct goal plan based on the user's input
        console.log("Generating personalized goal plan for:", goalDescription);
        const personalizedPlan = generateGoalPlan(goalDescription);
        return { plan: personalizedPlan };
        
        /* Commenting out API calls for now to ensure personalized responses
        // If no specialized plan, try the API
        const response = await apiRequest("POST", "/api/coach/goal-plan", {
          goalDescription,
          userContext: `User is ${user?.name}, currently working on personal development.`
        });
        return response.json();
        */
      } catch (error) {
        console.log("Error generating goal plan:", error);
        // Generate a direct plan even if there's an error
        const personalizedPlan = generateGoalPlan(goalDescription);
        return { plan: personalizedPlan };
      }
    },
    onSuccess: (data) => {
      setPlan(data.plan);
      toast({
        title: "Success",
        description: "Your goal plan has been generated.",
        variant: "default",
      });
      
      if (onSuccess) {
        onSuccess(data.plan);
      }
    },
    onError: (error) => {
      console.error("Goal plan generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate goal plan. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalDescription.trim() && !generatePlanMutation.isPending) {
      generatePlanMutation.mutate();
    }
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea 
          placeholder="Describe your goal in detail..."
          value={goalDescription}
          onChange={(e) => setGoalDescription(e.target.value)}
          className="min-h-[120px]"
          disabled={generatePlanMutation.isPending}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!goalDescription.trim() || generatePlanMutation.isPending}
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
                Get Goal Plan
              </>
            )}
          </Button>
        </div>
      </form>
      
      {generatePlanMutation.isPending && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-gray-500">Analyzing your goal and creating a personalized plan...</p>
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