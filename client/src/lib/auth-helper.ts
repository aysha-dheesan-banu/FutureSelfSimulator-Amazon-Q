/**
 * Helper functions for authentication and user management
 */

// Clear all stored profile data
export function clearProfileData(): void {
  try {
    // Remove all profile-related items from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('futureProfile_') || key === 'futureUser') {
        localStorage.removeItem(key);
      }
    });
    
    console.log('All profile data cleared');
  } catch (error) {
    console.error('Error clearing profile data:', error);
  }
}

// Create a demo user for easy access
export function createDemoUser(): any {
  const demoUser = {
    id: 1,
    username: "demo",
    email: "demo@example.com",
    name: "Demo User",
    avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
    level: 1,
    points: 0
  };
  
  // Store user data
  localStorage.setItem("futureUser", JSON.stringify(demoUser));
  
  return demoUser;
}

// Check if the current user is the demo user
export function isDemoUser(): boolean {
  try {
    const storedUser = localStorage.getItem("futureUser");
    if (!storedUser) return false;
    
    const user = JSON.parse(storedUser);
    return user.username === "demo";
  } catch (error) {
    return false;
  }
}

// Get the current user from localStorage
export function getCurrentUser(): any {
  try {
    const storedUser = localStorage.getItem("futureUser");
    if (!storedUser) return null;
    
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}