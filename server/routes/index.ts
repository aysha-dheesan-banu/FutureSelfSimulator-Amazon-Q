import express from "express";
import session from "express-session";
import { createServer } from "http";
import authRoutes from "./auth";
import { config } from "../config";

export async function registerRoutes(app: express.Express) {
  // Set up session middleware
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );
  
  // API routes
  app.use("/api/auth", authRoutes);
  
  // Add other routes here
  
  // Create HTTP server
  const server = createServer(app);
  
  return server;
}