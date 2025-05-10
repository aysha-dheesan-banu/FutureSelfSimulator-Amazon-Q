import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  timelineYear: number;
  profile: any;
}

export function PredictionModal({ isOpen, onClose, timelineYear, profile }: PredictionModalProps) {
  const [prediction, setPrediction] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animationStep, setAnimationStep] = useState<number>(0);

  // Generate a prediction based on the timeline year and profile
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setPrediction("");
      setAnimationStep(0);
      
      // Simulate API call with timeout
      const timer = setTimeout(() => {
        const generatedPrediction = generatePrediction(timelineYear, profile);
        setPrediction(generatedPrediction);
        setIsLoading(false);
        
        // Start the animation sequence
        setAnimationStep(1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, timelineYear, profile]);
  
  // Animation sequence
  useEffect(() => {
    if (animationStep > 0 && animationStep < 4) {
      const timer = setTimeout(() => {
        setAnimationStep(animationStep + 1);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [animationStep]);

  // Generate prediction text based on timeline and profile
  const generatePrediction = (years: number, profile: any): string => {
    if (!profile) return "Unable to generate prediction. Please complete your profile.";
    
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + years;
    
    const career = profile.career || "your career";
    const education = profile.education || "your education";
    const location = profile.location || "your location";
    const skills = Array.isArray(profile.skills) && profile.skills.length > 0 
      ? profile.skills.join(", ") 
      : "your skills";
    
    // Different predictions based on timeline
    if (years === 1) {
      return `By ${futureYear}, you'll be making significant progress in ${career}. 
      You'll have expanded your knowledge in ${education} and started building valuable connections.
      Your dedication to learning ${skills} will begin to pay off with new opportunities.
      This is just the beginning of your journey, but you're already on the right path!`;
    } 
    else if (years === 5) {
      return `In ${futureYear}, you'll have established yourself as a respected professional in ${career}.
      Your investment in ${education} will have given you expertise that sets you apart from others.
      Living in ${location}, you'll have built a fulfilling life balancing work and personal growth.
      Your mastery of ${skills} will open doors to leadership positions and exciting projects.
      The foundation you're building now will support this impressive future!`;
    }
    else if (years === 10) {
      return `By ${futureYear}, you'll have achieved remarkable success in ${career}.
      Your dedication to ${education} will have positioned you as a thought leader in your field.
      You'll be living your dream life in ${location}, with the financial freedom to pursue your passions.
      Your expertise in ${skills} will have created opportunities you can't even imagine today.
      The consistent work you're doing now will transform into an extraordinary future!`;
    }
    
    return "Please select a timeline year to see your future prediction.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            Your Future Prediction
            <Sparkles className="h-5 w-5 ml-2 text-yellow-500" />
          </DialogTitle>
          <DialogDescription>
            {timelineYear === 0 ? "Your current state" : 
             timelineYear === 1 ? "One year from now" : 
             timelineYear === 5 ? "Five years from now" : 
             "Ten years from now"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-sm text-gray-500">Analyzing your profile and generating prediction...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={cn(
                "transition-opacity duration-500",
                animationStep >= 1 ? "opacity-100" : "opacity-0"
              )}>
                <h3 className="text-lg font-medium">Your Future in {new Date().getFullYear() + timelineYear}</h3>
              </div>
              
              <div className={cn(
                "p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 transition-all duration-500",
                animationStep >= 2 ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
              )}>
                <p className="whitespace-pre-line text-gray-700">{prediction}</p>
              </div>
              
              <div className={cn(
                "transition-opacity duration-500",
                animationStep >= 3 ? "opacity-100" : "opacity-0"
              )}>
                <p className="text-sm text-gray-500 italic">
                  This prediction is based on your current profile and goals. Update your profile to refine your future vision.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}