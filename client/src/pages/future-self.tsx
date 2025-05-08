import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTimeline } from "@/hooks/use-timeline";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import AvatarSelector from "@/components/profile/avatar-selector";
import TraitQuiz from "@/components/profile/trait-quiz";
import { FutureProfile } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimelineController from "@/components/dashboard/timeline-controller";

export default function FutureSelf() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const { timelineYear, updateTimelineYear, baseProfile, projectedProfile, isLoading } = useTimeline();
  
  const [formData, setFormData] = useState<Partial<FutureProfile>>({
    career: "",
    education: "",
    health: "",
    wealth: "",
    relationships: "",
    location: "",
    personalGrowth: "",
    avatarUrl: ""
  });
  
  // Create/update future profile
  const profileMutation = useMutation({
    mutationFn: async (data: Partial<FutureProfile>) => {
      if (baseProfile) {
        // Update existing profile
        const response = await apiRequest("PATCH", `/api/future-profiles/${baseProfile.id}`, data);
        return response.json();
      } else {
        // Create new profile
        const response = await apiRequest("POST", "/api/future-profiles", {
          userId: user?.id,
          ...data
        });
        return response.json();
      }
    },
    onSuccess: () => {
      // Invalidate cache to refetch profile
      queryClient.invalidateQueries({ queryKey: [user ? `/api/future-profiles/${user.id}` : null] });
      toast({
        title: "Success",
        description: "Your future self profile has been updated.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Initialize form data when profile loads
  useState(() => {
    if (baseProfile) {
      setFormData({
        career: baseProfile.career || "",
        education: baseProfile.education || "",
        health: baseProfile.health || "",
        wealth: baseProfile.wealth || "",
        relationships: baseProfile.relationships || "",
        location: baseProfile.location || "",
        personalGrowth: baseProfile.personalGrowth || "",
        avatarUrl: baseProfile.avatarUrl || user?.avatarUrl || ""
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }));
  };
  
  const handleTraitUpdate = (traits: Record<string, any>) => {
    // This would be used to update user traits
    console.log(traits);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate(formData);
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
              
              <TimelineController 
                value={timelineYear} 
                onChange={updateTimelineYear} 
              />
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
                            selectedAvatar={formData.avatarUrl} 
                            onSelect={handleAvatarSelect} 
                          />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Future Self Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="career">Career</Label>
                                <Input 
                                  id="career" 
                                  name="career" 
                                  placeholder="Senior Developer"
                                  value={formData.career}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="education">Education</Label>
                                <Input 
                                  id="education" 
                                  name="education" 
                                  placeholder="Master's Degree"
                                  value={formData.education}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="health">Health</Label>
                                <Input 
                                  id="health" 
                                  name="health" 
                                  placeholder="Good health, regular fitness"
                                  value={formData.health}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="wealth">Wealth</Label>
                                <Input 
                                  id="wealth" 
                                  name="wealth" 
                                  placeholder="$95,000 annual income"
                                  value={formData.wealth}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="relationships">Relationships</Label>
                                <Input 
                                  id="relationships" 
                                  name="relationships" 
                                  placeholder="Married with supportive partner"
                                  value={formData.relationships}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input 
                                  id="location" 
                                  name="location" 
                                  placeholder="Tech hub city"
                                  value={formData.location}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="personalGrowth">Personal Growth</Label>
                                <Input 
                                  id="personalGrowth" 
                                  name="personalGrowth" 
                                  placeholder="Regular learning and development"
                                  value={formData.personalGrowth}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            
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
