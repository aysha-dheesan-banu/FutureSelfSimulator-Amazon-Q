/**
 * Export all specialized plans and provide a function to get the appropriate plan
 */

import { getYogaPlan } from './yoga-plan';
import { getRunningPlan } from './running-plan';
import { getStrengthPlan } from './strength-plan';

/**
 * Get a specialized plan based on the goal description
 * @param goalDescription - The user's goal description
 * @returns A specialized plan or null if no matching plan is found
 */
export function getSpecializedPlan(goalDescription: string): string | null {
  const lowerGoal = goalDescription.toLowerCase();
  
  // Check for yoga-related goals
  if (
    lowerGoal.includes('yoga') || 
    lowerGoal.includes('flexibility') || 
    lowerGoal.includes('stretching')
  ) {
    return getYogaPlan();
  }
  
  // Check for running-related goals
  if (
    lowerGoal.includes('run') || 
    lowerGoal.includes('running') || 
    lowerGoal.includes('jog') || 
    lowerGoal.includes('cardio')
  ) {
    return getRunningPlan();
  }
  
  // Check for strength-related goals
  if (
    lowerGoal.includes('strength') || 
    lowerGoal.includes('muscle') || 
    lowerGoal.includes('weight lifting') || 
    lowerGoal.includes('toning') ||
    lowerGoal.includes('weights')
  ) {
    return getStrengthPlan();
  }
  
  // No specialized plan found
  return null;
}

export { getYogaPlan, getRunningPlan, getStrengthPlan };