import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTimeline } from "@/hooks/use-timeline";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { saveProfileToStorage, loadProfileFromStorage } from "@/lib/profile-storage";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import AvatarSelector from "@/components/profile/avatar-selector";
import TraitQuiz from "@/components/profile/trait-quiz";
import ProfileDisplay from "@/components/profile/profile-display";
import CurrentStateForm from "@/components/profile/current-state-form";
import FutureVisionForm from "@/components/profile/future-vision-form";
import { FutureProfile } from "@shared/schema";
import { CurrentState, FutureVision, StatusType } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FutureTimelineController } from "@/components/future-prediction/future-timeline-controller";

export default function FutureSelf() {
  // Get user from localStorage as a fallback if context is not available
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("futureUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Error parsing stored user", e);
    }
  }, []);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const { timelineYear, updateTimelineYear, baseProfile, projectedProfile, isLoading } = useTimeline();
  
  // State for the avatar
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  
  // State for future vision
  const [futureVision, setFutureVision] = useState<FutureVision>({
    career: "",
    education: "",
    health: "",
    wealth: "",
    relationships: "",
    location: "",
    personalGrowth: "",
    skills: [],
    hobbies: []
  });
  
  // State for current state
  const [currentState, setCurrentState] = useState<CurrentState>({
    statusType: "professional",
    education: "",
    health: "",
    wealth: "",
    relationships: "",
    location: "",
    skills: [],
    hobbies: []
  });
  
  // Combined form data for API submission
  const formData: Partial<FutureProfile> = {
    avatarUrl,
    career: futureVision.career,
    education: futureVision.education,
    health: futureVision.health,
    wealth: futureVision.wealth,
    relationships: futureVision.relationships,
    location: futureVision.location,
    personalGrowth: futureVision.personalGrowth,
    skills: futureVision.skills,
    hobbies: futureVision.hobbies,
    currentState
  };
  
  // Create/update future profile
  const profileMutation = useMutation({
    mutationFn: async (data: Partial<FutureProfile>) => {
      try {
        // Prepare the data - ensure arrays are properly formatted
        const preparedData = { ...data };
        
        // Convert skills and hobbies to arrays if they're strings
        if (typeof preparedData.skills === 'string') {
          preparedData.skills = (preparedData.skills as string).split(',').map(s => s.trim());
        }
        
        if (typeof preparedData.hobbies === 'string') {
          preparedData.hobbies = (preparedData.hobbies as string).split(',').map(s => s.trim());
        }
        
        console.log("Submitting profile data:", preparedData);
        
        if (baseProfile) {
          // Update existing profile
          const response = await apiRequest("PATCH", `/api/future-profiles/${baseProfile.id}`, preparedData);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
          }
          return response.json();
        } else {
          // Create new profile
          // Ensure userId is a number within PostgreSQL integer range
          const userId = typeof user?.id === 'number' ? Math.min(user.id, 2147483647) : 1;
          console.log("Using userId:", userId);
          
          const response = await apiRequest("POST", "/api/future-profiles", {
            userId: userId,
            ...preparedData
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create profile");
          }
          return response.json();
        }
      } catch (error) {
        console.error("Profile mutation error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate cache to refetch profile
      queryClient.invalidateQueries({ queryKey: [user ? `/api/future-profiles/${user.id}` : null] });
      
      // Store the profile data in localStorage for persistence
      if (user) {
        saveProfileToStorage(user.id, data);
      }
      
      toast({
        title: "Success",
        description: "Your future self profile has been updated.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Profile mutation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Initialize form data when profile loads
  useEffect(() => {
    // First try to load from API response (baseProfile)
    if (baseProfile) {
      // Set avatar
      setAvatarUrl(baseProfile.avatarUrl || user?.avatarUrl || "");
      
      // Set future vision
      setFutureVision({
        career: baseProfile.career || "",
        education: baseProfile.education || "",
        health: baseProfile.health || "",
        wealth: baseProfile.wealth || "",
        relationships: baseProfile.relationships || "",
        location: baseProfile.location || "",
        personalGrowth: baseProfile.personalGrowth || "",
        skills: baseProfile.skills || [],
        hobbies: baseProfile.hobbies || []
      });
      
      // Set current state if available
      if (baseProfile.currentState) {
        setCurrentState(baseProfile.currentState as CurrentState);
      }
    } 
    // If no baseProfile from API, try to load from localStorage
    else if (user) {
      const storedProfile = loadProfileFromStorage(user.id);
      
      if (storedProfile) {
        console.log("Loaded profile from localStorage:", storedProfile);
        
        // Set avatar
        setAvatarUrl(storedProfile.avatarUrl || user?.avatarUrl || "");
        
        // Set future vision
        setFutureVision({
          career: storedProfile.career || "",
          education: storedProfile.education || "",
          health: storedProfile.health || "",
          wealth: storedProfile.wealth || "",
          relationships: storedProfile.relationships || "",
          location: storedProfile.location || "",
          personalGrowth: storedProfile.personalGrowth || "",
          skills: storedProfile.skills || [],
          hobbies: storedProfile.hobbies || []
        });
        
        // Set current state if available
        if (storedProfile.currentState) {
          setCurrentState(storedProfile.currentState as CurrentState);
        }
      }
    }
  }, [baseProfile, user]);
  
  const handleAvatarSelect = (url: string) => {
    setAvatarUrl(url);
  };
  
  const handleTraitUpdate = (traits: Record<string, any>) => {
    // This would be used to update user traits
    console.log(traits);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all data for submission
    const submissionData: Partial<FutureProfile> = {
      avatarUrl,
      career: futureVision.career,
      education: futureVision.education,
      health: futureVision.health,
      wealth: futureVision.wealth,
      relationships: futureVision.relationships,
      location: futureVision.location,
      personalGrowth: futureVision.personalGrowth,
      skills: futureVision.skills,
      hobbies: futureVision.hobbies,
      currentState
    };
    
    console.log("Submitting combined profile data:", submissionData);
    profileMutation.mutate(submissionData);
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pb-5 border-b border-gray-200 flex flex-wrap items-center justify-between">
              <h2 className="text-xl font-bold leading-6 text-gray-900 mb-2 sm:mb-0">
                My Future Self
              </h2>
              
              {/* Import from future-prediction folder instead of dashboard */}
              <div className="w-full sm:w-auto mt-3 sm:mt-0">
                <FutureTimelineController 
                  value={timelineYear} 
                  onChange={updateTimelineYear}
                  profile={projectedProfile}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                  <TabsTrigger value="profile">Future Profile</TabsTrigger>
                  <TabsTrigger value="quiz">Personality Quiz</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Avatar</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AvatarSelector 
                            selectedAvatar={avatarUrl} 
                            onSelect={handleAvatarSelect} 
                          />
                        </CardContent>
                      </Card>
                      
                      {/* Add the profile display component */}
                      <div className="mt-6">
                        <ProfileDisplay 
                          profile={{...futureVision, currentState, avatarUrl}} 
                          timelineYears={timelineYear} 
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>My Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleSubmit} className="space-y-6">
                            <Tabs defaultValue="current" className="w-full">
                              <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="current">Current State</TabsTrigger>
                                <TabsTrigger value="future">Future Vision</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="current" className="mt-4 space-y-4">
                                <p className="text-sm text-gray-500 mb-4">
                                  Tell us about your current situation. This helps us create more meaningful projections for your future self.
                                </p>
                                <CurrentStateForm 
                                  value={currentState} 
                                  onChange={setCurrentState} 
                                />
                              </TabsContent>
                              
                              <TabsContent value="future" className="mt-4 space-y-4">
                                <p className="text-sm text-gray-500 mb-4">
                                  Describe your ideal future self. What do you aspire to become in the years ahead?
                                </p>
                                <FutureVisionForm 
                                  value={futureVision} 
                                  onChange={setFutureVision} 
                                />
                              </TabsContent>
                            </Tabs>
                            
                            <div className="pt-4 flex justify-end">
                              <Button 
                                type="submit" 
                                disabled={profileMutation.isPending}
                              >
                                {profileMutation.isPending ? "Saving..." : "Save Profile"}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="quiz" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personality Traits Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TraitQuiz onComplete={handleTraitUpdate} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
