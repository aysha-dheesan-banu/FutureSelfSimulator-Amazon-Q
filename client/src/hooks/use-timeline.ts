import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FutureProfile } from "@shared/schema";
import { useAuth } from "./use-auth";

export function useTimeline() {
  const { user } = useAuth();
  const [timelineYear, setTimelineYear] = useState(1);
  const queryClient = useQueryClient();
  
  // Fetch the base future profile
  const { data: baseProfile, isLoading } = useQuery<FutureProfile>({
    queryKey: [user ? `/api/future-profiles/${user.id}` : null],
    enabled: !!user
  });
  
  // Adjusted future profile based on the timeline
  const [projectedProfile, setProjectedProfile] = useState<Partial<FutureProfile> | null>(null);
  
  // Update projections when timeline or base profile changes
  useEffect(() => {
    if (baseProfile) {
      // Simple projection logic - in a real app, this would use more sophisticated calculations
      // or call an API to get projections based on the timeline
      const projectedCareer = timelineYear <= 1 
        ? baseProfile.career 
        : timelineYear <= 5
          ? "Senior Developer"
          : "Development Team Lead";
      
      const projectedEducation = timelineYear <= 2
        ? baseProfile.education
        : timelineYear <= 7
          ? "Master's Degree"
          : "Multiple Certifications";
      
      const projectedWealth = timelineYear <= 1
        ? baseProfile.wealth
        : `$${85000 + (timelineYear * 7000)} annual income`;
      
      // Update the projected profile
      setProjectedProfile({
        ...baseProfile,
        career: projectedCareer,
        education: projectedEducation,
        wealth: projectedWealth
      });
    }
  }, [baseProfile, timelineYear]);
  
  const updateTimelineYear = (years: number) => {
    setTimelineYear(years);
  };
  
  return {
    timelineYear,
    updateTimelineYear,
    baseProfile,
    projectedProfile,
    isLoading
  };
}
