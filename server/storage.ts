import {
  users, User, InsertUser, 
  futureProfiles, FutureProfile, InsertFutureProfile,
  goals, Goal, InsertGoal,
  habits, Habit, InsertHabit,
  journals, Journal, InsertJournal,
  conversations, Conversation, InsertConversation,
  Message, WeekLog, Sentiment
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  updateUserLevel(userId: number, level: number): Promise<User | undefined>;
  updateUserTraits(userId: number, traits: Record<string, any>): Promise<User | undefined>;
  
  // Future profile methods
  getFutureProfile(userId: number): Promise<FutureProfile | undefined>;
  createFutureProfile(profile: InsertFutureProfile): Promise<FutureProfile>;
  updateFutureProfile(id: number, profile: Partial<InsertFutureProfile>): Promise<FutureProfile | undefined>;
  
  // Goals methods
  getGoal(id: number): Promise<Goal | undefined>;
  getGoalsByUser(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;
  
  // Habits methods
  getHabit(id: number): Promise<Habit | undefined>;
  getHabitsByUser(userId: number): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  completeHabit(id: number, completed: boolean): Promise<Habit | undefined>;
  deleteHabit(id: number): Promise<boolean>;
  
  // Journal methods
  getJournal(id: number): Promise<Journal | undefined>;
  getJournalsByUser(userId: number, limit?: number): Promise<Journal[]>;
  createJournal(journal: InsertJournal): Promise<Journal>;
  updateJournal(id: number, journal: Partial<InsertJournal>): Promise<Journal | undefined>;
  deleteJournal(id: number): Promise<boolean>;
  
  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationByUser(userId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, message: Message): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private futureProfiles: Map<number, FutureProfile>;
  private goals: Map<number, Goal>;
  private habits: Map<number, Habit>;
  private journals: Map<number, Journal>;
  private conversations: Map<number, Conversation>;
  
  private userIdCounter: number;
  private futureProfileIdCounter: number;
  private goalIdCounter: number;
  private habitIdCounter: number;
  private journalIdCounter: number;
  private conversationIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.futureProfiles = new Map();
    this.goals = new Map();
    this.habits = new Map();
    this.journals = new Map();
    this.conversations = new Map();
    
    this.userIdCounter = 1;
    this.futureProfileIdCounter = 1;
    this.goalIdCounter = 1;
    this.habitIdCounter = 1;
    this.journalIdCounter = 1;
    this.conversationIdCounter = 1;
    
    // Add a demo user
    this.createUser({
      username: "demouser",
      password: "password123",
      email: "demo@example.com", 
      name: "John Smith",
      avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      level: 1, 
      points: 0, 
      traits: null, 
      preferences: null 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, points };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserLevel(userId: number, level: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, level };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserTraits(userId: number, traits: Record<string, any>): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, traits };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Future profile methods
  async getFutureProfile(userId: number): Promise<FutureProfile | undefined> {
    return Array.from(this.futureProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }
  
  async createFutureProfile(profile: InsertFutureProfile): Promise<FutureProfile> {
    const id = this.futureProfileIdCounter++;
    const futureProfile: FutureProfile = { ...profile, id };
    this.futureProfiles.set(id, futureProfile);
    return futureProfile;
  }
  
  async updateFutureProfile(id: number, profile: Partial<InsertFutureProfile>): Promise<FutureProfile | undefined> {
    const existingProfile = this.futureProfiles.get(id);
    if (!existingProfile) return undefined;
    
    const updatedProfile = { ...existingProfile, ...profile };
    this.futureProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // Goals methods
  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }
  
  async getGoalsByUser(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.userId === userId,
    );
  }
  
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = this.goalIdCounter++;
    const newGoal: Goal = { ...goal, id };
    this.goals.set(id, newGoal);
    return newGoal;
  }
  
  async updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const existingGoal = this.goals.get(id);
    if (!existingGoal) return undefined;
    
    const updatedGoal = { ...existingGoal, ...goal };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }
  
  // Habits methods
  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }
  
  async getHabitsByUser(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(
      (habit) => habit.userId === userId,
    );
  }
  
  async createHabit(habit: InsertHabit): Promise<Habit> {
    const id = this.habitIdCounter++;
    const newHabit: Habit = { ...habit, id };
    this.habits.set(id, newHabit);
    return newHabit;
  }
  
  async updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined> {
    const existingHabit = this.habits.get(id);
    if (!existingHabit) return undefined;
    
    const updatedHabit = { ...existingHabit, ...habit };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
  
  async completeHabit(id: number, completed: boolean): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const now = new Date();
    const weekLog = habit.weekLog as WeekLog || Array(7).fill(false);
    
    // Update today's completion status in the week log
    weekLog[new Date().getDay()] = completed;
    
    // Update streak count
    let streakCount = habit.streakCount || 0;
    if (completed) {
      const lastCompletedDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
      
      // Check if this is a continuing streak
      if (lastCompletedDate) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (
          lastCompletedDate.getDate() === yesterday.getDate() &&
          lastCompletedDate.getMonth() === yesterday.getMonth() &&
          lastCompletedDate.getFullYear() === yesterday.getFullYear()
        ) {
          streakCount += 1;
        } else if (
          lastCompletedDate.getDate() !== now.getDate() ||
          lastCompletedDate.getMonth() !== now.getMonth() ||
          lastCompletedDate.getFullYear() !== now.getFullYear()
        ) {
          // If not yesterday and not today (already completed), reset streak
          streakCount = 1;
        }
      } else {
        streakCount = 1;
      }
    }
    
    const updatedHabit = {
      ...habit,
      lastCompleted: completed ? now : habit.lastCompleted,
      streakCount,
      weekLog
    };
    
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
  
  async deleteHabit(id: number): Promise<boolean> {
    return this.habits.delete(id);
  }
  
  // Journal methods
  async getJournal(id: number): Promise<Journal | undefined> {
    return this.journals.get(id);
  }
  
  async getJournalsByUser(userId: number, limit?: number): Promise<Journal[]> {
    const userJournals = Array.from(this.journals.values())
      .filter(journal => journal.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? userJournals.slice(0, limit) : userJournals;
  }
  
  async createJournal(journal: InsertJournal): Promise<Journal> {
    const id = this.journalIdCounter++;
    const newJournal: Journal = { ...journal, id };
    this.journals.set(id, newJournal);
    return newJournal;
  }
  
  async updateJournal(id: number, journal: Partial<InsertJournal>): Promise<Journal | undefined> {
    const existingJournal = this.journals.get(id);
    if (!existingJournal) return undefined;
    
    const updatedJournal = { ...existingJournal, ...journal };
    this.journals.set(id, updatedJournal);
    return updatedJournal;
  }
  
  async deleteJournal(id: number): Promise<boolean> {
    return this.journals.delete(id);
  }
  
  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async getConversationByUser(userId: number): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conversation) => conversation.userId === userId,
    );
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationIdCounter++;
    const newConversation: Conversation = { ...conversation, id };
    this.conversations.set(id, newConversation);
    return newConversation;
  }
  
  async updateConversation(id: number, message: Message): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const messages = [...(conversation.messages as Message[]), message];
    const updatedConversation = { 
      ...conversation, 
      messages, 
      lastUpdated: new Date() 
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
}

