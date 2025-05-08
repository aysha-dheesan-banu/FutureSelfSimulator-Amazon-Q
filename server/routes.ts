import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertFutureProfileSchema, 
  insertGoalSchema, 
  insertHabitSchema, 
  insertJournalSchema,
  InsertJournal
} from "@shared/schema";
import { analyzeSentiment } from "./services/openai-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from the response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid user data",
          errors: validationResult.error.format() 
        });
      }
      
      const { username, email } = validationResult.data;
      
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(validationResult.data);
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/users/:id/points", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { points } = req.body;
      
      if (isNaN(userId) || typeof points !== "number") {
        return res.status(400).json({ message: "Invalid user ID or points" });
      }
      
      const user = await storage.updateUserPoints(userId, points);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Update user points error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/users/:id/level", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { level } = req.body;
      
      if (isNaN(userId) || typeof level !== "number") {
        return res.status(400).json({ message: "Invalid user ID or level" });
      }
      
      const user = await storage.updateUserLevel(userId, level);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Update user level error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/users/:id/traits", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { traits } = req.body;
      
      if (isNaN(userId) || !traits || typeof traits !== "object") {
        return res.status(400).json({ message: "Invalid user ID or traits" });
      }
      
      const user = await storage.updateUserTraits(userId, traits);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Update user traits error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Future profile routes
  app.get("/api/future-profiles/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const profile = await storage.getFutureProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Future profile not found" });
      }
      
      return res.status(200).json(profile);
    } catch (error) {
      console.error("Get future profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/future-profiles", async (req: Request, res: Response) => {
    try {
      const validationResult = insertFutureProfileSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid future profile data",
          errors: validationResult.error.format() 
        });
      }
      
      const profile = await storage.createFutureProfile(validationResult.data);
      
      return res.status(201).json(profile);
    } catch (error) {
      console.error("Create future profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/future-profiles/:id", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.id);
      
      if (isNaN(profileId)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      const profile = await storage.updateFutureProfile(profileId, req.body);
      
      if (!profile) {
        return res.status(404).json({ message: "Future profile not found" });
      }
      
      return res.status(200).json(profile);
    } catch (error) {
      console.error("Update future profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Goals routes
  app.get("/api/goals/:id", async (req: Request, res: Response) => {
    try {
      const goalId = parseInt(req.params.id);
      
      if (isNaN(goalId)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
      
      const goal = await storage.getGoal(goalId);
      
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      return res.status(200).json(goal);
    } catch (error) {
      console.error("Get goal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/goals", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const goals = await storage.getGoalsByUser(userId);
      
      return res.status(200).json(goals);
    } catch (error) {
      console.error("Get goals by user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/goals", async (req: Request, res: Response) => {
    try {
      const validationResult = insertGoalSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid goal data",
          errors: validationResult.error.format() 
        });
      }
      
      const goal = await storage.createGoal(validationResult.data);
      
      return res.status(201).json(goal);
    } catch (error) {
      console.error("Create goal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/goals/:id", async (req: Request, res: Response) => {
    try {
      const goalId = parseInt(req.params.id);
      
      if (isNaN(goalId)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
      
      const goal = await storage.updateGoal(goalId, req.body);
      
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      return res.status(200).json(goal);
    } catch (error) {
      console.error("Update goal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/goals/:id", async (req: Request, res: Response) => {
    try {
      const goalId = parseInt(req.params.id);
      
      if (isNaN(goalId)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
      
      const success = await storage.deleteGoal(goalId);
      
      if (!success) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Delete goal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Habits routes
  app.get("/api/habits/:id", async (req: Request, res: Response) => {
    try {
      const habitId = parseInt(req.params.id);
      
      if (isNaN(habitId)) {
        return res.status(400).json({ message: "Invalid habit ID" });
      }
      
      const habit = await storage.getHabit(habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      return res.status(200).json(habit);
    } catch (error) {
      console.error("Get habit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/habits", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const habits = await storage.getHabitsByUser(userId);
      
      return res.status(200).json(habits);
    } catch (error) {
      console.error("Get habits by user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/habits", async (req: Request, res: Response) => {
    try {
      const validationResult = insertHabitSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid habit data",
          errors: validationResult.error.format() 
        });
      }
      
      const habit = await storage.createHabit(validationResult.data);
      
      return res.status(201).json(habit);
    } catch (error) {
      console.error("Create habit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/habits/:id", async (req: Request, res: Response) => {
    try {
      const habitId = parseInt(req.params.id);
      
      if (isNaN(habitId)) {
        return res.status(400).json({ message: "Invalid habit ID" });
      }
      
      const habit = await storage.updateHabit(habitId, req.body);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      return res.status(200).json(habit);
    } catch (error) {
      console.error("Update habit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/habits/:id/complete", async (req: Request, res: Response) => {
    try {
      const habitId = parseInt(req.params.id);
      const { completed } = req.body;
      
      if (isNaN(habitId) || typeof completed !== "boolean") {
        return res.status(400).json({ message: "Invalid habit ID or completed state" });
      }
      
      const habit = await storage.completeHabit(habitId, completed);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      return res.status(200).json(habit);
    } catch (error) {
      console.error("Complete habit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/habits/:id", async (req: Request, res: Response) => {
    try {
      const habitId = parseInt(req.params.id);
      
      if (isNaN(habitId)) {
        return res.status(400).json({ message: "Invalid habit ID" });
      }
      
      const success = await storage.deleteHabit(habitId);
      
      if (!success) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Delete habit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Journal routes
  app.get("/api/journals/:id", async (req: Request, res: Response) => {
    try {
      const journalId = parseInt(req.params.id);
      
      if (isNaN(journalId)) {
        return res.status(400).json({ message: "Invalid journal ID" });
      }
      
      const journal = await storage.getJournal(journalId);
      
      if (!journal) {
        return res.status(404).json({ message: "Journal not found" });
      }
      
      return res.status(200).json(journal);
    } catch (error) {
      console.error("Get journal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/journals", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const journals = await storage.getJournalsByUser(userId, limit);
      
      return res.status(200).json(journals);
    } catch (error) {
      console.error("Get journals by user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/journals", async (req: Request, res: Response) => {
    try {
      // Create a schema specifically for the request body which doesn't include sentiment
      const createJournalSchema = insertJournalSchema.omit({ sentiment: true });
      
      const validationResult = createJournalSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid journal data",
          errors: validationResult.error.format() 
        });
      }
      
      const journalData = validationResult.data;
      
      // Analyze sentiment
      const sentiment = await analyzeSentiment(journalData.content);
      
      // Create the journal with the sentiment data
      const journal = await storage.createJournal({
        ...journalData,
        sentiment
      });
      
      return res.status(201).json(journal);
    } catch (error) {
      console.error("Create journal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/journals/:id", async (req: Request, res: Response) => {
    try {
      const journalId = parseInt(req.params.id);
      
      if (isNaN(journalId)) {
        return res.status(400).json({ message: "Invalid journal ID" });
      }
      
      let updateData: Partial<InsertJournal> = req.body;
      
      // If content is being updated, re-analyze sentiment
      if (req.body.content) {
        const sentiment = await analyzeSentiment(req.body.content);
        updateData = { ...updateData, sentiment };
      }
      
      const journal = await storage.updateJournal(journalId, updateData);
      
      if (!journal) {
        return res.status(404).json({ message: "Journal not found" });
      }
      
      return res.status(200).json(journal);
    } catch (error) {
      console.error("Update journal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/journals/:id", async (req: Request, res: Response) => {
    try {
      const journalId = parseInt(req.params.id);
      
      if (isNaN(journalId)) {
        return res.status(400).json({ message: "Invalid journal ID" });
      }
      
      const success = await storage.deleteJournal(journalId);
      
      if (!success) {
        return res.status(404).json({ message: "Journal not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Delete journal error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Conversation routes
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }
      
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      return res.status(200).json(conversation);
    } catch (error) {
      console.error("Get conversation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/conversation", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const conversation = await storage.getConversationByUser(userId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      return res.status(200).json(conversation);
    } catch (error) {
      console.error("Get conversation by user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const validationSchema = z.object({
        userId: z.number(),
        message: z.string()
      });
      
      const validationResult = validationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid conversation data",
          errors: validationResult.error.format() 
        });
      }
      
      const { userId, message } = validationResult.data;
      const timestamp = new Date().toISOString();
      
      // Check if user already has a conversation
      let conversation = await storage.getConversationByUser(userId);
      
      if (!conversation) {
        // Create a new conversation
        conversation = await storage.createConversation({
          userId,
          messages: [
            {
              role: "user",
              content: message,
              timestamp
            }
          ],
          lastUpdated: new Date()
        });
        
        return res.status(201).json(conversation);
      } else {
        // Add message to existing conversation
        const updatedConversation = await storage.updateConversation(
          conversation.id,
          {
            role: "user",
            content: message,
            timestamp
          }
        );
        
        return res.status(200).json(updatedConversation);
      }
    } catch (error) {
      console.error("Create/update conversation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/conversations/:id/reply", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { message } = req.body;
      
      if (isNaN(conversationId) || !message) {
        return res.status(400).json({ message: "Invalid conversation ID or message" });
      }
      
      // Get the current conversation
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // TODO: Generate AI response using OpenAI service
      // For now, we'll use a mock response
      const aiResponse = "I'm your AI coach and I'm here to help you reach your goals. Let's work together to create a plan that fits your lifestyle.";
      
      // Add AI response to conversation
      const updatedConversation = await storage.updateConversation(
        conversationId,
        {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date().toISOString()
        }
      );
      
      return res.status(200).json(updatedConversation);
    } catch (error) {
      console.error("Conversation reply error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
