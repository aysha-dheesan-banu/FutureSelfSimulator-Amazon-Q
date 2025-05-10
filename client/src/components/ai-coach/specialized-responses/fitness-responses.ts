/**
 * Specialized responses for fitness-related questions
 */

interface FitnessResponse {
  keywords: string[];
  response: string;
}

export const fitnessResponses: FitnessResponse[] = [
  {
    keywords: ['beginner', 'start', 'new to fitness', 'getting started'],
    response: `Starting a fitness journey is an excellent decision! Here's how to begin:

1. **Start small**: 10-15 minutes of activity daily is better than an hour once a week
2. **Choose enjoyable activities**: You'll stick with exercise you actually like
3. **Set specific goals**: "Walk 20 minutes 3x weekly" is better than "get fit"
4. **Track progress**: Use a simple journal or app to record workouts
5. **Focus on consistency**: Showing up regularly matters more than intensity at first

Would you like me to suggest some specific beginner-friendly exercises to try?`
  },
  {
    keywords: ['lose weight', 'weight loss', 'burn fat', 'calorie'],
    response: `For effective and sustainable weight loss, you need a combined approach:

1. **Calorie awareness**: Create a moderate deficit (300-500 calories/day) through diet
2. **Protein focus**: Eat 0.7-1g protein per pound of body weight daily to preserve muscle
3. **Strength training**: 2-3 sessions weekly to maintain muscle mass
4. **Cardio mix**: 2-3 sessions combining HIIT and steady-state cardio
5. **Daily movement**: Increase NEAT (Non-Exercise Activity Thermogenesis) through walking, taking stairs, etc.
6. **Sleep quality**: Aim for 7-9 hours of quality sleep to regulate hunger hormones

Would you like me to help you create a specific plan for one of these areas?`
  },
  {
    keywords: ['build muscle', 'gain muscle', 'hypertrophy', 'stronger'],
    response: `To effectively build muscle, focus on these key principles:

1. **Progressive overload**: Gradually increase weight, reps, or sets over time
2. **Protein intake**: Consume 1.6-2.2g per kg of bodyweight daily
3. **Caloric surplus**: Eat 300-500 calories above maintenance for lean gains
4. **Compound movements**: Prioritize squats, deadlifts, bench press, rows, and overhead press
5. **Training frequency**: Train each muscle group 2-3x per week
6. **Recovery**: Ensure 48+ hours between training the same muscle group
7. **Sleep quality**: Aim for 7-9 hours as muscle growth occurs during sleep

Would you like a specific muscle-building workout plan or nutrition guidance?`
  },
  {
    keywords: ['cardio', 'endurance', 'stamina', 'heart rate'],
    response: `Improving cardiovascular fitness requires a strategic approach:

1. **Frequency**: 3-5 cardio sessions per week is ideal
2. **Variety**: Mix high-intensity (HIIT) and steady-state cardio
3. **Heart rate zones**: 
   - Zone 2 (60-70% max HR): Build aerobic base, improve fat utilization
   - Zone 3-4 (70-90% max HR): Improve lactate threshold and VO2 max
4. **Progression**: Increase duration by 10% weekly for steady-state
5. **Recovery**: Allow 24-48 hours between high-intensity sessions
6. **Cross-training**: Vary activities (running, cycling, swimming) to prevent overuse injuries

What specific type of cardio are you most interested in improving?`
  },
  {
    keywords: ['injury', 'pain', 'recover', 'rehabilitation'],
    response: `When dealing with fitness-related injuries, follow these guidelines:

1. **RICE protocol**: Rest, Ice, Compression, Elevation for acute injuries
2. **Professional assessment**: Consult a physical therapist or sports medicine doctor
3. **Gradual return**: Follow a progressive plan back to full activity
4. **Address root causes**: Work on mobility, stability, or technique issues
5. **Modify, don't eliminate**: Find alternative exercises that don't aggravate the injury
6. **Patience**: Rushing recovery often leads to re-injury and longer setbacks

Note: I recommend consulting a healthcare professional for specific injury advice. Would you like general rehabilitation principles for a specific body part?`
  },
  {
    keywords: ['nutrition', 'diet', 'eat', 'food', 'meal'],
    response: `Fitness nutrition fundamentals to support your goals:

1. **Protein**: 1.6-2.2g per kg bodyweight daily (higher end for muscle building)
2. **Carbohydrates**: Prioritize around workouts; adjust total based on activity level
3. **Healthy fats**: Include sources like olive oil, avocados, nuts for hormonal health
4. **Meal timing**: Eat protein-rich meals every 3-5 hours for optimal muscle protein synthesis
5. **Hydration**: Consume 30-40ml water per kg bodyweight daily
6. **Whole foods**: Aim for 80-90% of calories from minimally processed foods
7. **Micronutrients**: Eat a variety of colorful fruits and vegetables daily

Would you like specific nutrition recommendations for your particular fitness goal?`
  }
];

/**
 * Get a specialized fitness response based on the user's question
 * @param question - The user's fitness-related question
 * @returns A specialized response or null if no matching response is found
 */
export function getFitnessResponse(question: string): string | null {
  const lowerQuestion = question.toLowerCase();
  
  // Find the first matching response based on keywords
  const matchedResponse = fitnessResponses.find(response => 
    response.keywords.some(keyword => lowerQuestion.includes(keyword))
  );
  
  return matchedResponse ? matchedResponse.response : null;
}