// Import and use DynamoDB storage
import { DynamoDBStorage } from "./db/dynamodb-storage";

// Use DynamoDB storage instead of MemStorage
export const storage = new DynamoDBStorage();

// Add some seed data
async function seedData() {
  const user = await storage.getUserByUsername("demouser");
  if (!user) return;

  // Create a future profile
  const futureProfile = await storage.getFutureProfile(user.id);
  if (!futureProfile) {
    await storage.createFutureProfile({
      userId: user.id,
      avatarUrl: user.avatarUrl,
      career: "Senior Developer",
      education: "Master's Degree",
      health: "Good health, regular fitness",
      wealth: "$95,000 annual income",
      relationships: "Married with supportive partner",
      location: "Tech hub city",
      personalGrowth: "Regular learning and development"
    });
  }

  // Create demo goals
  const goals = await storage.getGoalsByUser(user.id);
  if (goals.length === 0) {
    await storage.createGoal({
      userId: user.id,
      title: "Learn Machine Learning",
      description: "Complete a ML certification and build a project",
      category: "Career",
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
      progress: 45,
      completed: false
    });
    
    await storage.createGoal({
      userId: user.id,
      title: "Run 5K",
      description: "Train for and complete a 5K run",
      category: "Health",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      progress: 80,
      completed: false
    });
    
    await storage.createGoal({
      userId: user.id,
      title: "Save $5,000",
      description: "Build an emergency fund",
      category: "Finance",
      dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
      progress: 25,
      completed: false
    });
  }

  // Create demo habits
  const habits = await storage.getHabitsByUser(user.id);
  if (habits.length === 0) {
    await storage.createHabit({
      userId: user.id,
      title: "Morning Exercise",
      streakCount: 12,
      lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      weekLog: [true, true, true, true, true, true, false]
    });
    
    await storage.createHabit({
      userId: user.id,
      title: "Read 30 minutes",
      streakCount: 3,
      lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      weekLog: [true, true, true, false, false, false, false]
    });
    
    await storage.createHabit({
      userId: user.id,
      title: "Meditate",
      streakCount: 0,
      lastCompleted: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      weekLog: [true, false, true, true, false, false, false]
    });
  }

  // Create demo journal entries
  const journals = await storage.getJournalsByUser(user.id);
  if (journals.length === 0) {
    await storage.createJournal({
      userId: user.id,
      content: "Had a productive day working on my machine learning project. Feeling optimistic about my progress.",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      sentiment: { rating: 4, confidence: 0.8 }
    });
    
    await storage.createJournal({
      userId: user.id,
      content: "Went for a run today and beat my previous time. Still need to work on pacing myself better.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      sentiment: { rating: 3, confidence: 0.7 }
    });
    
    await storage.createJournal({
      userId: user.id,
      content: "Feeling great about my financial planning. Made another deposit to my savings and I'm on track to meet my goal!",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      sentiment: { rating: 5, confidence: 0.9 }
    });
  }

  // Create demo conversation
  const conversation = await storage.getConversationByUser(user.id);
  if (!conversation) {
    await storage.createConversation({
      userId: user.id,
      messages: [
        {
          role: "assistant",
          content: "Welcome back! How are you feeling about your progress on your \"Learn Machine Learning\" goal?",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
        },
        {
          role: "user",
          content: "I'm struggling to find time to practice coding.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
        },
        {
          role: "assistant",
          content: "I understand that finding time can be challenging. Have you tried the time-blocking technique we discussed? Even 15 minutes of daily practice can make a big difference.",
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() // 25 minutes ago
        }
      ],
      lastUpdated: new Date()
    });
  }
}

// Seed data when the server starts
seedData();
