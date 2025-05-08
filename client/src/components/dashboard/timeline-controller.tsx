import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface TimelineControllerProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TimelineController({ value, onChange }: TimelineControllerProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };
  
  return (
    <div className="flex flex-col w-full sm:w-auto">
      <div className="text-sm text-gray-500 mb-1 text-center sm:text-right">View your future in:</div>
      <div className="flex items-center space-x-3">
        <span className="text-xs text-gray-500">Now</span>
        <Slider
          id="timeline-scrubber"
          min={0}
          max={10}
          step={1}
          value={[value]}
          onValueChange={handleChange}
          className="w-40 h-2"
        />
        <span className="text-xs text-gray-500">10 years</span>
        <Badge variant="outline" className="ml-3 bg-primary-100 text-primary-800 hover:bg-primary-200 border-0">
          {value === 1 ? "1 year" : `${value} years`}
        </Badge>
      </div>
    </div>
  );
}
