import { config } from "../config";

// Mock implementation for development
export async function analyzeSentiment(text: string) {
  console.log("Mock sentiment analysis for:", text.substring(0, 50) + "...");
  
  // Generate a random sentiment between 1-5
  const rating = Math.floor(Math.random() * 5) + 1;
  let analysis = "";
  
  if (rating >= 4) {
    analysis = "The text expresses positive emotions and optimism.";
  } else if (rating >= 3) {
    analysis = "The text is neutral in tone with balanced emotions.";
  } else {
    analysis = "The text expresses some negative emotions or concerns.";
  }
  
  return {
    rating,
    analysis
  };
}

// Mock implementation for development
export async function generateCoachResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  userGoals: string[] = []
) {
  console.log("Mock coach response for:", userMessage.substring(0, 50) + "...");
  
  // Simple response templates based on message content
  if (userMessage.toLowerCase().includes("goal")) {
    return "Setting clear goals is important for personal growth. What specific goal would you like to work on? I can help you break it down into manageable steps.";
  }
  
  if (userMessage.toLowerCase().includes("habit")) {
    return "Habits are the foundation of lasting change. What habit are you trying to build or break? Remember that consistency is more important than intensity when forming new habits.";
  }
  
  if (userMessage.toLowerCase().includes("stress") || userMessage.toLowerCase().includes("anxiety")) {
    return "I'm sorry to hear you're feeling stressed. Taking time for self-care is important. Have you tried any relaxation techniques like deep breathing or mindfulness meditation? Even 5 minutes can make a difference.";
  }
  
  if (userMessage.toLowerCase().includes("motivat")) {
    return "Finding motivation can be challenging. Try connecting with your deeper 'why' - the reason behind your goals. Also, remember that motivation often follows action, not the other way around. Taking small steps can build momentum.";
  }
  
  // Default response
  return "Thank you for sharing that with me. I'm here to support your personal growth journey. What specific area would you like to focus on today?";
}

// Mock implementation for development
export async function generateGoalPlan(goalDescription: string, userContext?: string) {
  console.log("Mock goal plan for:", goalDescription);
  
  return `# Goal Plan: ${goalDescription}

## Goal Clarity
Your goal is to ${goalDescription}. This is an important step in your personal development journey.

## 7-Day Action Plan

### Day 1: Assessment & Planning
- Assess your current skills/knowledge related to this goal
- Research best practices and success stories
- Set 3 specific, measurable sub-goals
- Identify potential obstacles and solutions

### Day 2: Skill Building - Fundamentals
- Identify 3 core skills needed for your goal
- Spend 30-60 minutes practicing the most important skill
- Find learning resources (videos, articles, courses)

### Day 3: Environment Setup
- Organize your physical space to support your goal
- Gather necessary tools and resources
- Remove or minimize potential distractions
- Tell a supportive friend about your goal

### Day 4: Implementation - First Steps
- Complete one significant task toward your goal
- Apply what you learned on Day 2
- Document your process and results

### Day 5: Review & Adjust
- Review your progress so far
- Identify what's working well
- Note challenges and brainstorm solutions
- Adjust your approach based on learnings

### Day 6: Skill Building - Advanced
- Learn one more advanced technique
- Practice combining skills you've developed
- Connect with others pursuing similar goals

### Day 7: Habit Integration & Planning
- Create a specific plan for week 2
- Identify a trigger for your new habit
- Set up accountability system
- Schedule specific times for practice

## Resources Needed
- Tools specific to your goal
- Learning materials (books, courses, videos)
- Tracking system (journal, app, spreadsheet)
- Accountability partner or community

## Success Metrics
- Completion of daily actions
- Skill improvement
- Increased confidence
- Measurable progress toward goal
- Habit formation

## Next Steps
After completing this 7-day plan, you can:
1. Continue with more advanced skills
2. Increase duration or intensity
3. Set more challenging sub-goals
4. Find a mentor or community for support`;
}

// Mock implementation for development
export async function generateHabitPlan(habitDescription: string) {
  console.log("Mock habit plan for:", habitDescription);
  
  return `# Habit Building Plan: ${habitDescription}

## 1. Habit Clarity
**Your habit**: ${habitDescription}

This habit will help you make consistent progress toward your goals, improve your wellbeing, and develop positive routines that support your long-term success.

## 2. Implementation Intention
* **When**: Choose a specific time of day that works best for this habit
* **Where**: Select a consistent location
* **Trigger**: Link this habit to an existing routine or cue
* **Specific plan**: Create an "After I [existing habit], I will [new habit]" statement

## 3. Starting Small
* Begin with a version of the habit so small it seems almost too easy
* Focus on consistency rather than perfection
* Aim for just 2 minutes of the activity to establish the habit loop
* Gradually increase duration or difficulty as the habit becomes established

## 4. Environment Design
* Remove obstacles that might prevent you from doing the habit
* Make the habit obvious and easy to start
* Prepare your environment in advance
* Create visual reminders or cues
* Reduce friction between you and the habit

## 5. Accountability System
* Share your commitment with a friend or family member
* Use a habit tracking app to monitor your progress
* Consider finding an accountability partner
* Schedule regular reviews of your habit progress
* Make your commitment public if appropriate

## 6. Tracking Method
* Mark each successful day on a calendar or habit tracker
* Track your streak to build momentum
* Note how you feel after completing the habit
* Record any obstacles or challenges you encounter
* Measure progress toward your larger goal

## 7. Reward System
* Celebrate small wins along the way
* Create immediate rewards for completing your habit
* Link the habit to something you enjoy
* Set milestone rewards for longer streaks
* Notice and appreciate the positive changes resulting from your habit

## Common Obstacles and Solutions
* **Obstacle**: "I forget to do it"
  * **Solution**: Create obvious visual reminders; link to an existing habit
* **Obstacle**: "I don't feel motivated"
  * **Solution**: Make it smaller; focus on the 2-minute starting ritual
* **Obstacle**: "My routine gets disrupted"
  * **Solution**: Create a backup plan for unusual days; focus on getting back on track
* **Obstacle**: "It feels like a chore"
  * **Solution**: Find ways to make it more enjoyable; focus on the positive feelings afterward

Remember, consistency is more important than perfection. Start small and build gradually!`;
}