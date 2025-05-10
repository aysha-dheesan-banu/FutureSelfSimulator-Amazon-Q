import { useState } from "react";
import { PredictionModal } from "./prediction-modal";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface FutureTimelineControllerProps {
  value: number;
  onChange: (value: number) => void;
  profile: any;
}

export function FutureTimelineController({ value, onChange, profile }: FutureTimelineControllerProps) {
  const [showPrediction, setShowPrediction] = useState(false);
  
  const handleTimelineChange = (newValue: number) => {
    onChange(newValue);
    
    // Only show prediction for future years (not "Now")
    if (newValue > 0) {
      setShowPrediction(true);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="text-sm text-gray-500 mb-2 text-center">Explore your future timeline:</div>
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant={value === 0 ? "default" : "outline"}
            onClick={() => handleTimelineChange(0)}
            className="flex flex-col items-center py-3"
          >
            <span className="text-lg font-bold">Now</span>
            <span className="text-xs mt-1">Present</span>
          </Button>
          
          <Button 
            variant={value === 1 ? "default" : "outline"}
            onClick={() => handleTimelineChange(1)}
            className="flex flex-col items-center py-3"
          >
            <span className="text-lg font-bold">+1</span>
            <span className="text-xs mt-1">Year</span>
            <Sparkles className="h-3 w-3 mt-1 text-yellow-500" />
          </Button>
          
          <Button 
            variant={value === 5 ? "default" : "outline"}
            onClick={() => handleTimelineChange(5)}
            className="flex flex-col items-center py-3"
          >
            <span className="text-lg font-bold">+5</span>
            <span className="text-xs mt-1">Years</span>
            <Sparkles className="h-3 w-3 mt-1 text-yellow-500" />
          </Button>
          
          <Button 
            variant={value === 10 ? "default" : "outline"}
            onClick={() => handleTimelineChange(10)}
            className="flex flex-col items-center py-3"
          >
            <span className="text-lg font-bold">+10</span>
            <span className="text-xs mt-1">Years</span>
            <Sparkles className="h-3 w-3 mt-1 text-yellow-500" />
          </Button>
        </div>
        
        <div className="text-xs text-center mt-2 text-primary">
          Click on a future year to see detailed predictions
        </div>
      </div>
      
      {/* Prediction Modal */}
      <PredictionModal 
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        timelineYear={value}
        profile={profile}
      />
    </>
  );
}