/**
 * Specialized responses for productivity-related questions
 */

interface ProductivityResponse {
  keywords: string[];
  response: string;
}

export const productivityResponses: ProductivityResponse[] = [
  {
    keywords: ['procrastination', 'putting off', 'avoid', 'delay'],
    response: `To overcome procrastination, try these evidence-based strategies:

1. **Break tasks down**: Divide large tasks into smaller, more manageable steps
2. **Two-minute rule**: If something takes less than two minutes, do it immediately
3. **Pomodoro technique**: Work for 25 minutes, then take a 5-minute break
4. **Implementation intentions**: Create specific "if-then" plans (e.g., "If it's 9am, I'll work on my report")
5. **Remove friction**: Set up your environment to make starting easier
6. **Address root causes**: Identify if you're procrastinating due to fear, perfectionism, or task aversion

Which of these techniques would you like to try first? I can provide more specific guidance on implementing it.`
  },
  {
    keywords: ['focus', 'concentration', 'distraction', 'attention'],
    response: `To improve focus and reduce distractions, implement these strategies:

1. **Environment design**: Create a dedicated workspace free from distractions
2. **Digital minimalism**: Use website blockers, turn off notifications, and set app time limits
3. **Time blocking**: Schedule specific focus periods in your calendar
4. **Single-tasking**: Work on one task at a time; multitasking reduces efficiency by 40%
5. **Brain dumps**: Write down intrusive thoughts to clear your mind
6. **Focus training**: Practice meditation or focused attention exercises daily
7. **Energy management**: Schedule deep work during your peak energy hours

Would you like specific techniques for dealing with a particular type of distraction?`
  },
  {
    keywords: ['time management', 'schedule', 'planning', 'prioritize'],
    response: `Effective time management comes down to these key principles:

1. **Time audit**: Track how you actually spend time before making changes
2. **Eisenhower matrix**: Categorize tasks as:
   - Important & Urgent: Do immediately
   - Important & Not Urgent: Schedule time for
   - Not Important & Urgent: Delegate if possible
   - Not Important & Not Urgent: Eliminate
3. **Time blocking**: Assign specific time blocks for different types of work
4. **Task batching**: Group similar tasks together to reduce context switching
5. **Buffer time**: Schedule 15-30 minutes between meetings/tasks for transitions
6. **Weekly planning**: Spend 30 minutes each Sunday planning your week

Would you like help implementing one of these strategies for your specific situation?`
  },
  {
    keywords: ['motivation', 'discipline', 'habit', 'routine'],
    response: `Building motivation and discipline requires understanding how habits work:

1. **Habit loop**: Identify the cue, routine, and reward for behaviors you want to change
2. **Habit stacking**: Link new habits to existing ones (e.g., "After I brush my teeth, I will meditate for 2 minutes")
3. **Environment design**: Make good habits obvious and easy; make bad habits invisible and difficult
4. **Implementation intentions**: Create specific plans for when and where you'll perform habits
5. **Don't rely on motivation**: Build systems that work even when motivation is low
6. **Identity-based habits**: Focus on becoming the type of person who does the behavior

Would you like help designing a specific habit implementation strategy?`
  },
  {
    keywords: ['overwhelm', 'stress', 'burnout', 'too much'],
    response: `When feeling overwhelmed, these strategies can help you regain control:

1. **Brain dump**: Write down everything on your mind without organizing yet
2. **MoSCoW method**: Categorize tasks as Must do, Should do, Could do, Won't do
3. **Delegate and delete**: Identify tasks you can eliminate or assign to others
4. **Boundaries**: Practice saying no to new commitments
5. **Single focus**: Identify your "one thing" that would make everything else easier
6. **Scheduled breaks**: Build in recovery time between intense work periods
7. **Stress reduction**: Incorporate daily stress management practices (meditation, exercise, etc.)

Which area would you like more specific guidance on?`
  },
  {
    keywords: ['morning routine', 'start day', 'productive morning'],
    response: `A powerful morning routine sets the tone for a productive day:

1. **Consistent wake time**: Get up at the same time daily, even weekends
2. **Hydration first**: Drink 16-20oz water upon waking
3. **No screens**: Avoid phones/email for the first 30-60 minutes
4. **Movement**: Include 5-10 minutes of physical activity
5. **Mindfulness**: Practice 5-10 minutes of meditation or journaling
6. **MIT focus**: Identify 1-3 Most Important Tasks for the day
7. **Eat the frog**: Start with your most challenging important task

Would you like help designing a morning routine that fits your specific schedule and goals?`
  }
];

/**
 * Get a specialized productivity response based on the user's question
 * @param question - The user's productivity-related question
 * @returns A specialized response or null if no matching response is found
 */
export function getProductivityResponse(question: string): string | null {
  const lowerQuestion = question.toLowerCase();
  
  // Find the first matching response based on keywords
  const matchedResponse = productivityResponses.find(response => 
    response.keywords.some(keyword => lowerQuestion.includes(keyword))
  );
  
  return matchedResponse ? matchedResponse.response : null;
}