/**
 * Export all specialized responses and provide a function to get the appropriate response
 */

import { getFitnessResponse } from './fitness-responses';
import { getProductivityResponse } from './productivity-responses';

/**
 * Get a specialized response based on the user's question
 * @param question - The user's question
 * @returns A specialized response or null if no matching response is found
 */
export function getSpecializedResponse(question: string): string | null {
  const lowerQuestion = question.toLowerCase();
  
  // Check for fitness-related questions
  if (
    lowerQuestion.includes('fitness') || 
    lowerQuestion.includes('exercise') || 
    lowerQuestion.includes('workout') ||
    lowerQuestion.includes('gym') ||
    lowerQuestion.includes('weight') ||
    lowerQuestion.includes('muscle') ||
    lowerQuestion.includes('cardio') ||
    lowerQuestion.includes('run') ||
    lowerQuestion.includes('training')
  ) {
    return getFitnessResponse(question) || getGeneralResponse(question);
  }
  
  // Check for productivity-related questions
  if (
    lowerQuestion.includes('productive') || 
    lowerQuestion.includes('productivity') || 
    lowerQuestion.includes('focus') ||
    lowerQuestion.includes('distraction') ||
    lowerQuestion.includes('procrastination') ||
    lowerQuestion.includes('time management') ||
    lowerQuestion.includes('habit') ||
    lowerQuestion.includes('routine')
  ) {
    return getProductivityResponse(question) || getGeneralResponse(question);
  }
  
  // No specialized response found
  return getGeneralResponse(question);
}

/**
 * Get a general response when no specialized response is found
 * @param question - The user's question
 * @returns A general response
 */
function getGeneralResponse(question: string): string {
  // Extract the main topic from the question
  const words = question.toLowerCase().split(' ');
  const mainTopic = words.find(word => word.length > 4) || 'topic';
  
  return `I'd be happy to help you with ${mainTopic}. To give you the most helpful advice, could you share:

1. What specific aspect of ${mainTopic} are you most interested in improving?
2. What have you already tried in this area?
3. What are your main challenges or obstacles?

With this information, I can provide more personalized guidance for your situation.`;
}

export { getFitnessResponse, getProductivityResponse };