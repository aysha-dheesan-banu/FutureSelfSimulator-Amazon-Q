import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useProvideAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if there's a user in localStorage on initial load
    const storedUser = localStorage.getItem("futureUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user", e);
        localStorage.removeItem("futureUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      const userData = await response.json();
      
      // Store user data
      setUser(userData);
      localStorage.setItem("futureUser", JSON.stringify(userData));
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const newUser = await response.json();
      
      // Store user data
      setUser(newUser);
      localStorage.setItem("futureUser", JSON.stringify(newUser));
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("futureUser");
    setLocation("/");
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return React.createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
