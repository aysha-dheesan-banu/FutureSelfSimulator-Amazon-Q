import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AvatarSelector } from "@/components/avatar-selector";
import { User, Sparkles, Mail, UserCircle, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  // Use the data URL directly
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiM2QjcyODAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM2QjcyODAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=");
  const [gender, setGender] = useState(user?.preferences?.gender || "other");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarUrl(user.avatarUrl || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiM2QjcyODAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM2QjcyODAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=");
      setGender(user.preferences?.gender || "other");
    }
  }, [user]);
  
  // Handle form submission for demo purposes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    if (!name.trim()) {
      setFormError("Name is required");
      toast({
        title: "Validation error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address");
      toast({
        title: "Validation error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        // Create updated user object
        const updatedUser = {
          ...user,
          name,
          email,
          avatarUrl,
          preferences: {
            ...user?.preferences,
            gender: gender as "male" | "female" | "other"
          }
        };
        
        // Update the user in context
        if (setUser) {
          setUser(updatedUser);
        }
        
        // Update the mock user data in window for persistence
        if (typeof window !== 'undefined' && window.mockUserData) {
          window.mockUserData = {
            ...window.mockUserData,
            name,
            email,
            avatarUrl,
            preferences: {
              ...window.mockUserData.preferences,
              gender: gender as "male" | "female" | "other"
            }
          };
        }
        
        console.log("Profile updated successfully:", updatedUser);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      } catch (error) {
        console.error("Profile update error:", error);
        
        setFormError("Failed to update your profile");
        
        toast({
          title: "Update failed",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                      />
                      <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-lg">
                        <UserCircle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{user?.name || user?.username}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    
                    <div className="mt-6 w-full">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="font-medium flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                          Your Progress
                        </h3>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Level</span>
                            <span className="font-medium">{user?.level || 1}</span>
                          </div>
                          <div className="h-2 w-full bg-blue-100 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Points</span>
                            <span className="font-medium">{user?.points || 0}</span>
                          </div>
                          <div className="h-2 w-full bg-blue-100 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 md:border-l md:pl-6">
                  <h3 className="text-lg font-medium mb-4">Edit Profile</h3>
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <AvatarSelector 
                      selected={avatarUrl} 
                      onSelect={setAvatarUrl} 
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <div className="flex space-x-4">
                        {["male", "female", "other"].map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={gender === option}
                              onChange={() => setGender(option)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              disabled={isSubmitting}
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Add mock user data to window for demo purposes
if (typeof window !== 'undefined') {
  window.mockUserData = {
    id: 1,
    username: "demo",
    email: "demo@example.com",
    name: "Demo User",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=",
    level: 1,
    points: 120,
    preferences: { gender: "female", theme: "light" }
  };
}