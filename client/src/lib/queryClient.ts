import { QueryClient } from '@tanstack/react-query';
import { mockApi, mockUsers } from '../mock-data';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Base URL for API requests
const API_BASE_URL = '';

// Function to make API requests
export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<Response> {
  // For development, use mock API responses
  if (endpoint === '/api/auth/login' && method === 'POST') {
    try {
      const userData = await mockApi.login(data.username, data.password);
      return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: error instanceof Error ? error.message : 'Login failed' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  if (endpoint === '/api/auth/register' && method === 'POST') {
    try {
      const userData = await mockApi.register(data);
      return new Response(JSON.stringify(userData), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: error instanceof Error ? error.message : 'Registration failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  if (endpoint === '/api/auth/me' && method === 'GET') {
    try {
      const userData = await mockApi.getCurrentUser();
      return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  if (endpoint === '/api/auth/logout' && method === 'POST') {
    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Handle user profile updates
  if (endpoint.startsWith('/api/users/') && method === 'PATCH') {
    try {
      const userId = parseInt(endpoint.split('/')[3]);
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return new Response(JSON.stringify({ message: "User not found" }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Update user data
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...data,
        // Preserve password
        password: mockUsers[userIndex].password,
        // Handle nested preferences object
        preferences: {
          ...mockUsers[userIndex].preferences,
          ...(data.preferences || {})
        }
      };
      
      // Return updated user without password
      const { password, ...updatedUser } = mockUsers[userIndex];
      
      console.log("Updated user:", updatedUser);
      
      return new Response(JSON.stringify(updatedUser), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response(JSON.stringify({ message: "Failed to update user" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // For real API requests
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies/sessions
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return response;
  } catch (error) {
    console.error(`API request error (${method} ${endpoint}):`, error);
    throw error;
  }
}