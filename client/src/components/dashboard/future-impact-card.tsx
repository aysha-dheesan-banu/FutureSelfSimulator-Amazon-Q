import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useImpactSimulator } from "@/hooks/use-impact-simulator";

interface FutureImpactCardProps {
  timelineYear: number;
}

export default function FutureImpactCard({ timelineYear }: FutureImpactCardProps) {
  const {
    dailyLearning,
    setDailyLearning,
    weeklyExercise,
    setWeeklyExercise,
    savingsPercent,
    setSavingsPercent,
    careerGrowth,
    healthImprovement,
    wealthAccumulation,
    isLoading
  } = useImpactSimulator(timelineYear);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium text-gray-900">Impact Simulator</h3>
        <p className="mt-1 text-sm text-gray-500">See how your daily choices affect your future</p>
        
        <div className="mt-4 space-y-3">
          <div className="relative">
            <div className="flex justify-between">
              <label htmlFor="daily-learning" className="block text-sm font-medium text-gray-700">Daily Learning</label>
              <span className="text-xs text-gray-500">{dailyLearning} min/day</span>
            </div>
            <Slider
              id="daily-learning"
              min={0}
              max={120}
              step={5}
              value={[dailyLearning]}
              onValueChange={(values) => setDailyLearning(values[0])}
              className="mt-1"
            />
            <div className="mt-1 text-xs text-green-600">{isLoading ? "Calculating..." : careerGrowth}</div>
          </div>
          
          <div className="relative">
            <div className="flex justify-between">
              <label htmlFor="exercise-frequency" className="block text-sm font-medium text-gray-700">Weekly Exercise</label>
              <span className="text-xs text-gray-500">{weeklyExercise} days/week</span>
            </div>
            <Slider
              id="exercise-frequency"
              min={0}
              max={7}
              step={1}
              value={[weeklyExercise]}
              onValueChange={(values) => setWeeklyExercise(values[0])}
              className="mt-1"
            />
            <div className="mt-1 text-xs text-green-600">{isLoading ? "Calculating..." : healthImprovement}</div>
          </div>
          
          <div className="relative">
            <div className="flex justify-between">
              <label htmlFor="savings-percent" className="block text-sm font-medium text-gray-700">Income Saved</label>
              <span className="text-xs text-gray-500">{savingsPercent}%</span>
            </div>
            <Slider
              id="savings-percent"
              min={0}
              max={50}
              step={1}
              value={[savingsPercent]}
              onValueChange={(values) => setSavingsPercent(values[0])}
              className="mt-1"
            />
            <div className="mt-1 text-xs text-green-600">{isLoading ? "Calculating..." : wealthAccumulation}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button variant="link" asChild className="p-0 h-auto text-sm font-medium text-primary hover:text-primary/80">
            <Link href="/future-self">
              Full simulation <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
