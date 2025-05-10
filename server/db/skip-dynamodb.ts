// Check if SKIP_DYNAMODB environment variable is set
export const SKIP_DYNAMODB = process.env.SKIP_DYNAMODB === 'true';

// --- Mock Data ---
const mockUsers: any[] = [
  {
    id: 1,
    username: 'demo',
    password: 'password123', // In real apps, hash passwords!
    email: 'demo@example.com',
    name: 'Demo User',
    avatarUrl: 'data:image/svg+xml;base64,...',
    level: 1,
    points: 120,
    traits: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6 },
    preferences: { gender: 'female', theme: 'light' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockGoals: any[] = [
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
  }
];

const mockHabits: any[] = [
  {
    id: 1,
    userId: 1,
    title: 'Morning meditation',
    description: '10 minutes of mindfulness meditation each morning',
    frequency: 'daily',
    streak: 5,
    longestStreak: 14,
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    createdAt: '2023-10-01T00:00:00.000Z'
  }
];

const mockJournals: any[] = [
  {
    id: 1,
    userId: 1,
    title: 'Productive day at work',
    content: 'Today was incredibly productive...',
    date: '2023-10-15',
    sentiment: {
      rating: 4.5,
      analysis: 'Very positive sentiment...'
    },
    createdAt: '2023-10-15T00:00:00.000Z'
  }
];

const mockConversations: any[] = [
  {
    id: 1,
    userId: 1,
    title: 'Career advice',
    messages: [
      {
        role: 'user',
        content: 'Thinking of switching careers...',
        timestamp: '2023-10-01T10:00:00.000Z'
      },
      {
        role: 'assistant',
        content: 'Great choice! Start by...',
        timestamp: '2023-10-01T10:00:30.000Z'
      }
    ],
    createdAt: '2023-10-01T10:00:00.000Z'
  }
];

// --- Mock Operations ---
export const mockDynamoDBOperations = {
  // --- User Operations ---
  getUserById: async (id: number) => {
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user };
  },

  getUserByUsername: async (username: string) => {
    const user = mockUsers.find(u => u.username === username);
    return user ? { ...user } : null;
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

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      preferences: {
        ...mockUsers[userIndex].preferences,
        ...(userData.preferences || {})
      },
      updatedAt: new Date().toISOString()
    };

    return { ...mockUsers[userIndex] };
  },

  // --- Goal Operations ---
  getGoalsByUserId: async (userId: number) => {
    return mockGoals.filter(goal => goal.userId === userId);
  },

  createGoal: async (goalData: any) => {
    const newGoal = {
      id: mockGoals.length + 1,
      ...goalData,
      createdAt: new Date().toISOString()
    };
    mockGoals.push(newGoal);
    return { ...newGoal };
  },

  // --- Habit Operations ---
  getHabitsByUserId: async (userId: number) => {
    return mockHabits.filter(habit => habit.userId === userId);
  },

  createHabit: async (habitData: any) => {
    const newHabit = {
      id: mockHabits.length + 1,
      ...habitData,
      createdAt: new Date().toISOString()
    };
    mockHabits.push(newHabit);
    return { ...newHabit };
  },

  // --- Journal Operations ---
  getJournalsByUserId: async (userId: number) => {
    return mockJournals.filter(j => j.userId === userId);
  },

  createJournal: async (journalData: any) => {
    const newJournal = {
      id: mockJournals.length + 1,
      ...journalData,
      createdAt: new Date().toISOString()
    };
    mockJournals.push(newJournal);
    return { ...newJournal };
  },

  // --- Conversation Operations ---
  getConversationsByUserId: async (userId: number) => {
    return mockConversations.filter(c => c.userId === userId);
  },

  createConversation: async (convData: any) => {
    const newConversation = {
      id: mockConversations.length + 1,
      ...convData,
      createdAt: new Date().toISOString()
    };
    mockConversations.push(newConversation);
    return { ...newConversation };
  }
};
