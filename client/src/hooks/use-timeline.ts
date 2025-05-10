import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FutureProfile, User } from "@shared/schema";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/profile-storage";

export function useTimeline() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("futureUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }
  }, []);
  
  const [timelineYear, setTimelineYear] = useState(0); // Start with "Now" (0 years)
  const queryClient = useQueryClient();
  
  // Fetch the base future profile
  const { data: baseProfile, isLoading } = useQuery<FutureProfile>({
    queryKey: [user ? `/api/future-profiles/${user.id}` : null],
    enabled: !!user,
    // Add staleTime and cacheTime to improve caching
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    // Add onError handler to load from localStorage if API fails
    onError: (error) => {
      console.error("Error fetching profile from API:", error);
      // Try to load from localStorage
      if (user) {
        const storedProfile = loadProfileFromStorage(user.id);
        if (storedProfile) {
          console.log("Using cached profile from localStorage");
          return storedProfile;
        }
      }
    }
  });
  
  // Adjusted future profile based on the timeline
  const [projectedProfile, setProjectedProfile] = useState<Partial<FutureProfile> | null>(null);
  
  // Update projections when timeline or base profile changes
  useEffect(() => {
    console.log("Timeline year changed to:", timelineYear);
    console.log("Base profile:", baseProfile);
    
    // If no base profile, try to load from localStorage
    if (!baseProfile && user) {
      const storedProfile = loadProfileFromStorage(user.id);
      if (storedProfile) {
        console.log("Using stored profile for projections:", storedProfile);
        updateProjectionsFromProfile(storedProfile, timelineYear);
        return;
      }
    }
    
    if (baseProfile) {
      updateProjectionsFromProfile(baseProfile, timelineYear);
    }
  }, [baseProfile, timelineYear, user]);
  
  // Helper function to update projections based on a profile and timeline
  const updateProjectionsFromProfile = (profile: Partial<FutureProfile>, years: number) => {
    console.log(`Generating projections for ${years} years based on:`, profile);
    
    // Handle the "Now" case (timelineYear === 0)
    if (years === 0) {
      setProjectedProfile({
        ...profile
      });
      return;
    }
    
    // Simple projection logic - in a real app, this would use more sophisticated calculations
    // or call an API to get projections based on the timeline
    const projectedCareer = years === 1 
      ? profile.career 
      : years <= 5
        ? profile.career ? `Senior ${profile.career}` : "Senior Professional"
        : profile.career ? `${profile.career} Team Lead` : "Team Lead";
    
    const projectedEducation = years <= 2
      ? profile.education
      : years <= 7
        ? profile.education ? `${profile.education} with Advanced Certifications` : "Advanced Degree"
        : profile.education ? `${profile.education} with Specialization` : "Specialized Education";
    
    const currentWealth = profile.wealth || "Entry-level income";
    const projectedWealth = years === 1
      ? currentWealth
      : currentWealth.includes("$") 
        ? currentWealth.replace(/\$(\d+)/, (_, num) => `${parseInt(num) + (years * 7000)}`)
        : `Increased ${currentWealth} (${years * 10}% growth)`;
      
    // Generate projections for skills and relationships
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const projectedSkills = years === 0 ? skills : 
      years <= 3 ? [...skills, "Advanced Expertise"] :
      [...skills, "Advanced Expertise", "Leadership", "Mentoring"];
      
    const relationships = profile.relationships || "";
    const projectedRelationships = years === 0 ? relationships :
      years <= 2 ? relationships :
      years <= 5 ? `${relationships} with expanded network` :
      `${relationships} with strong professional connections`;
      
    // Update the projected profile with all projections
    setProjectedProfile({
      ...profile,
      career: projectedCareer,
      education: projectedEducation,
      wealth: projectedWealth,
      skills: projectedSkills,
      relationships: projectedRelationships,
      _timelineYears: years // Add this to track which projection we're viewing
    });
    
    console.log("Updated projected profile:", {
      career: projectedCareer,
      education: projectedEducation,
      wealth: projectedWealth,
      skills: projectedSkills,
      relationships: projectedRelationships,
      _timelineYears: years
    });
  };
  
  const updateTimelineYear = (years: number) => {
    console.log(`Setting timeline year to ${years}`);
    setTimelineYear(years);
    
    // If we already have a base profile or stored profile, update projections immediately
    if (baseProfile) {
      updateProjectionsFromProfile(baseProfile, years);
    } else if (user) {
      const storedProfile = loadProfileFromStorage(user.id);
      if (storedProfile) {
        updateProjectionsFromProfile(storedProfile, years);
      }
    }
  };
  
  return {
    timelineYear,
    updateTimelineYear,
    baseProfile,
    projectedProfile,
    isLoading
  };
}
