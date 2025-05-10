import { z } from "zod";

// User schema
export interface User {
  id: number;
  username: string;
  password?: string; // Only included in certain contexts, excluded from responses
  email: string;
  name?: string;
  avatarUrl?: string;
  level?: number;
  points?: number;
  traits?: {
    openness?: number;
    conscientiousness?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
  };
  preferences?: {
    gender?: 'male' | 'female' | 'other';
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Zod schema for user insertion
export const insertUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
  level: z.number().default(1),
  points: z.number().default(0),
  traits: z.object({
    openness: z.number().min(0).max(1).optional(),
    conscientiousness: z.number().min(0).max(1).optional(),
    extraversion: z.number().min(0).max(1).optional(),
    agreeableness: z.number().min(0).max(1).optional(),
    neuroticism: z.number().min(0).max(1).optional()
  }).optional(),
  preferences: z.object({
    gender: z.enum(['male', 'female', 'other']).optional(),
    theme: z.enum(['light', 'dark']).optional(),
    notifications: z.boolean().optional()
  }).optional()
});

// Future Profile schema
export interface FutureProfile {
  id: number;
  userId: number;
  avatarUrl?: string;
  career?: string;
  education?: string;
  health?: string;
  wealth?: string;
  relationships?: string;
  location?: string;
  personalGrowth?: string;
  profileType?: string;
  currentStream?: string;
  degree?: string;
  skills?: string[];
  hobbies?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Zod schema for future profile insertion
export const insertFutureProfileSchema = z.object({
  userId: z.number(),
  avatarUrl: z.string().optional(),
  career: z.string().optional(),
  education: z.string().optional(),
  health: z.string().optional(),
  wealth: z.string().optional(),
  relationships: z.string().optional(),
  location: z.string().optional(),
  personalGrowth: z.string().optional(),
  profileType: z.string().optional(),
  currentStream: z.string().optional(),
  degree: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional()
});

// Conversation schema
export interface Conversation {
  id: number;
  userId: number;
  title?: string;
  messages: Message[];
  createdAt?: string;
  updatedAt?: string;
}

// Message schema
export interface Message {
  id?: number;
  conversationId?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

// Goal schema
export interface Goal {
  id: number;
  userId: number;
  title: string;
  description?: string;
  targetDate?: string;
  progress?: number;
  status?: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Zod schema for goal insertion
export const insertGoalSchema = z.object({
  userId: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  targetDate: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(['not_started', 'in_progress', 'completed', 'abandoned']).default('not_started'),
  category: z.string().optional()
});

// Habit schema
export interface Habit {
  id: number;
  userId: number;
  title: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  targetDays?: number[];
  streak?: number;
  longestStreak?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Zod schema for habit insertion
export const insertHabitSchema = z.object({
  userId: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  targetDays: z.array(z.number()).optional(),
  streak: z.number().default(0),
  longestStreak: z.number().default(0)
});

// Journal schema
export interface Journal {
  id: number;
  userId: number;
  title?: string;
  content: string;
  date?: string;
  sentiment?: {
    rating: number;
    analysis: string;
  };
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Type for journal insertion
export type InsertJournal = Omit<Journal, 'id' | 'createdAt' | 'updatedAt'>;

// Zod schema for journal insertion
export const insertJournalSchema = z.object({
  userId: z.number(),
  title: z.string().optional(),
  content: z.string().min(1),
  date: z.string().optional(),
  sentiment: z.object({
    rating: z.number().min(1).max(5),
    analysis: z.string()
  }).optional(),
  metadata: z.record(z.any()).optional()
});