// Check if SKIP_DYNAMODB environment variable is set
export const SKIP_DYNAMODB = process.env.SKIP_DYNAMODB === 'true';

// Mock data for when DynamoDB is skipped
const mockUsers = [
  {
    id: 1,
    username: 'demo',
    password: 'password123', // In a real app, this would be hashed
    email: 'demo@example.com',
    name: 'Demo User',
    avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    level: 1,
    points: 120,
    traits: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6 },
    preferences: { gender: 'female', theme: 'light' }
  }
];

const mockGoals = [
  {
    id: 1,
    userId: 1,
    title: 'Complete JavaScript course',
    description: 'Finish the advanced JavaScript course on Udemy',
    targetDate: '2023-12-31',
    progress: 75,
    status: 'in_progress',
    category: 'career',
    createdAt: '2023-10-01T00:00:00.000Z'
  },
  {
    id: 2,
    userId: 1,
    title: 'Run 5K',
    description: 'Train for and complete a 5K run',
    targetDate: '2023-11-15',
    progress: 60,
    status: 'in_progress',
    category: 'health',
    createdAt: '2023-10-05T00:00:00.000Z'
  },
  {
    id: 3,
    userId: 1,
    title: 'Read 12 books this year',
    description: 'Read one book per month to expand knowledge',
    targetDate: '2023-12-31',
    progress: 50,
    status: 'in_progress',
    category: 'personal',
    createdAt: '2023-09-15T00:00:00.000Z'
  }
];

const mockHabits = [
  {
    id: 1,
    userId: 1,
    title: 'Morning meditation',
    description: '10 minutes of mindfulness meditation each morning',
    frequency: 'daily',
    streak: 5,
    longestStreak: 14,
    targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
    createdAt: '2023-10-01T00:00:00.000Z'
  },
  {
    id: 2,
    userId: 1,
    title: 'Exercise',
    description: '30 minutes of physical activity',
    frequency: 'daily',
    streak: 3,
    longestStreak: 10,
    targetDays: [1, 3, 5], // Monday, Wednesday, Friday
    createdAt: '2023-10-05T00:00:00.000Z'
  },
  {
    id: 3,
    userId: 1,
    title: 'Read',
    description: 'Read for 20 minutes',
    frequency: 'daily',
    streak: 7,
    longestStreak: 21,
    targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
    createdAt: '2023-09-15T00:00:00.000Z'
  }
];

const mockJournals = [
  {
    id: 1,
    userId: 1,
    title: 'Productive day at work',
    content: 'Today was incredibly productive. I managed to complete the project ahead of schedule and received positive feedback from my manager. I'm feeling motivated to tackle more challenges tomorrow.',
    date: '2023-10-15',
    sentiment: {
      rating: 4.5,
      analysis: 'Very positive sentiment with themes of accomplishment and motivation.'
    },
    createdAt: '2023-10-15T00:00:00.000Z'
  },
  {
    id: 2,
    userId: 1,
    title: 'Reflecting on goals',
    content: 'Spent some time today reflecting on my quarterly goals. I'm making good progress on most of them, but I need to focus more on my health goals. Going to adjust my schedule to include more exercise time.',
    date: '2023-10-10',
    sentiment: {
      rating: 3.8,
      analysis: 'Positive sentiment with elements of self-reflection and planning.'
    },
    createdAt: '2023-10-10T00:00:00.000Z'
  },
  {
    id: 3,
    userId: 1,
    title: 'Challenging day',
    content: 'Today was difficult. Had a disagreement with a colleague that left me feeling frustrated. Need to work on my communication skills and find better ways to express my ideas without coming across as confrontational.',
    date: '2023-10-05',
    sentiment: {
      rating: 2.3,
      analysis: 'Somewhat negative sentiment with themes of frustration and self-criticism, but includes constructive reflection.'
    },
    createdAt: '2023-10-05T00:00:00.000Z'
  }
];

const mockConversations = [
  {
    id: 1,
    userId: 1,
    title: 'Career advice',
    messages: [
      {
        role: 'user',
        content: 'I\'m thinking about switching careers to software development. What steps should I take?',
        timestamp: '2023-10-01T10:00:00.000Z'
      },
      {
        role: 'assistant',
        content: 'Switching to software development is a great choice! I recommend starting with these steps: 1) Learn the fundamentals of programming through online courses, 2) Build small projects to apply what you\'ve learned, 3) Create a portfolio to showcase your work, 4) Network with other developers, and 5) Apply for entry-level positions or internships. Would you like more specific resources for any of these steps?',
        timestamp: '2023-10-01T10:00:30.000Z'
      }
    ],
    createdAt: '2023-10-01T10:00:00.000Z'
  }
];

