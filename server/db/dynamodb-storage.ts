import { IStorage } from '../storage';
import { TABLES } from './dynamodb';
import { 
  putItem, 
  getItem, 
  queryItems, 
  scanItems, 
  updateItem, 
  deleteItem, 
  generateId 
} from './operations';
import { setupTables } from './setup';

import {
  User, InsertUser,
  FutureProfile, InsertFutureProfile,
  Goal, InsertGoal,
  Habit, InsertHabit,
  Journal, InsertJournal,
  Conversation, InsertConversation,
  Message
} from '@shared/schema';

export class DynamoDBStorage implements IStorage {
  constructor() {
    // Initialize DynamoDB tables
    this.initTables();
  }

  private async initTables() {
    try {
      await setupTables();
      console.log('DynamoDB tables initialized successfully');
      
      // Create a demo user if it doesn't exist
      this.createDemoUserIfNotExists();
    } catch (error) {
      console.error('Error initializing DynamoDB tables:', error);
    }
  }
  
  private async createDemoUserIfNotExists() {
    try {
      const demoUser = await this.getUserByUsername("demouser");
      
      if (!demoUser) {
        console.log("Creating demo user...");
        const user = await this.createUser({
          username: "demouser",
          password: "password123",
          email: "demo@example.com", 
          name: "John Smith",
          avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
        });
        
        console.log("Created demo user with ID:", user.id);
        this.seedDemoData(user.id);
      }
    } catch (error) {
      console.error("Error creating demo user:", error);
    }
  }
  
  private async seedDemoData(userId: number) {
    try {
      // Create a future profile
      await this.createFutureProfile({
        userId,
        avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        career: "Senior Developer",
        education: "Master's Degree",
        health: "Good health, regular fitness",
        wealth: "$95,000 annual income",
        relationships: "Married with supportive partner",
        location: "Tech hub city",
        personalGrowth: "Regular learning and development"
      });
      
      // Create demo goals
      await this.createGoal({
        userId,
        title: "Learn Machine Learning",
        description: "Complete a ML certification and build a project",
        category: "Career",
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
        progress: 45,
        completed: false
      });
      
      await this.createGoal({
        userId,
        title: "Run 5K",
        description: "Train for and complete a 5K run",
        category: "Health",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        progress: 80,
        completed: false
      });
      
      // Create demo habits
      await this.createHabit({
        userId,
        title: "Morning Exercise",
        streakCount: 12,
        lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        weekLog: [true, true, true, true, true, true, false]
      });
      
      // Create demo journal entries
      await this.createJournal({
        userId,
        content: "Had a productive day working on my machine learning project. Feeling optimistic about my progress.",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        sentiment: { rating: 4, confidence: 0.8 }
      });
      
      // Create demo conversation
      await this.createConversation({
        userId,
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
          }
        ],
        lastUpdated: new Date()
      });
      
