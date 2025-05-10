// Types for current state and status
export type StatusType = "student" | "professional" | "homemaker" | "other";

export interface CurrentState {
  statusType: StatusType;
  // Common fields
  education?: string;
  health?: string;
  wealth?: string;
  relationships?: string;
  location?: string;
  skills?: string[];
  hobbies?: string[];
  // Status-specific fields
  career?: string;          // For professionals
  currentStream?: string;   // For students
  currentDegree?: string;   // For students
  dailyActivities?: string; // For homemakers
  otherDetails?: string;    // For other status types
}

// Future vision specific types
export interface FutureVision {
  career?: string;
  education?: string;
  health?: string;
  wealth?: string;
  relationships?: string;
  location?: string;
  personalGrowth?: string;
  skills?: string[];
  hobbies?: string[];
}