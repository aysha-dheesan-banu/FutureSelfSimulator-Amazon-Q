import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (url: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  // Collection of avatar options
  const avatarOptions = [
    {
      id: "avatar1",
      url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      alt: "Male avatar with short hair"
    },
    {
      id: "avatar2",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      alt: "Female avatar with blonde hair"
    },
    {
      id: "avatar3",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      alt: "Male avatar with glasses"
    },
    {
      id: "avatar4",
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      alt: "Female avatar with brown hair"
    },
    {
      id: "avatar5",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      alt: "Male avatar with dark hair"
    },
    {
      id: "avatar6",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      alt: "Female avatar with red hair"
    }
  ];
  
  // Find the selected avatar in options, or default to first
  const selectedAvatarId = avatarOptions.find(avatar => avatar.url === selectedAvatar)?.id || avatarOptions[0].id;
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Avatar className="h-32 w-32 mx-auto">
          <AvatarImage src={selectedAvatar} alt="Selected avatar" />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <p className="text-sm text-gray-500 mt-2">Your future self avatar</p>
      </div>
      
      <RadioGroup
        defaultValue={selectedAvatarId}
        onValueChange={(value) => {
          const selectedOption = avatarOptions.find(avatar => avatar.id === value);
          if (selectedOption) {
            onSelect(selectedOption.url);
          }
        }}
        className="grid grid-cols-3 gap-4"
      >
        {avatarOptions.map((avatar) => (
          <div key={avatar.id} className="text-center">
            <Label
              htmlFor={avatar.id}
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Avatar className="h-16 w-16 border-2 border-transparent hover:border-primary-300 transition-all">
                <AvatarImage src={avatar.url} alt={avatar.alt} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <RadioGroupItem
                value={avatar.id}
                id={avatar.id}
                className="sr-only"
              />
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        Select an avatar that represents how you see your future self
      </p>
    </div>
  );
}
