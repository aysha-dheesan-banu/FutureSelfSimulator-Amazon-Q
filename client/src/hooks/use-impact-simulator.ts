import { useState, useEffect } from "react";
import { simulateImpact } from "@/lib/openai";

export function useImpactSimulator(timelineYear: number) {
  const [dailyLearning, setDailyLearning] = useState(30); // minutes/day
  const [weeklyExercise, setWeeklyExercise] = useState(3); // days/week
  const [savingsPercent, setSavingsPercent] = useState(15); // percentage
  
  const [careerGrowth, setCareerGrowth] = useState("");
  const [healthImprovement, setHealthImprovement] = useState("");
  const [wealthAccumulation, setWealthAccumulation] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Update impact projections when inputs change
  useEffect(() => {
    const updateSimulation = async () => {
      setIsLoading(true);
      try {
        const impact = await simulateImpact(
          dailyLearning,
          weeklyExercise,
          savingsPercent,
          timelineYear
        );
        
        setCareerGrowth(impact.careerGrowth);
        setHealthImprovement(impact.healthImprovement);
        setWealthAccumulation(impact.wealthAccumulation);
      } catch (error) {
        console.error("Error simulating impact:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    updateSimulation();
  }, [dailyLearning, weeklyExercise, savingsPercent, timelineYear]);
  
  return {
    // Inputs
    dailyLearning,
    setDailyLearning,
    weeklyExercise,
    setWeeklyExercise,
    savingsPercent,
    setSavingsPercent,
    
    // Outputs
    careerGrowth,
    healthImprovement,
    wealthAccumulation,
    
    isLoading
  };
}
