import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FutureVision } from "@shared/types";

interface FutureVisionFormProps {
  value: FutureVision;
  onChange: (value: FutureVision) => void;
}

export default function FutureVisionForm({ value, onChange }: FutureVisionFormProps) {
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="career">Future Career</Label>
        <Input 
          id="career" 
          name="career" 
          placeholder="Senior Developer, CEO, etc."
          value={value.career || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="education">Future Education</Label>
        <Input 
          id="education" 
          name="education" 
          placeholder="Master's Degree, PhD, etc."
          value={value.education || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="skills">Future Skills</Label>
        <Input 
          id="skills" 
          name="skills" 
          placeholder="Leadership, Advanced Programming, etc. (comma-separated)"
          value={Array.isArray(value.skills) ? value.skills.join(", ") : ""}
          onChange={(e) => handleArrayInputChange("skills", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="health">Future Health</Label>
        <Input 
          id="health" 
          name="health" 
          placeholder="Excellent fitness, Regular exercise routine, etc."
          value={value.health || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="wealth">Future Wealth</Label>
        <Input 
          id="wealth" 
          name="wealth" 
          placeholder="$100,000 annual income, Financial independence, etc."
          value={value.wealth || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hobbies">Future Hobbies</Label>
        <Input 
          id="hobbies" 
          name="hobbies" 
          placeholder="Travel, Music, etc. (comma-separated)"
          value={Array.isArray(value.hobbies) ? value.hobbies.join(", ") : ""}
          onChange={(e) => handleArrayInputChange("hobbies", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="relationships">Future Relationships</Label>
        <Input 
          id="relationships" 
          name="relationships" 
          placeholder="Married with children, Strong friendships, etc."
          value={value.relationships || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Future Location</Label>
        <Input 
          id="location" 
          name="location" 
          placeholder="Beach house, Metropolitan city, etc."
          value={value.location || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="personalGrowth">Personal Growth</Label>
        <Input 
          id="personalGrowth" 
          name="personalGrowth" 
          placeholder="Continuous learning, Mindfulness practice, etc."
          value={value.personalGrowth || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}