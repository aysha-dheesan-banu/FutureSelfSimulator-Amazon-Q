/**
 * Generate direct responses based on user input
 */

/**
 * Creates a personalized response based on the user's exact question
 * @param question The user's question or input
 * @returns A personalized response that directly addresses the question
 */
export function generateDirectResponse(question: string): string {
  // Extract key terms from the question
  const cleanQuestion = question.toLowerCase().trim();
  const words = cleanQuestion.split(/\s+/);
  
  // Extract main topic and action
  const mainTopic = extractMainTopic(cleanQuestion);
  const actionType = extractActionType(cleanQuestion);
  
  // Generate a response that directly references the question
  return createPersonalizedResponse(mainTopic, actionType, question);
}

/**
 * Extract the main topic from the question
 */
function extractMainTopic(question: string): string {
  // Common topics people ask about
  const topics = [
    "yoga", "meditation", "running", "fitness", "exercise", "workout", "gym",
    "diet", "nutrition", "food", "eating", "meal", "weight", "fat", "muscle",
    "sleep", "rest", "recovery", "stress", "anxiety", "mental health",
    "productivity", "focus", "concentration", "procrastination", "habit",
    "routine", "morning", "evening", "time management", "goal", "motivation"
  ];
  
  // Find the first topic that appears in the question
  for (const topic of topics) {
    if (question.includes(topic)) {
      return topic;
    }
  }
  
  // Default to a generic topic if none found
  return "self-improvement";
}

/**
 * Extract the action type from the question
 */
function extractActionType(question: string): string {
  if (question.includes("how to") || question.includes("how do I")) {
    return "instruction";
  }
  if (question.includes("why")) {
    return "explanation";
  }
  if (question.includes("best") || question.includes("recommend")) {
    return "recommendation";
  }
  if (question.includes("difference") || question.includes("compare")) {
    return "comparison";
  }
  if (question.includes("help") || question.includes("advice")) {
    return "advice";
  }
  
  // Default action type
  return "information";
}

/**
 * Create a personalized response based on topic and action type
 */
function createPersonalizedResponse(topic: string, actionType: string, originalQuestion: string): string {
  // Start with an acknowledgment of the question
  let response = `I see you're asking about ${topic}. `;
  
  // Add topic-specific content
  switch (topic) {
    case "yoga":
      response += `Yoga is an excellent practice for both physical and mental wellbeing. `;
      
      if (actionType === "instruction") {
        response += `Here's a simple way to get started with yoga:

1. **Begin with basic poses**: Mountain pose, downward dog, and child's pose are great for beginners
2. **Focus on your breath**: Synchronize your movement with your breathing
3. **Start with short sessions**: Even 10-15 minutes daily is beneficial
4. **Use proper props**: A yoga mat, blocks, and a strap can help with proper alignment
5. **Follow along with guidance**: Consider using a beginner-friendly app or video

Would you like me to provide a specific 7-day yoga plan to help you get started?`;
      } else {
        response += `Regular yoga practice can improve flexibility, strength, posture, and reduce stress. 
        
For beginners, I recommend starting with a gentle Hatha or Yin yoga class. As you progress, you might explore Vinyasa for more movement or Ashtanga for a more challenging practice.

What specific aspect of yoga are you most interested in exploring?`;
      }
      break;
      
    case "running":
      response += `Running is one of the most accessible and effective forms of cardiovascular exercise. `;
      
      if (actionType === "instruction") {
        response += `Here's how to start a sustainable running practice:

1. **Get proper footwear**: Invest in running shoes that match your gait and foot type
2. **Start with run/walk intervals**: Alternate 1 minute running with 1-2 minutes walking
3. **Increase gradually**: Follow the 10% rule - don't increase weekly distance by more than 10%
4. **Focus on form**: Keep shoulders relaxed, slight forward lean, mid-foot strike
5. **Rest appropriately**: Include rest days between runs, especially as a beginner

Would you like a specific beginner running plan to follow?`;
      } else {
        response += `Regular running can improve cardiovascular health, build lower body strength, boost mood through endorphin release, and help with weight management.

For beginners, consistency is more important than speed or distance. Start where you are and progress gradually to avoid injury.

What specific running goals do you have in mind?`;
      }
      break;
      
    case "productivity":
      response += `Improving productivity can help you accomplish more while reducing stress. `;
      
      if (actionType === "instruction") {
        response += `Here are effective strategies to boost your productivity:

1. **Time blocking**: Schedule specific blocks of time for different types of work
2. **Pomodoro technique**: Work in focused 25-minute intervals with short breaks
3. **Eisenhower matrix**: Prioritize tasks based on importance and urgency
4. **Minimize distractions**: Create a dedicated workspace and use website blockers
5. **Energy management**: Schedule demanding tasks during your peak energy hours

Which of these techniques would you like to implement first?`;
      } else {
        response += `Productivity isn't just about doing more—it's about focusing on the right things at the right time.

The most productive people typically have clear systems, manage their energy (not just time), and are ruthless about eliminating or delegating low-value tasks.

What specific productivity challenge are you currently facing?`;
      }
      break;
      
    default:
      // For any other topic, create a generic but personalized response
      response += `I'd be happy to help you with your question about ${topic}.

Based on your question "${originalQuestion}", I can provide:

1. Specific strategies tailored to your needs
2. Evidence-based information on ${topic}
3. Step-by-step guidance for implementation
4. Common challenges and how to overcome them

To give you the most helpful advice, could you share a bit more about your specific goals or challenges with ${topic}?`;
  }
  
  return response;
}