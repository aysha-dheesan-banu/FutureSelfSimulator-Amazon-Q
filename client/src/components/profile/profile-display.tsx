import { FutureProfile } from "@shared/schema";
import { CurrentState, FutureVision } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileDisplayProps {
  profile: Partial<FutureProfile> | null;
  timelineYears: number;
}

export default function ProfileDisplay({ profile, timelineYears }: ProfileDisplayProps) {
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Future Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No profile data available. Please create your profile.</p>
        </CardContent>
      </Card>
    );
  }

  // Determine if we're showing current state or future vision
  const isCurrentState = timelineYears === 0;
  
  // Get the appropriate data based on timeline
  const currentState = profile.currentState as CurrentState | undefined;
  const futureVision: FutureVision = {
    career: profile.career,
    education: profile.education,
    health: profile.health,
    wealth: profile.wealth,
    relationships: profile.relationships,
    location: profile.location,
    personalGrowth: profile.personalGrowth,
    skills: profile.skills as string[],
    hobbies: profile.hobbies as string[]
  };

  // Choose which data to display
  const displayData = isCurrentState ? currentState : futureVision;
  
  // If we're trying to show current state but it doesn't exist
  if (isCurrentState && !currentState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current State</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No current state data available. Please fill out your current state information.</p>
        </CardContent>
      </Card>
    );
  }

  const timelineLabel = isCurrentState
    ? "Current State" 
    : timelineYears === 1 
      ? "1 Year from Now" 
      : `${timelineYears} Years from Now`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your {isCurrentState ? "Current State" : "Future Vision"}</CardTitle>
        <p className="text-sm text-gray-500">{timelineLabel}</p>
        {isCurrentState && currentState?.statusType && (
          <Badge variant="outline" className="mt-1">
            {currentState.statusType === "professional" ? "Working Professional" : 
             currentState.statusType === "student" ? "Student" :
             currentState.statusType === "homemaker" ? "Homemaker" : "Other"}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status-specific fields for current state */}
        {isCurrentState && currentState?.statusType === "student" && (
          <>
            {currentState.currentStream && (
              <div>
                <h3 className="font-medium text-gray-900">Current Stream</h3>
                <p className="text-gray-700">{currentState.currentStream}</p>
              </div>
            )}
            {currentState.currentDegree && (
              <div>
                <h3 className="font-medium text-gray-900">Current Degree</h3>
                <p className="text-gray-700">{currentState.currentDegree}</p>
              </div>
            )}
          </>
        )}
        
        {isCurrentState && currentState?.statusType === "professional" && currentState.career && (
          <div>
            <h3 className="font-medium text-gray-900">Current Career</h3>
            <p className="text-gray-700">{currentState.career}</p>
          </div>
        )}
        
        {isCurrentState && currentState?.statusType === "homemaker" && currentState.dailyActivities && (
          <div>
            <h3 className="font-medium text-gray-900">Daily Activities</h3>
            <p className="text-gray-700">{currentState.dailyActivities}</p>
          </div>
        )}
        
        {isCurrentState && currentState?.statusType === "other" && currentState.otherDetails && (
          <div>
            <h3 className="font-medium text-gray-900">Current Status</h3>
            <p className="text-gray-700">{currentState.otherDetails}</p>
          </div>
        )}
        
        {/* Common fields for both current state and future vision */}
        {!isCurrentState && displayData?.career && (
          <div>
            <h3 className="font-medium text-gray-900">Career</h3>
            <p className="text-gray-700">{displayData.career}</p>
          </div>
        )}
        
        {displayData?.education && (
          <div>
            <h3 className="font-medium text-gray-900">{isCurrentState ? "Current Education" : "Future Education"}</h3>
            <p className="text-gray-700">{displayData.education}</p>
          </div>
        )}
        
        {displayData?.skills && Array.isArray(displayData.skills) && displayData.skills.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900">{isCurrentState ? "Current Skills" : "Future Skills"}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {displayData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {displayData?.health && (
          <div>
            <h3 className="font-medium text-gray-900">{isCurrentState ? "Current Health" : "Future Health"}</h3>
            <p className="text-gray-700">{displayData.health}</p>
          </div>
        )}
        
        {displayData?.wealth && (
          <div>
            <h3 className="font-medium text-gray-900">{isCurrentState ? "Current Financial Situation" : "Future Wealth"}</h3>
            <p className="text-gray-700">{displayData.wealth}</p>
          </div>
        )}
        
        {displayData?.hobbies && Array.isArray(displayData.hobbies) && displayData.hobbies.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900">{isCurrentState ? "Current Hobbies" : "Future Hobbies"}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {displayData.hobbies.map((hobby, index) => (
                <span 
                  key={index} 
                  className="bg-secondary-50 text-secondary-700 px-2 py-1 rounded-full text-xs"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {displayData?.relationships && (
          <div>
            <h3 className="font-medium text-gray-900">{isCurrentState ? "Current Relationships" : "Future Relationships"}</h3>
            <p className="text-gray-700">{displayData.relationships}</p>
          </div>
        )}
        
        {displayData?.location && (
          <div>
            <h3 className="font-medium text-gray-900">{isCurrentState ? "Current Location" : "Future Location"}</h3>
            <p className="text-gray-700">{displayData.location}</p>
          </div>
        )}
        
        {!isCurrentState && displayData?.personalGrowth && (
          <div>
            <h3 className="font-medium text-gray-900">Personal Growth</h3>
            <p className="text-gray-700">{displayData.personalGrowth}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}