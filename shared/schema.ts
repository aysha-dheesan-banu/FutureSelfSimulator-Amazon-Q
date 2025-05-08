import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  level: integer("level").default(1),
  points: integer("points").default(0),
  traits: jsonb("traits"), // Personality traits from quiz
  preferences: jsonb("preferences"), // App preferences
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  avatarUrl: true,
});

// Future Self Profile schema
export const futureProfiles = pgTable("future_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  avatarUrl: text("avatar_url"),
  career: text("career"),
  education: text("education"),
  health: text("health"),
  wealth: text("wealth"),
  relationships: text("relationships"),
  location: text("location"),
  personalGrowth: text("personal_growth"),
});

export const insertFutureProfileSchema = createInsertSchema(futureProfiles).pick({
  userId: true,
  avatarUrl: true,
  career: true,
  education: true,
  health: true,
  wealth: true,
  relationships: true,
  location: true,
  personalGrowth: true,
});

// Goals schema
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // career, health, finance, etc.
  dueDate: timestamp("due_date"),
  progress: integer("progress").default(0), // 0-100
  completed: boolean("completed").default(false),
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  userId: true,
  title: true,
  description: true,
  category: true,
  dueDate: true,
  progress: true,
  completed: true,
});

// Habits schema
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  streakCount: integer("streak_count").default(0),
  lastCompleted: timestamp("last_completed"),
  weekLog: jsonb("week_log"), // Array of boolean for last 7 days
});

export const insertHabitSchema = createInsertSchema(habits).pick({
  userId: true,
  title: true,
  streakCount: true,
  lastCompleted: true,
  weekLog: true,
});

// Journal schema
export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  sentiment: jsonb("sentiment"), // Rating and confidence
});

export const insertJournalSchema = createInsertSchema(journals).pick({
  userId: true,
  content: true,
  date: true,
  sentiment: true,
});

// AI Coach Conversations schema
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  messages: jsonb("messages").notNull(), // Array of message objects
  lastUpdated: timestamp("last_updated").notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  messages: true,
  lastUpdated: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FutureProfile = typeof futureProfiles.$inferSelect;
export type InsertFutureProfile = z.infer<typeof insertFutureProfileSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

export type Journal = typeof journals.$inferSelect;
export type InsertJournal = z.infer<typeof insertJournalSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

// Extended types for the application
export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type Sentiment = {
  rating: number; // 1-5
  confidence: number; // 0-1
};

export type WeekLog = boolean[];
