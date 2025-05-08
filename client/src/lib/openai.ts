import { apiRequest } from "./queryClient";

// Sentiment analysis for journal entries
export async function analyzeSentiment(text: string) {
  try {
    // This will send the journal text to our server, which will use OpenAI to analyze sentiment
    const response = await apiRequest("POST", "/api/journals", {
      userId: 1, // Default user for demo
      content: text,
      date: new Date().toISOString()
    });
    
    const data = await response.json();
    return data.sentiment;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw error;
  }
}

// Send message to AI coach
export async function sendCoachMessage(message: string, conversationId?: number) {
  try {
    if (conversationId) {
      // Add message to existing conversation
      const response = await apiRequest("POST", `/api/conversations/${conversationId}`, { 
        message 
      });
      
      // Get AI reply
      const replyResponse = await apiRequest("POST", `/api/conversations/${conversationId}/reply`, { 
        message 
      });
      
      return await replyResponse.json();
    } else {
      // Create new conversation
      const response = await apiRequest("POST", "/api/conversations", {
        userId: 1, // Default user for demo
        message
      });
      
      const conversation = await response.json();
      
      // Get AI reply
      const replyResponse = await apiRequest("POST", `/api/conversations/${conversation.id}/reply`, { 
        message 
      });
      
      return await replyResponse.json();
    }
  } catch (error) {
    console.error("Error sending coach message:", error);
    throw error;
  }
}

// Simulate impact of habits
export async function simulateImpact(dailyLearning: number, weeklyExercise: number, savingsPercent: number, timelineYears: number) {
  try {
    // This would typically call a backend endpoint that uses OpenAI for simulation
    // For now, we'll just return simulated data
    return {
      careerGrowth: `+${Math.min(25, dailyLearning / 5)}% career growth per year`,
      healthImprovement: `+${Math.min(20, weeklyExercise * 3)}% health metrics improvement`,
      wealthAccumulation: `$${Math.round(60000 * (savingsPercent / 100) * timelineYears * (1 + 0.07) ** timelineYears)} saved in ${timelineYears} years`
    };
  } catch (error) {
    console.error("Error simulating impact:", error);
    throw error;
  }
}

// Get motivational quote
export async function getMotivationalQuote() {
  // This would typically call a backend endpoint that uses OpenAI for quote generation
  // For now, we'll just return a default quote
  return {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  };
}
