// Mock user data
export const mockUsers = [
  {
    id: 1,
    username: "demo",
    password: "password123", // In a real app, this would be hashed
    email: "demo@example.com",
    name: "Demo User",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=",
    level: 1,
    points: 120,
    traits: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6 },
    preferences: { gender: "female", theme: "light" }
  }
];

// Mock API handlers
export const mockApi = {
  login: async (username: string, password: string) => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    const { password: _, ...userData } = user;
    return userData;
  },
  
  register: async (userData: any) => {
    // Check if username exists
    if (mockUsers.some(u => u.username === userData.username)) {
      throw new Error("Username already exists");
    }
    
    // Check if email exists
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error("Email already registered");
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      level: 1,
      points: 0,
      traits: { openness: 0.5, conscientiousness: 0.5, extraversion: 0.5 },
      preferences: { gender: "other", theme: "light" }
    };
    
    mockUsers.push(newUser);
    
    const { password: _, ...newUserData } = newUser;
    return newUserData;
  },
  
  getCurrentUser: async () => {
    // Simulate getting the current user from session
    const user = mockUsers[0];
    const { password: _, ...userData } = user;
    return userData;
  },
  
  updateUser: async (userId: number, userData: any) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      // Preserve password
      password: mockUsers[userIndex].password,
      // Handle nested preferences object
      preferences: {
        ...mockUsers[userIndex].preferences,
        ...(userData.preferences || {})
      }
    };
    
    // Return updated user without password
    const { password: _, ...updatedUser } = mockUsers[userIndex];
    return updatedUser;
  }
};