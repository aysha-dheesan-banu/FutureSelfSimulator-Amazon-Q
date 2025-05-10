import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (url: string) => void;
  userName?: string;
}

export default function AvatarSelector({ selectedAvatar, onSelect, userName = "User" }: AvatarSelectorProps) {
  // Get gender from URL parameters or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const genderParam = urlParams.get('gender');
  const storedGender = localStorage.getItem('initialUserGender');
  
  // Determine initial tab based on selected avatar, URL param, stored gender, or default to female
  let initialTab = "female"; // Default to female
  
  if (selectedAvatar?.includes("male")) {
    initialTab = "male";
  } else if (selectedAvatar?.includes("female")) {
    initialTab = "female";
  } else if (genderParam === "male" || storedGender === "male") {
    initialTab = "male";
  } else if (genderParam === "female" || storedGender === "female") {
    initialTab = "female";
  }
  
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Log for debugging
  console.log(`Avatar selector initialized with tab: ${initialTab}, based on: ${selectedAvatar || "no avatar"}, gender param: ${genderParam || "none"}, stored gender: ${storedGender || "none"}`);
  
  // Female avatar options
  const femaleAvatars = [
    "/avatars/female-1.png",
    "/avatars/female-2.png",
    "/avatars/female-3.png",
    "/avatars/female-4.png",
    "/avatars/female-5.png",
    "/avatars/female-6.png",
  ];
  
  // Male avatar options
  const maleAvatars = [
    "/avatars/male-1.png",
    "/avatars/male-2.png",
    "/avatars/male-3.png",
    "/avatars/male-4.png",
    "/avatars/male-5.png",
    "/avatars/male-6.png",
  ];
  
  // Get user's initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar className="h-24 w-24">
          {selectedAvatar ? (
            <AvatarImage src={selectedAvatar} alt="Selected avatar" />
          ) : (
            <AvatarFallback className="text-2xl">{getInitials(userName)}</AvatarFallback>
          )}
        </Avatar>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="female">Female</TabsTrigger>
          <TabsTrigger value="male">Male</TabsTrigger>
        </TabsList>
        
        <TabsContent value="female" className="mt-4">
          <RadioGroup 
            value={selectedAvatar} 
            onValueChange={onSelect}
            className="grid grid-cols-3 gap-2"
          >
            {femaleAvatars.map((avatar, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <Label 
                  htmlFor={`female-avatar-${index}`}
                  className={`cursor-pointer rounded-full p-1 ${selectedAvatar === avatar ? 'ring-2 ring-primary' : ''}`}
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatar} alt={`Female avatar ${index + 1}`} />
                  </Avatar>
                </Label>
                <RadioGroupItem 
                  value={avatar} 
                  id={`female-avatar-${index}`} 
                  className="sr-only"
                />
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="male" className="mt-4">
          <RadioGroup 
            value={selectedAvatar} 
            onValueChange={onSelect}
            className="grid grid-cols-3 gap-2"
          >
            {maleAvatars.map((avatar, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <Label 
                  htmlFor={`male-avatar-${index}`}
                  className={`cursor-pointer rounded-full p-1 ${selectedAvatar === avatar ? 'ring-2 ring-primary' : ''}`}
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatar} alt={`Male avatar ${index + 1}`} />
                  </Avatar>
                </Label>
                <RadioGroupItem 
                  value={avatar} 
                  id={`male-avatar-${index}`} 
                  className="sr-only"
                />
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
}