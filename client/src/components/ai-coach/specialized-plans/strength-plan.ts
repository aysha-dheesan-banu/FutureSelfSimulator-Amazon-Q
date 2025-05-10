/**
 * Specialized strength training plan with day-by-day guidance
 */

export const strengthPlan = `# 7-Day Strength Training Plan

## Day 1: Full Body Basics
**Duration**: 30-40 minutes
**Focus**: Learning proper form for fundamental movements
* 5 min: Dynamic warm-up (arm circles, bodyweight squats, etc.)
* 25 min: Circuit (2-3 rounds):
  * Bodyweight squats: 10-12 reps
  * Modified push-ups: 5-10 reps
  * Glute bridges: 12-15 reps
  * Standing dumbbell rows: 10-12 reps per side
  * Wall sits: 20-30 seconds
* 5 min: Cool down stretching
* **Form tip**: Focus on quality over quantity

## Day 2: Upper Body Focus
**Duration**: 30-35 minutes
**Focus**: Chest, back, shoulders, and arms
* 5 min: Warm-up
* 25 min: Circuit (2-3 rounds):
  * Push-ups or chest press: 8-12 reps
  * Dumbbell rows: 10-12 reps per side
  * Overhead press: 8-10 reps
  * Bicep curls: 10-12 reps
  * Tricep dips: 8-12 reps
* 5 min: Upper body stretching
* **Breathing tip**: Exhale during exertion, inhale during return

## Day 3: Active Recovery
**Duration**: 20-25 minutes
**Focus**: Light movement and mobility
* 10 min: Light cardio (walking, cycling)
* 10 min: Mobility work (arm circles, hip rotations, ankle circles)
* 5 min: Foam rolling or gentle stretching
* **Recovery tip**: Focus on quality sleep tonight

## Day 4: Lower Body Strength
**Duration**: 30-40 minutes
**Focus**: Legs and core
* 5 min: Dynamic warm-up
* 25 min: Circuit (2-3 rounds):
  * Goblet squats: 10-12 reps
  * Lunges: 8-10 reps per leg
  * Romanian deadlifts: 10-12 reps
  * Calf raises: 15-20 reps
  * Plank: 20-30 seconds
* 5 min: Lower body stretching
* **Form focus**: Keep core engaged throughout all exercises

## Day 5: Core and Stability
**Duration**: 25-30 minutes
**Focus**: Building core strength and balance
* 5 min: Warm-up
* 20 min: Circuit (2-3 rounds):
  * Plank: 30 seconds
  * Bird-dog: 8-10 reps per side
  * Glute bridges: 12-15 reps
  * Dead bugs: 8-10 reps per side
  * Superman: 10-12 reps
* 5 min: Core stretching
* **Stability tip**: Focus on controlled movement rather than speed

## Day 6: Full Body Integration
**Duration**: 35-45 minutes
**Focus**: Combining movements for functional strength
* 5 min: Dynamic warm-up
* 30 min: Circuit (2-3 rounds):
  * Squat to overhead press: 10-12 reps
  * Renegade rows: 8-10 reps per side
  * Reverse lunges with bicep curl: 8-10 reps per side
  * Plank with shoulder tap: 8-10 reps per side
  * Glute bridge with chest press: 10-12 reps
* 5 min: Full body stretching
* **Integration tip**: Focus on the connection between movements

## Day 7: Rest and Recovery
**Duration**: 15-20 minutes (optional)
**Focus**: Complete rest or gentle mobility
* Full rest day or gentle yoga/stretching
* Reflect on the week's progress
* Plan adjustments for next week
* Focus on proper nutrition and hydration

## Tips for Success
* Start with lighter weights to master form
* Increase weight gradually when exercises become too easy
* Stay hydrated during workouts
* Rest 30-60 seconds between sets
* Track your progress (weights, reps, how you feel)

## Next Steps
After completing this 7-day plan, you can:
1. Increase weights by 5-10% where appropriate
2. Add an additional set to each exercise
3. Explore more advanced variations of these exercises
4. Consider a split routine (upper/lower or push/pull/legs)`;

export function getStrengthPlan(level: string = "beginner"): string {
  // In the future, we could have different plans based on level
  return strengthPlan;
}