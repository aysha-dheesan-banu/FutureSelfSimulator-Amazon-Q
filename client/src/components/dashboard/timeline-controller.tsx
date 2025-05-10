import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PredictionModal } from "@/components/future-prediction/prediction-modal";
import { useTimeline } from "@/hooks/use-timeline";

interface TimelineControllerProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TimelineController({ value, onChange }: TimelineControllerProps) {
  const [showPrediction, setShowPrediction] = useState(false);
  const { projectedProfile } = useTimeline();
  
  // Add debugging to track timeline changes
  const handleTimelineChange = (newValue: number) => {
    console.log(`Timeline changing from ${value} to ${newValue}`);
    onChange(newValue);
    
    // Only show prediction for future years (not "Now")
    if (newValue > 0) {
      setShowPrediction(true);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full sm:w-auto">
        <div className="text-sm text-gray-500 mb-1 text-center sm:text-right">View your future in:</div>
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => handleTimelineChange(0)} 
            className={`text-xs px-3 py-2 rounded font-medium ${value === 0 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Now
          </button>
          <button 
            type="button"
            onClick={() => handleTimelineChange(1)} 
            className={`text-xs px-3 py-2 rounded font-medium ${value === 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            1 year
          </button>
          <button 
            type="button"
            onClick={() => handleTimelineChange(5)} 
            className={`text-xs px-3 py-2 rounded font-medium ${value === 5 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            5 years
          </button>
          <button 
            type="button"
            onClick={() => handleTimelineChange(10)} 
            className={`text-xs px-3 py-2 rounded font-medium ${value === 10 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            10 years
          </button>
        </div>
        <div className="text-xs text-center mt-1 text-primary-600">
          {value === 0 ? "Current state" : 
           value === 1 ? "One year from now" : 
           value === 5 ? "Five years from now" : 
           "Ten years from now"}
        </div>
      </div>
      
      {/* Prediction Modal */}
      <PredictionModal 
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        timelineYear={value}
        profile={projectedProfile}
      />
    </>
  );
}