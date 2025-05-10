/**
 * Mock AI Service
 * This service provides predefined responses for the AI coach functionality
 * without requiring an OpenAI API key.
 */

// Sample responses for different types of user messages
const RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! I'm your AI coach. How can I help you today?",
    "Hi there! I'm here to help you achieve your goals. What would you like to work on?",
    "Welcome back! What aspect of your personal development would you like to focus on today?"
  ],
  goals: [
    "Setting clear, specific goals is the first step to achieving them. What specific outcome are you aiming for?",
    "That's a great goal! Let's break it down into smaller, manageable steps. What's the first milestone you want to reach?",
    "I recommend using the SMART framework for your goals: Specific, Measurable, Achievable, Relevant, and Time-bound. How can we make your goal more specific?"
  ],
  motivation: [
    "Remember why you started this journey. Your future self will thank you for the effort you're putting in today.",
    "Progress isn't always linear. Even small steps forward are worth celebrating!",
    "When you feel like giving up, that's often when you're closest to a breakthrough. Keep going!"
  ],
  habits: [
    "Consistency is key when building new habits. Start small and focus on showing up every day.",
    "It takes about 66 days on average to form a new habit. How can we make this habit easier to maintain during that critical period?",
    "Try habit stacking - attach your new habit to an existing routine to make it easier to remember and implement."
  ],
  health: [
    "Physical health is the foundation of overall wellbeing. Even small improvements in diet, exercise, or sleep can have significant benefits.",
    "Remember that rest and recovery are just as important as activity when it comes to health improvement.",
    "Small, sustainable changes to your health habits are more effective than dramatic overhauls that are difficult to maintain."
  ],
  career: [
    "Career growth often comes from continuously expanding your skills and knowledge. What skill would most benefit your career right now?",
    "Networking and building relationships are crucial for career advancement. Who could you connect with in your field?",
    "Consider setting both short-term and long-term career goals to keep yourself motivated and on track."
  ],
  learning: [
    "Learning is most effective when it's active rather than passive. Try teaching what you've learned to someone else.",
    "Spaced repetition is one of the most effective learning techniques. Review material at increasing intervals to strengthen retention.",
    "Consider how you can apply what you're learning to real-world situations. Practical application enhances understanding."
  ],
  default: [
    "That's an interesting point. Let's explore how this relates to your goals.",
    "I understand. How do you think this affects your progress?",
    "Thank you for sharing that. What steps do you think you should take next?",
    "I'm here to support you on your journey. What specific help do you need right now?"
  ]
};

/**
 * Analyzes a message to determine its category
 */
function categorizeMessage(message: string): string {
  message = message.toLowerCase();
  
  if (message.match(/hello|hi|hey|greetings|howdy/)) {
    return "greeting";
  }
  if (message.match(/goal|aim|target|objective|achieve|accomplish/)) {
    return "goals";
  }
  if (message.match(/motivat|inspir|encourag|drive|push|stuck|hard|difficult|challenge/)) {
    return "motivation";
  }
  if (message.match(/habit|routine|daily|regular|consistent|practice/)) {
    return "habits";
  }
  if (message.match(/health|exercise|workout|diet|nutrition|sleep|rest|stress|mental/)) {
    return "health";
  }
  if (message.match(/career|job|work|profession|promotion|salary|interview|resume/)) {
    return "career";
  }
  if (message.match(/learn|study|course|education|knowledge|skill|train/)) {
    return "learning";
  }
  
  return "default";
}

/**
 * Generates a response based on the user's message
 */
export function generateMockResponse(message: string): string {
  const category = categorizeMessage(message);
  const responses = RESPONSES[category] || RESPONSES.default;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

/**
 * Mock implementation of sentiment analysis
 */
export function analyzeMockSentiment(text: string): { rating: number; confidence: number } {
  // Simple sentiment analysis based on positive and negative words
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'love', 'enjoy', 'positive', 'success'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'negative', 'fail', 'worry', 'stress'];
  
  text = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = text.match(regex);
    if (matches) positiveCount += matches.length;
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = text.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  // Calculate sentiment rating (1-5)
  let rating = 3; // Neutral by default
  if (positiveCount > negativeCount) {
    rating = Math.min(5, 3 + Math.ceil((positiveCount - negativeCount) / 2));
  } else if (negativeCount > positiveCount) {
    rating = Math.max(1, 3 - Math.ceil((negativeCount - positiveCount) / 2));
  }
  
  // Calculate confidence (0-1)
  const totalWords = text.split(/\s+/).length;
  const confidence = Math.min(0.9, Math.max(0.5, (positiveCount + negativeCount) / totalWords));
  
  return { rating, confidence };
}

/**
 * Generate mock future insights
 */
export function generateMockFutureInsights(
  userTraits: Record<string, any>,
  timelineYears: number,
  profileType: string = "professional"
): Record<string, string> {
  if (profileType === "student") {
    return {
      career: `In ${timelineYears} years, you could be starting your professional career in your field of study.`,
      education: `You might complete your current degree and possibly pursue higher education in the next ${timelineYears} years.`,
      skills: "Your current skills will develop further, and you'll likely add new ones relevant to your field.",
      health: "Maintaining regular exercise and healthy habits will improve your overall wellbeing.",
      relationships: "Building and nurturing meaningful connections will enhance your support network.",
      location: "You may find opportunities in areas with good job prospects for graduates in your field."
    };
  } else {
    return {
      career: `In ${timelineYears} years, you could advance in your current field with consistent effort.`,
      education: `You might complete additional certifications or training in the next ${timelineYears} years.`,
      health: "Maintaining regular exercise and healthy habits will improve your overall wellbeing.",
      wealth: `With disciplined saving and investing, your financial situation could improve significantly in ${timelineYears} years.`,
      relationships: "Building and nurturing meaningful connections will enhance your support network.",
      location: "You may find opportunities in areas with growth in your industry."
    };
  }
}

/**
 * Generate mock motivational quote
 */
export function generateMockQuote(): { quote: string; author: string } {
  const quotes = [
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" }
  ];
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}