// Mock DynamoDB operations
export const mockDynamoDBOperations = {
  // User operations
  getUserById: async (id: number) => {
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user };
  },
  
  getUserByUsername: async (username: string) => {
    const user = mockUsers.find(u => u.username === username);
    if (!user) return null;
    return { ...user };
  },
  
  createUser: async (userData: any) => {
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { ...newUser };
  },
  
  updateUser: async (id: number, userData: any) => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      // Handle nested preferences object
      preferences: {
        ...mockUsers[userIndex].preferences,
        ...(userData.preferences || {})
      },
      updatedAt: new Date().toISOString()
    };
    
    console.log("Updated user in mock DB:", mockUsers[userIndex]);
    
    return { ...mockUsers[userIndex] };
  },
  
  // Goal operations
  getGoalById: async (id: number) => {
    const goal = mockGoals.find(g => g.id === id);
    if (!goal) throw new Error('Goal not found');
    return { ...goal };
  },
  
  getGoalsByUserId: async (userId: number) => {
    return mockGoals.filter(g => g.userId === userId).map(g => ({ ...g }));
  },
  
  createGoal: async (goalData: any) => {
    const newGoal = {
      id: mockGoals.length + 1,
      ...goalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockGoals.push(newGoal);
    return { ...newGoal };
  },
  
  updateGoal: async (id: number, goalData: any) => {
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex === -1) throw new Error('Goal not found');
    
    mockGoals[goalIndex] = {
      ...mockGoals[goalIndex],
      ...goalData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockGoals[goalIndex] };
  },
  
  deleteGoal: async (id: number) => {
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex === -1) throw new Error('Goal not found');
    
    mockGoals.splice(goalIndex, 1);
    return true;
  },
  
  // Habit operations
  getHabitById: async (id: number) => {
    const habit = mockHabits.find(h => h.id === id);
    if (!habit) throw new Error('Habit not found');
    return { ...habit };
  },
  
  getHabitsByUserId: async (userId: number) => {
    return mockHabits.filter(h => h.userId === userId).map(h => ({ ...h }));
  },
  
  createHabit: async (habitData: any) => {
    const newHabit = {
      id: mockHabits.length + 1,
      ...habitData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockHabits.push(newHabit);
    return { ...newHabit };
  },
  
  updateHabit: async (id: number, habitData: any) => {
    const habitIndex = mockHabits.findIndex(h => h.id === id);
    if (habitIndex === -1) throw new Error('Habit not found');
    
    mockHabits[habitIndex] = {
      ...mockHabits[habitIndex],
      ...habitData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockHabits[habitIndex] };
  },
  
  deleteHabit: async (id: number) => {
    const habitIndex = mockHabits.findIndex(h => h.id === id);
    if (habitIndex === -1) throw new Error('Habit not found');
    
    mockHabits.splice(habitIndex, 1);
    return true;
  },
  
  // Journal operations
  getJournalById: async (id: number) => {
    const journal = mockJournals.find(j => j.id === id);
    if (!journal) throw new Error('Journal not found');
    return { ...journal };
  },
  
  getJournalsByUserId: async (userId: number) => {
    return mockJournals.filter(j => j.userId === userId).map(j => ({ ...j }));
  },
  
  createJournal: async (journalData: any) => {
    const newJournal = {
      id: mockJournals.length + 1,
      ...journalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockJournals.push(newJournal);
    return { ...newJournal };
  },
  
  updateJournal: async (id: number, journalData: any) => {
    const journalIndex = mockJournals.findIndex(j => j.id === id);
    if (journalIndex === -1) throw new Error('Journal not found');
    
    mockJournals[journalIndex] = {
      ...mockJournals[journalIndex],
      ...journalData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockJournals[journalIndex] };
  },
  
  deleteJournal: async (id: number) => {
    const journalIndex = mockJournals.findIndex(j => j.id === id);
    if (journalIndex === -1) throw new Error('Journal not found');
    
    mockJournals.splice(journalIndex, 1);
    return true;
  },
  
  // Conversation operations
  getConversationById: async (id: number) => {
    const conversation = mockConversations.find(c => c.id === id);
    if (!conversation) throw new Error('Conversation not found');
    return { ...conversation };
  },
  
  getConversationsByUserId: async (userId: number) => {
    return mockConversations.filter(c => c.userId === userId).map(c => ({ ...c }));
  },
  
  createConversation: async (conversationData: any) => {
    const newConversation = {
      id: mockConversations.length + 1,
      ...conversationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockConversations.push(newConversation);
    return { ...newConversation };
  },
  
  addMessageToConversation: async (id: number, messageData: any) => {
    const conversationIndex = mockConversations.findIndex(c => c.id === id);
    if (conversationIndex === -1) throw new Error('Conversation not found');
    
    mockConversations[conversationIndex].messages.push(messageData);
    mockConversations[conversationIndex].updatedAt = new Date().toISOString();
    
    return { ...mockConversations[conversationIndex] };
  }
};