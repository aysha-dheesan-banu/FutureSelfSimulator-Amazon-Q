import { ddbDocClient, TABLES } from "./dynamodb";
import { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

/**
 * DynamoDB storage implementation
 */
export class DynamoDBStorage {
  /**
   * Initialize DynamoDB tables
   */
  async initTables(): Promise<void> {
    try {
      // We're not creating tables here - that's handled by setup.ts
      // This is just a placeholder for any initialization logic
      console.log("DynamoDB tables initialized successfully");
    } catch (error) {
      console.error("Error initializing DynamoDB tables:", error);
      throw error;
    }
  }

  /**
   * Create a demo user if it doesn't exist
   */
  async createDemoUserIfNotExists(): Promise<void> {
    try {
      // Check if demo user exists
      const demoUser = await this.getUserByUsername("demo");
      
      if (!demoUser) {
        console.log("Creating demo user...");
        await this.createUser({
          username: "demo",
          password: "password123", // In a real app, this would be hashed
          email: "demo@example.com",
          name: "Demo User",
          avatarUrl: "/avatars/female-1.png",
          level: 1,
          points: 0,
          traits: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6 },
          preferences: { gender: "female", theme: "light" }
        });
        console.log("Demo user created successfully");
      } else {
        console.log("Demo user already exists");
      }
    } catch (error) {
      console.error("Error creating demo user:", error);
      throw error;
    }
  }

  /**
   * Get the next ID for a table
   */
  private async getNextId(tableName: string): Promise<number> {
    // In a real app, you'd use a counter table or UUID
    // This is a simple implementation for demo purposes
    try {
      const result = await ddbDocClient.send(
        new QueryCommand({
          TableName: tableName,
          Limit: 1,
          ScanIndexForward: false,
          KeyConditionExpression: "id > :minId",
          ExpressionAttributeValues: {
            ":minId": 0
          }
        })
      );
      
      const items = result.Items || [];
      return items.length > 0 ? (items[0].id as number) + 1 : 1;
    } catch (error) {
      console.error(`Error getting next ID for ${tableName}:`, error);
      return 1; // Default to 1 if there's an error
    }
  }

  // User operations
  async getUserById(id: number) {
    try {
      const result = await ddbDocClient.send(
        new GetCommand({
          TableName: TABLES.USERS,
          Key: { id }
        })
      );
      
      return result.Item;
    } catch (error) {
      console.error(`Error getting user ${id}:`, error);
      throw error;
    }
  }
  
  async getUserByUsername(username: string) {
    try {
      const result = await ddbDocClient.send(
        new QueryCommand({
          TableName: TABLES.USERS,
          IndexName: "UsernameIndex",
          KeyConditionExpression: "username = :username",
          ExpressionAttributeValues: {
            ":username": username
          }
        })
      );
      
      const items = result.Items || [];
      return items.length > 0 ? items[0] : null;
    } catch (error) {
      console.error(`Error getting user by username ${username}:`, error);
      throw error;
    }
  }
  
  async createUser(userData: any) {
    try {
      const id = await this.getNextId(TABLES.USERS);
      const user = { id, ...userData };
      
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLES.USERS,
          Item: user
        })
      );
      
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async updateUser(id: number, userData: any) {
    try {
      // Build update expression
      const updateExpressions = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(userData)) {
        if (key !== "id") { // Don't update the primary key
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      }
      
      if (updateExpressions.length === 0) {
        return await this.getUserById(id); // Nothing to update
      }
      
      const result = await ddbDocClient.send(
        new UpdateCommand({
          TableName: TABLES.USERS,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW"
        })
      );
      
      return result.Attributes;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }
  
  // Goal operations
  async getGoalById(id: number) {
    try {
      const result = await ddbDocClient.send(
        new GetCommand({
          TableName: TABLES.GOALS,
          Key: { id }
        })
      );
      
      return result.Item;
    } catch (error) {
      console.error(`Error getting goal ${id}:`, error);
      throw error;
    }
  }
  
  async getGoalsByUserId(userId: number) {
    try {
      const result = await ddbDocClient.send(
        new QueryCommand({
          TableName: TABLES.GOALS,
          IndexName: "UserIdIndex",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
      );
      
      return result.Items || [];
    } catch (error) {
      console.error(`Error getting goals for user ${userId}:`, error);
      throw error;
    }
  }
  
  async createGoal(goalData: any) {
    try {
      const id = await this.getNextId(TABLES.GOALS);
      const goal = { id, ...goalData };
      
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLES.GOALS,
          Item: goal
        })
      );
      
      return goal;
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  }
  
  async updateGoal(id: number, goalData: any) {
    try {
      // Build update expression
      const updateExpressions = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(goalData)) {
        if (key !== "id") { // Don't update the primary key
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      }
      
      if (updateExpressions.length === 0) {
        return await this.getGoalById(id); // Nothing to update
      }
      
      const result = await ddbDocClient.send(
        new UpdateCommand({
          TableName: TABLES.GOALS,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW"
        })
      );
      
      return result.Attributes;
    } catch (error) {
      console.error(`Error updating goal ${id}:`, error);
      throw error;
    }
  }
  
  async deleteGoal(id: number) {
    try {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: TABLES.GOALS,
          Key: { id }
        })
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting goal ${id}:`, error);
      throw error;
    }
  }
  
  // Habit operations
  async getHabitById(id: number) {
    try {
      const result = await ddbDocClient.send(
        new GetCommand({
          TableName: TABLES.HABITS,
          Key: { id }
        })
      );
      
      return result.Item;
    } catch (error) {
      console.error(`Error getting habit ${id}:`, error);
      throw error;
    }
  }
  
  async getHabitsByUserId(userId: number) {
    try {
      const result = await ddbDocClient.send(
        new QueryCommand({
          TableName: TABLES.HABITS,
          IndexName: "UserIdIndex",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
      );
      
      return result.Items || [];
    } catch (error) {
      console.error(`Error getting habits for user ${userId}:`, error);
      throw error;
    }
  }
  
  async createHabit(habitData: any) {
    try {
      const id = await this.getNextId(TABLES.HABITS);
      const habit = { id, ...habitData };
      
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLES.HABITS,
          Item: habit
        })
      );
      
      return habit;
    } catch (error) {
      console.error("Error creating habit:", error);
      throw error;
    }
  }
  
  async updateHabit(id: number, habitData: any) {
    try {
      // Build update expression
      const updateExpressions = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(habitData)) {
        if (key !== "id") { // Don't update the primary key
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      }
      
      if (updateExpressions.length === 0) {
        return await this.getHabitById(id); // Nothing to update
      }
      
      const result = await ddbDocClient.send(
        new UpdateCommand({
          TableName: TABLES.HABITS,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW"
        })
      );
      
      return result.Attributes;
    } catch (error) {
      console.error(`Error updating habit ${id}:`, error);
      throw error;
    }
  }
  
  async deleteHabit(id: number) {
    try {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: TABLES.HABITS,
          Key: { id }
        })
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting habit ${id}:`, error);
      throw error;
    }
  }
  
  // Journal operations
  async getJournalById(id: number) {
    try {
      const result = await ddbDocClient.send(
        new GetCommand({
          TableName: TABLES.JOURNALS,
          Key: { id }
        })
      );
      
      return result.Item;
    } catch (error) {
      console.error(`Error getting journal ${id}:`, error);
      throw error;
    }
  }
  
  async getJournalsByUserId(userId: number) {
    try {
      const result = await ddbDocClient.send(
        new QueryCommand({
          TableName: TABLES.JOURNALS,
          IndexName: "UserIdIndex",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
      );
      
      return result.Items || [];
    } catch (error) {
      console.error(`Error getting journals for user ${userId}:`, error);
      throw error;
    }
  }
  
  async createJournal(journalData: any) {
    try {
      const id = await this.getNextId(TABLES.JOURNALS);
      const journal = { id, ...journalData };
      
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLES.JOURNALS,
          Item: journal
        })
      );
      
      return journal;
    } catch (error) {
      console.error("Error creating journal:", error);
      throw error;
    }
  }
  
  async updateJournal(id: number, journalData: any) {
    try {
      // Build update expression
      const updateExpressions = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(journalData)) {
        if (key !== "id") { // Don't update the primary key
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      }
      
      if (updateExpressions.length === 0) {
        return await this.getJournalById(id); // Nothing to update
      }
      
      const result = await ddbDocClient.send(
        new UpdateCommand({
          TableName: TABLES.JOURNALS,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW"
        })
      );
      
      return result.Attributes;
    } catch (error) {
      console.error(`Error updating journal ${id}:`, error);
      throw error;
    }
  }
  
  async deleteJournal(id: number) {
    try {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: TABLES.JOURNALS,
          Key: { id }
        })
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting journal ${id}:`, error);
      throw error;
    }
  }
  
  // Conversation operations
  async getConversationById(id: number) {
    try {
      const result = await ddbDocClient.send(
        new GetCommand({
          TableName: TABLES.CONVERSATIONS,
          Key: { id }
        })
      );
      
      return result.Item;
    } catch (error) {
      console.error(`Error getting conversation ${id}:`, error);
      throw error;
    }
  }
  
  async getConversationsByUserId(userId: number) {
    try {
      const result = await ddbDocClient.send(
        new QueryCommand({
          TableName: TABLES.CONVERSATIONS,
          IndexName: "UserIdIndex",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
      );
      
      return result.Items || [];
    } catch (error) {
      console.error(`Error getting conversations for user ${userId}:`, error);
      throw error;
    }
  }
  
  async createConversation(conversationData: any) {
    try {
      const id = await this.getNextId(TABLES.CONVERSATIONS);
      const conversation = { id, ...conversationData };
      
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLES.CONVERSATIONS,
          Item: conversation
        })
      );
      
      return conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  }
  
  async updateConversation(id: number, conversationData: any) {
    try {
      // Build update expression
      const updateExpressions = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(conversationData)) {
        if (key !== "id") { // Don't update the primary key
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      }
      
      if (updateExpressions.length === 0) {
        return await this.getConversationById(id); // Nothing to update
      }
      
      const result = await ddbDocClient.send(
        new UpdateCommand({
          TableName: TABLES.CONVERSATIONS,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW"
        })
      );
      
      return result.Attributes;
    } catch (error) {
      console.error(`Error updating conversation ${id}:`, error);
      throw error;
    }
  }
  
  async deleteConversation(id: number) {
    try {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: TABLES.CONVERSATIONS,
          Key: { id }
        })
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting conversation ${id}:`, error);
      throw error;
    }
  }
}