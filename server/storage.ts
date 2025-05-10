import { DynamoDBStorage } from './db/dynamodb-storage';
import { SKIP_DYNAMODB, mockDynamoDBOperations } from './db/skip-dynamodb';

/**
 * Storage interface for the application
 * This acts as a facade for the underlying storage implementations
 */
class Storage {
  private dynamoDBStorage: DynamoDBStorage;
  
  constructor() {
    this.dynamoDBStorage = new DynamoDBStorage();
  }
  
  // Initialize storage
  async init() {
    if (SKIP_DYNAMODB) {
      console.log("⚠️ SKIPPING DYNAMODB OPERATIONS - Using mock data");
      return;
    }
    
    try {
      await this.dynamoDBStorage.initTables();
      await this.dynamoDBStorage.createDemoUserIfNotExists();
    } catch (error) {
      console.error("Error initializing storage:", error);
      console.log("⚠️ Falling back to mock data");
    }
  }
  
  // User operations
  async getUserById(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getUserById(id);
    return this.dynamoDBStorage.getUserById(id);
  }
  
  async getUserByUsername(username: string) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getUserByUsername(username);
    return this.dynamoDBStorage.getUserByUsername(username);
  }
  
  async getUserByEmail(email: string) {
    if (SKIP_DYNAMODB) {
      const mockUser = await mockDynamoDBOperations.getUserById(1);
      return mockUser.email === email ? mockUser : null;
    }
    // This method might not exist in DynamoDBStorage
    if (typeof this.dynamoDBStorage.getUserByEmail === 'function') {
      return this.dynamoDBStorage.getUserByEmail(email);
    }
    return null;
  }
  
  async createUser(userData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.createUser(userData);
    return this.dynamoDBStorage.createUser(userData);
  }
  
  async updateUser(id: number, userData: any) {
    if (SKIP_DYNAMODB) {
      console.log("Updating user with mock data:", userData);
      return mockDynamoDBOperations.updateUser(id, userData);
    }
    return this.dynamoDBStorage.updateUser(id, userData);
  }
  
  // Future profile operations
  async getFutureProfile(userId: number) {
    if (SKIP_DYNAMODB) {
      return {
        id: 1,
        userId,
        career: "Software Developer",
        education: "Bachelor's in Computer Science",
        health: "Regular exercise routine",
        wealth: "Saving for retirement",
        relationships: "Building meaningful connections",
        location: "Urban area",
        personalGrowth: "Learning new skills",
        createdAt: new Date().toISOString()
      };
    }
    // This method might not exist in DynamoDBStorage
    if (typeof this.dynamoDBStorage.getFutureProfile === 'function') {
      return this.dynamoDBStorage.getFutureProfile(userId);
    }
    return null;
  }
  
  async createFutureProfile(profileData: any) {
    if (SKIP_DYNAMODB) {
      return {
        id: 1,
        ...profileData,
        createdAt: new Date().toISOString()
      };
    }
    // This method might not exist in DynamoDBStorage
    if (typeof this.dynamoDBStorage.createFutureProfile === 'function') {
      return this.dynamoDBStorage.createFutureProfile(profileData);
    }
    return null;
  }
  
  // Goal operations
  async getGoalById(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getGoalById(id);
    return this.dynamoDBStorage.getGoalById(id);
  }
  
  async getGoalsByUserId(userId: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getGoalsByUserId(userId);
    return this.dynamoDBStorage.getGoalsByUserId(userId);
  }
  
  async createGoal(goalData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.createGoal(goalData);
    return this.dynamoDBStorage.createGoal(goalData);
  }
  
  async updateGoal(id: number, goalData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.updateGoal(id, goalData);
    return this.dynamoDBStorage.updateGoal(id, goalData);
  }
  
  async deleteGoal(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.deleteGoal(id);
    return this.dynamoDBStorage.deleteGoal(id);
  }
  
  // Habit operations
  async getHabitById(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getHabitById(id);
    return this.dynamoDBStorage.getHabitById(id);
  }
  
  async getHabitsByUserId(userId: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getHabitsByUserId(userId);
    return this.dynamoDBStorage.getHabitsByUserId(userId);
  }
  
  async createHabit(habitData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.createHabit(habitData);
    return this.dynamoDBStorage.createHabit(habitData);
  }
  
  async updateHabit(id: number, habitData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.updateHabit(id, habitData);
    return this.dynamoDBStorage.updateHabit(id, habitData);
  }
  
  async deleteHabit(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.deleteHabit(id);
    return this.dynamoDBStorage.deleteHabit(id);
  }
  
  // Journal operations
  async getJournalById(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getJournalById(id);
    return this.dynamoDBStorage.getJournalById(id);
  }
  
  async getJournalsByUserId(userId: number, limit?: number) {
    if (SKIP_DYNAMODB) {
      const journals = await mockDynamoDBOperations.getJournalsByUserId(userId);
      return limit ? journals.slice(0, limit) : journals;
    }
    return this.dynamoDBStorage.getJournalsByUserId(userId, limit);
  }
  
  async createJournal(journalData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.createJournal(journalData);
    return this.dynamoDBStorage.createJournal(journalData);
  }
  
  async updateJournal(id: number, journalData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.updateJournal(id, journalData);
    return this.dynamoDBStorage.updateJournal(id, journalData);
  }
  
  async deleteJournal(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.deleteJournal(id);
    return this.dynamoDBStorage.deleteJournal(id);
  }
  
  // Conversation operations
  async getConversationById(id: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getConversationById(id);
    return this.dynamoDBStorage.getConversationById(id);
  }
  
  async getConversationByUserId(userId: number) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.getConversationsByUserId(userId)[0] || null;
    return this.dynamoDBStorage.getConversationByUserId(userId);
  }
  
  async createConversation(conversationData: any) {
    if (SKIP_DYNAMODB) return mockDynamoDBOperations.createConversation(conversationData);
    return this.dynamoDBStorage.createConversation(conversationData);
  }
  
  async addMessageToConversation(id: number, messageData: any) {
    if (SKIP_DYNAMODB) {
      const conversation = await this.getConversationById(id);
      if (!conversation) return null;
      
      conversation.messages = [...conversation.messages, messageData];
      return conversation;
    }
    return this.dynamoDBStorage.addMessageToConversation(id, messageData);
  }
}

// Export a singleton instance
export const storage = new Storage();

// Function to seed initial data
export async function seedData() {
  try {
    await storage.init();
    
    // Check if demo user exists
    const demoUser = await storage.getUserByUsername('demo');
    if (!demoUser) {
      console.log("Creating demo user...");
      await storage.createUser({
        username: 'demo',
        password: 'password123', // In a real app, this would be hashed
        email: 'demo@example.com',
        name: 'Demo User',
        avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
        level: 1,
        points: 120,
        traits: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6 },
        preferences: { gender: 'female', theme: 'light' }
      });
    }
    
    console.log("Data seeding complete");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}