      console.log("Demo data seeded successfully");
    } catch (error) {
      console.error("Error seeding demo data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const user = await getItem(TABLES.USERS, id);
    return user as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await queryItems(TABLES.USERS, 'username', username);
    return users.length > 0 ? users[0] as User : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await queryItems(TABLES.USERS, 'email', email);
    return users.length > 0 ? users[0] as User : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = generateId();
    const newUser = { 
      ...user, 
      id, 
      level: 1, 
      points: 0,
      traits: {},
      preferences: {}
    };
    await putItem(TABLES.USERS, newUser);
    return newUser as User;
  }

  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const updatedUser = await updateItem(TABLES.USERS, userId, { points });
    return updatedUser as User | undefined;
  }

  async updateUserLevel(userId: number, level: number): Promise<User | undefined> {
    const updatedUser = await updateItem(TABLES.USERS, userId, { level });
    return updatedUser as User | undefined;
  }

  async updateUserTraits(userId: number, traits: Record<string, any>): Promise<User | undefined> {
    const updatedUser = await updateItem(TABLES.USERS, userId, { traits });
    return updatedUser as User | undefined;
  }

  // Future profile methods
  async getFutureProfile(userId: number): Promise<FutureProfile | undefined> {
    const profiles = await queryItems(TABLES.FUTURE_PROFILES, 'userId', userId);
    return profiles.length > 0 ? profiles[0] as FutureProfile : undefined;
  }

  async createFutureProfile(profile: InsertFutureProfile): Promise<FutureProfile> {
    const id = generateId();
    const newProfile = { ...profile, id };
    await putItem(TABLES.FUTURE_PROFILES, newProfile);
    return newProfile as FutureProfile;
  }

  async updateFutureProfile(id: number, profile: Partial<InsertFutureProfile>): Promise<FutureProfile | undefined> {
    const updatedProfile = await updateItem(TABLES.FUTURE_PROFILES, id, profile);
    return updatedProfile as FutureProfile | undefined;
  }

  // Goals methods
  async getGoal(id: number): Promise<Goal | undefined> {
    const goal = await getItem(TABLES.GOALS, id);
    return goal as Goal | undefined;
  }

  async getGoalsByUser(userId: number): Promise<Goal[]> {
    const goals = await queryItems(TABLES.GOALS, 'userId', userId);
    return goals as Goal[] || [];
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = generateId();
    const newGoal = { 
      ...goal, 
      id, 
      progress: goal.progress || 0,
      completed: goal.completed || false
    };
    await putItem(TABLES.GOALS, newGoal);
    return newGoal as Goal;
  }

  async updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const updatedGoal = await updateItem(TABLES.GOALS, id, goal);
    return updatedGoal as Goal | undefined;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return await deleteItem(TABLES.GOALS, id);
  }

  // Habits methods
  async getHabit(id: number): Promise<Habit | undefined> {
    const habit = await getItem(TABLES.HABITS, id);
    return habit as Habit | undefined;
  }

  async getHabitsByUser(userId: number): Promise<Habit[]> {
    const habits = await queryItems(TABLES.HABITS, 'userId', userId);
    return habits as Habit[];
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const id = generateId();
    const newHabit = { 
      ...habit, 
      id, 
      streakCount: habit.streakCount || 0,
      weekLog: habit.weekLog || [false, false, false, false, false, false, false]
    };
    await putItem(TABLES.HABITS, newHabit);
    return newHabit as Habit;
  }

  async updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined> {
    const updatedHabit = await updateItem(TABLES.HABITS, id, habit);
    return updatedHabit as Habit | undefined;
  }

  async completeHabit(id: number, completed: boolean): Promise<Habit | undefined> {
    const habit = await this.getHabit(id);
    if (!habit) return undefined;

    // Create a default weekLog if it doesn't exist
    const defaultWeekLog = [false, false, false, false, false, false, false];
    const weekLog = Array.isArray(habit.weekLog) 
      ? [...habit.weekLog] 
      : [...defaultWeekLog];
    
    if (completed) {
      // Update today's entry in the week log
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
      weekLog[today] = true;
    }

    // Make sure lastCompleted is a proper Date object when storing in DynamoDB
    const lastCompletedDate = completed ? new Date() : 
      (habit.lastCompleted ? new Date(habit.lastCompleted) : null);
    
    const updates = {
      lastCompleted: lastCompletedDate,
      weekLog,
      streakCount: completed ? (habit.streakCount || 0) + 1 : habit.streakCount
    };

    return await this.updateHabit(id, updates as Partial<InsertHabit>);
  }

  async deleteHabit(id: number): Promise<boolean> {
    return await deleteItem(TABLES.HABITS, id);
  }

  // Journal methods
  async getJournal(id: number): Promise<Journal | undefined> {
    const journal = await getItem(TABLES.JOURNALS, id);
    return journal as Journal | undefined;
  }

  async getJournalsByUser(userId: number, limit?: number): Promise<Journal[]> {
    let journals = await queryItems(TABLES.JOURNALS, 'userId', userId);
    
    // Sort by date descending
    journals = journals.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      journals = journals.slice(0, limit);
    }

    return journals as Journal[];
  }

  async createJournal(journal: InsertJournal): Promise<Journal> {
    const id = generateId();
    const newJournal = { ...journal, id };
    await putItem(TABLES.JOURNALS, newJournal);
    return newJournal as Journal;
  }

  async updateJournal(id: number, journal: Partial<InsertJournal>): Promise<Journal | undefined> {
    const updatedJournal = await updateItem(TABLES.JOURNALS, id, journal);
    return updatedJournal as Journal | undefined;
  }

  async deleteJournal(id: number): Promise<boolean> {
    return await deleteItem(TABLES.JOURNALS, id);
  }

  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    const conversation = await getItem(TABLES.CONVERSATIONS, id);
    return conversation as Conversation | undefined;
  }

  async getConversationByUser(userId: number): Promise<Conversation | undefined> {
    const conversations = await queryItems(TABLES.CONVERSATIONS, 'userId', userId);
    return conversations.length > 0 ? conversations[0] as Conversation : undefined;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = generateId();
    const newConversation = { ...conversation, id };
    await putItem(TABLES.CONVERSATIONS, newConversation);
    return newConversation as Conversation;
  }

  async updateConversation(id: number, message: Message): Promise<Conversation | undefined> {
    const conversation = await this.getConversation(id);
    if (!conversation) return undefined;

    // Ensure messages is an array
    const existingMessages = Array.isArray(conversation.messages) 
      ? conversation.messages 
      : [];
    
    const messages = [...existingMessages, message];
    const lastUpdated = new Date().toISOString();

    const updates = { messages, lastUpdated };
    const updatedConversation = await updateItem(TABLES.CONVERSATIONS, id, updates);
    
    return updatedConversation as Conversation | undefined;
  }
}