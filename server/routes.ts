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
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
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
      
      // Check if email exists (if your storage has this method)
      try {
        const existingUserByEmail = await storage.getUserByEmail(email);
        if (existingUserByEmail) {
          return res.status(409).json({ message: "Email already registered" });
        }
      } catch (e) {
        // If getUserByEmail is not implemented, just continue
        console.log("getUserByEmail not implemented, skipping email check");
      }
      
      const user = await storage.createUser(validationResult.data);
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
      });
    } else {
      return res.json({ message: "Logged out successfully" });
    }
  });
  
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      // Check if user is logged in
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Get user data
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Return user data (excluding password)
      const { password: _, ...userData } = user;
      return res.json(userData);
    } catch (error) {
      console.error("Get current user error:", error);
      return res.status(500).json({ message: "Failed to get current user" });
    }
  });
  
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUserById(userId);
      
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
  
  // User profile update endpoint
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if user exists
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user data
      const updatedUser = await storage.updateUser(userId, req.body);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
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
      console.log("Creating future profile with data:", JSON.stringify(req.body, null, 2));
      
      // Ensure userId is within PostgreSQL integer range
      if (req.body.userId && typeof req.body.userId === 'number') {
        req.body.userId = Math.min(req.body.userId, 2147483647);
      }
      
      // Handle skills and hobbies if they're strings
      if (req.body.skills && typeof req.body.skills === 'string') {
        req.body.skills = req.body.skills.split(',').map((s: string) => s.trim());
      }
      
      if (req.body.hobbies && typeof req.body.hobbies === 'string') {
        req.body.hobbies = req.body.hobbies.split(',').map((s: string) => s.trim());
      }
      
      const validationResult = insertFutureProfileSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        console.error("Validation error:", validationResult.error.format());
        return res.status(400).json({ 
          message: "Invalid future profile data",
          errors: validationResult.error.format() 
        });
      }
      
      const profile = await storage.createFutureProfile(validationResult.data);
      console.log("Profile created successfully:", JSON.stringify(profile, null, 2));
      
      return res.status(201).json(profile);
    } catch (error) {
      console.error("Create future profile error:", error);
      return res.status(500).json({ 
        message: "Internal server error", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Goal routes
  app.get("/api/goals/:id", async (req: Request, res: Response) => {
    try {
      const goalId = parseInt(req.params.id);
      
      if (isNaN(goalId)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
      
      const goal = await storage.getGoalById(goalId);
      
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
      
      const goals = await storage.getGoalsByUserId(userId);
      
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
  
  // Habit routes
  app.get("/api/habits/:id", async (req: Request, res: Response) => {
    try {
      const habitId = parseInt(req.params.id);
      
      if (isNaN(habitId)) {
        return res.status(400).json({ message: "Invalid habit ID" });
      }
      
      const habit = await storage.getHabitById(habitId);
      
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
      
      const habits = await storage.getHabitsByUserId(userId);
      
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
  
  // Journal routes
  app.post("/api/journals", async (req: Request, res: Response) => {
    try {
      console.log("Received journal data:", JSON.stringify(req.body, null, 2));
      
      // Extract the basic required fields
      const { userId, content, date } = req.body;
      
      if (!userId || !content) {
        return res.status(400).json({ 
          message: "Missing required fields: userId and content are required"
        });
      }
      
      // Extract optional metadata if present
      const metadata = req.body.metadata || {};
      
      // Analyze sentiment
      const sentiment = await analyzeSentiment(content);
      console.log("Sentiment analysis result:", sentiment);
      
      // Create the journal with the sentiment data
      const journal = await storage.createJournal({
        userId,
        content,
        date: date || new Date().toISOString(),
        sentiment,
        metadata
      });
      
      console.log("Journal created successfully:", journal);
      return res.status(201).json(journal);
    } catch (error) {
      console.error("Create journal error:", error);
      return res.status(500).json({ 
        message: "Internal server error", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Conversation routes
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
      let conversation = await storage.getConversationByUserId(userId);
      
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
          ]
        });
        
        return res.status(201).json(conversation);
      } else {
        // Add message to existing conversation
        const updatedConversation = await storage.addMessageToConversation(
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
      const conversation = await storage.getConversationById(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // Import the OpenAI service
      const { generateCoachResponse } = await import("./services/openai-service");
      
      // Prepare conversation history for the AI
      const conversationHistory = Array.isArray(conversation.messages) 
        ? conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        : [];
      
      // Generate AI response using OpenAI
      console.log("Generating AI coach response...");
      
      const aiResponse = await generateCoachResponse(
        message,
        [
          { role: "system", content: "You are an AI life coach." },
          ...conversationHistory
        ],
        []
      );
      console.log("AI response generated:", aiResponse);
      
      // Add AI response to conversation
      const updatedConversation = await storage.addMessageToConversation(
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
  
  // Goal plan generation endpoint
  app.post("/api/coach/goal-plan", async (req: Request, res: Response) => {
    try {
      const { goalDescription, userContext } = req.body;
      
      if (!goalDescription) {
        return res.status(400).json({ message: "Goal description is required" });
      }
      
      // Import the OpenAI service
      const { generateGoalPlan } = await import("./services/openai-service");
      
      // Generate goal plan
      console.log("Generating goal plan for:", goalDescription);
      const goalPlan = await generateGoalPlan(goalDescription, userContext);
      
      return res.status(200).json({ plan: goalPlan });
    } catch (error) {
      console.error("Goal plan generation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Habit plan generation endpoint
  app.post("/api/coach/habit-plan", async (req: Request, res: Response) => {
    try {
      const { habitDescription } = req.body;
      
      if (!habitDescription) {
        return res.status(400).json({ message: "Habit description is required" });
      }
      
      // Import the OpenAI service
      const { generateHabitPlan } = await import("./services/openai-service");
      
      // Generate habit plan
      console.log("Generating habit plan for:", habitDescription);
      const habitPlan = await generateHabitPlan(habitDescription);
      
      return res.status(200).json({ plan: habitPlan });
    } catch (error) {
      console.error("Habit plan generation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Future prediction endpoint
  app.get("/api/predictions/:userId/:timeframe", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const timeframe = req.params.timeframe as "1_month" | "6_months" | "1_year" | "5_years";
      
      if (isNaN(userId) || !["1_month", "6_months", "1_year", "5_years"].includes(timeframe)) {
        return res.status(400).json({ message: "Invalid user ID or timeframe" });
      }
      
      // Import the prediction service
      const { generateFuturePrediction } = await import("./services/future-prediction-service");
      
      // Generate prediction
      const prediction = await generateFuturePrediction(userId, timeframe);
      
      return res.status(200).json(prediction);
    } catch (error) {
      console.error("Future prediction error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}