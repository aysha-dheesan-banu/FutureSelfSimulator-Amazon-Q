import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CurrentState, StatusType } from "@shared/types";

interface CurrentStateFormProps {
  value: CurrentState;
  onChange: (value: CurrentState) => void;
}

export default function CurrentStateForm({ value, onChange }: CurrentStateFormProps) {
  const [statusType, setStatusType] = useState<StatusType>(value.statusType || "professional");
  
  // Update both local state and parent state
  const handleStatusChange = (newStatus: StatusType) => {
    setStatusType(newStatus);
    onChange({
      ...value,
      statusType: newStatus
    });
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: inputValue } = e.target;
    onChange({
      ...value,
      [name]: inputValue
    });
  };
  
  // Handle array inputs (skills, hobbies)
  const handleArrayInputChange = (name: string, inputValue: string) => {
    const arrayValue = inputValue.split(",").map(item => item.trim()).filter(Boolean);
    onChange({
      ...value,
      [name]: arrayValue
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">I am currently a:</Label>
        <div className="flex flex-wrap gap-2">
          <Button 
            type="button"
            variant={statusType === "student" ? "default" : "outline"}
            onClick={() => handleStatusChange("student")}
          >
            Student
          </Button>
          <Button 
            type="button"
            variant={statusType === "professional" ? "default" : "outline"}
            onClick={() => handleStatusChange("professional")}
          >
            Working Professional
          </Button>
          <Button 
            type="button"
            variant={statusType === "homemaker" ? "default" : "outline"}
            onClick={() => handleStatusChange("homemaker")}
          >
            Homemaker
          </Button>
          <Button 
            type="button"
            variant={statusType === "other" ? "default" : "outline"}
            onClick={() => handleStatusChange("other")}
          >
            Other
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status-specific fields */}
        {statusType === "student" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="currentStream">Current Stream/Field</Label>
              <Input 
                id="currentStream" 
                name="currentStream" 
                placeholder="Computer Science, Arts, Commerce, etc."
                value={value.currentStream || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentDegree">Current Degree/Program</Label>
              <Input 
                id="currentDegree" 
                name="currentDegree" 
                placeholder="Bachelor's, High School, etc."
                value={value.currentDegree || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        {statusType === "professional" && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="career">Current Career</Label>
            <Input 
              id="career" 
              name="career" 
              placeholder="Software Developer, Teacher, etc."
              value={value.career || ""}
              onChange={handleInputChange}
            />
          </div>
        )}

        {statusType === "homemaker" && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="dailyActivities">Daily Activities</Label>
            <Textarea 
              id="dailyActivities" 
              name="dailyActivities" 
              placeholder="Household management, childcare, etc."
              value={value.dailyActivities || ""}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>
        )}

        {statusType === "other" && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="otherDetails">Please Describe</Label>
            <Textarea 
              id="otherDetails" 
              name="otherDetails" 
              placeholder="Please describe your current status..."
              value={value.otherDetails || ""}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>
        )}

        {/* Common fields for all status types */}
        <div className="space-y-2">
          <Label htmlFor="education">Current Education Level</Label>
          <Input 
            id="education" 
            name="education" 
            placeholder="High School, Bachelor's, etc."
            value={value.education || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="health">Current Health Status</Label>
          <Input 
            id="health" 
            name="health" 
            placeholder="Good, Average, etc."
            value={value.health || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wealth">Current Financial Situation</Label>
          <Input 
            id="wealth" 
            name="wealth" 
            placeholder="Student budget, Entry-level salary, etc."
            value={value.wealth || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="relationships">Current Relationships</Label>
          <Input 
            id="relationships" 
            name="relationships" 
            placeholder="Single, In a relationship, etc."
            value={value.relationships || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Current Location</Label>
          <Input 
            id="location" 
            name="location" 
            placeholder="City, Country, etc."
            value={value.location || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skills">Current Skills</Label>
          <Input 
            id="skills" 
            name="skills" 
            placeholder="Programming, Writing, etc. (comma-separated)"
            value={Array.isArray(value.skills) ? value.skills.join(", ") : ""}
            onChange={(e) => handleArrayInputChange("skills", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hobbies">Current Hobbies</Label>
          <Input 
            id="hobbies" 
            name="hobbies" 
            placeholder="Reading, Gaming, etc. (comma-separated)"
            value={Array.isArray(value.hobbies) ? value.hobbies.join(", ") : ""}
            onChange={(e) => handleArrayInputChange("hobbies", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}