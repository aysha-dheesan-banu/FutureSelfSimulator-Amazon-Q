import OpenAI from "openai";
import { Sentiment } from "@shared/schema";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-mock-key-for-development" });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Analyze sentiment of a journal entry
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating))),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    
    // Fallback sentiment in case of API error
    return {
      rating: 3,
      confidence: 0.5,
    };
  }
}

// Generate AI coach response
export async function generateCoachResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[],
  userGoals?: string[]
): Promise<string> {
  try {
    // Prepare conversation history for the context
    const messages = [
      {
        role: "system",
        content: `You are an AI life coach named Future Coach. Your goal is to help the user achieve their personal and professional goals through positive reinforcement, accountability, and actionable advice.
          
          ${userGoals && userGoals.length > 0 
            ? `The user has set the following goals: ${userGoals.join(", ")}.` 
            : "The user is working on setting and achieving personal growth goals."}
          
          Keep your responses conversational, empathetic, and focused on the user's needs. Provide practical advice that's easy to implement. Be encouraging but realistic.`,
      },
      ...conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm here to help you achieve your goals. What would you like to work on today?";
  } catch (error) {
    console.error("AI coach response error:", error);
    return "I'm having trouble connecting right now. Let's try again in a moment.";
  }
}

// Generate future self insights based on user traits and timeline
export async function generateFutureInsights(
  userTraits: Record<string, any>,
  timelineYears: number
): Promise<Record<string, string>> {
  try {
    const prompt = `Based on the following user traits and a timeline of ${timelineYears} years in the future, generate realistic projections for their career, education, health, wealth, relationships, and location. Provide specific and personalized details.
    
    User traits: ${JSON.stringify(userTraits)}
    
    Respond with a JSON object with the following keys: career, education, health, wealth, relationships, location.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const insights = JSON.parse(response.choices[0].message.content);
    return insights;
  } catch (error) {
    console.error("Future insights error:", error);
    
    // Fallback insights in case of API error
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

// Impact simulator projections
export async function simulateImpact(
  dailyLearning: number,
  weeklyExercise: number,
  savingsPercent: number,
  timelineYears: number
): Promise<Record<string, string>> {
  try {
    const prompt = `Simulate the impact of the following daily habits over ${timelineYears} years:
    
    - Daily learning time: ${dailyLearning} minutes per day
    - Weekly exercise: ${weeklyExercise} days per week
    - Income saved: ${savingsPercent}% of income
    
    Respond with a JSON object with the following keys: careerGrowth (percentage), healthImprovement (percentage), wealthAccumulation (dollar amount assuming $60,000 starting salary).`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const impact = JSON.parse(response.choices[0].message.content);
    return impact;
  } catch (error) {
    console.error("Impact simulation error:", error);
    
    // Fallback impact in case of API error
    return {
      careerGrowth: `+${Math.min(25, dailyLearning / 5)}% career growth per year`,
      healthImprovement: `+${Math.min(20, weeklyExercise * 3)}% health metrics improvement`,
      wealthAccumulation: `$${Math.round(60000 * (savingsPercent / 100) * timelineYears * (1 + 0.07) ** timelineYears)} saved in ${timelineYears} years`
    };
  }
}

// Generate motivational quote
export async function generateMotivationalQuote(): Promise<{ quote: string; author: string }> {
  try {
    const prompt = "Generate an inspiring, motivational quote about personal growth, self-improvement, or achieving goals. Include the author's name. Respond with a JSON object with 'quote' and 'author' keys.";

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      quote: result.quote,
      author: result.author,
    };
  } catch (error) {
    console.error("Quote generation error:", error);
    
    // Fallback quote in case of API error
    return {
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    };
  }
}
