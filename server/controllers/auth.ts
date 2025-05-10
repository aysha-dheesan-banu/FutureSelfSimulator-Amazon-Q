import { Request, Response } from "express";
import { storage } from "../storage";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, name } = req.body;
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    // Create new user
    const newUser = await storage.createUser({
      username,
      password, // In a real app, this would be hashed
      email,
      name,
      avatarUrl: "/avatars/female-1.png", // Default avatar
      level: 1,
      points: 0,
      preferences: { gender: "female", theme: "light" }
    });
    
    // Set user in session
    if (req.session) {
      req.session.userId = newUser.id;
    }
    
    // Return user data (excluding password)
    const { password: _, ...userData } = newUser;
    return res.status(201).json(userData);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Check password (in a real app, you'd compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Set user in session
    if (req.session) {
      req.session.userId = user.id;
    }
    
    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    return res.json(userData);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const logout = (req: Request, res: Response) => {
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
};

export const getCurrentUser = async (req: Request, res: Response) => {
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
};