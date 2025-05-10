/**
 * Specialized running plan with day-by-day guidance
 */

export const runningPlan = `# 7-Day Running Plan for Beginners

## Day 1: Getting Started
**Duration**: 20 minutes
**Focus**: Building baseline and proper form
* 5 min: Brisk walking warm-up
* 10 min: Alternating 1 minute jogging, 1 minute walking
* 5 min: Cool down walk and light stretching
* **Form tip**: Keep shoulders relaxed, slight forward lean from ankles

## Day 2: Building Endurance
**Duration**: 25 minutes
**Focus**: Extending running intervals
* 5 min: Dynamic warm-up (leg swings, high knees, butt kicks)
* 15 min: Alternating 2 minutes jogging, 1 minute walking
* 5 min: Cool down and stretching focus on calves and hamstrings
* **Breathing tip**: Breathe through both nose and mouth, find comfortable rhythm

## Day 3: Active Recovery
**Duration**: 20 minutes
**Focus**: Light activity and recovery
* 20 min: Brisk walking or light cross-training (swimming, cycling)
* Focus on hydration and proper nutrition
* Gentle stretching throughout the day

## Day 4: Interval Training
**Duration**: 25 minutes
**Focus**: Building speed and cardiovascular fitness
* 5 min: Warm-up walk
* 15 min: 30 seconds faster pace, 90 seconds recovery jog/walk
* 5 min: Cool down and stretching
* **Mental tip**: Focus on completing each interval one at a time

## Day 5: Technique Focus
**Duration**: 25 minutes
**Focus**: Improving running efficiency
* 5 min: Warm-up
* 15 min: Steady, comfortable pace with focus on form
* 5 min: Cool down and stretching
* **Form focus**: Mid-foot strike, 180 steps per minute cadence

## Day 6: Distance Challenge
**Duration**: 30 minutes
**Focus**: Building endurance
* 5 min: Warm-up
* 20 min: Longest continuous run of the week (walk when needed)
* 5 min: Cool down and thorough stretching
* **Recovery tip**: Proper refueling within 30 minutes after run

## Day 7: Rest and Reflect
**Duration**: 0-15 minutes
**Focus**: Complete rest or very light activity
* Full rest day or gentle walking/stretching only
* Reflect on week's progress
* Plan adjustments for next week
* Focus on proper hydration and nutrition

## Tips for Success
* Invest in proper running shoes fitted for your gait
* Run on softer surfaces when possible (trails, grass)
* Stay hydrated before, during, and after runs
* Listen to your body - pain is different from discomfort
* Track your progress in a journal or app

## Next Steps
After completing this 7-day plan, you can:
1. Repeat the week with longer running intervals
2. Gradually increase your longest run by 5-10% each week
3. Add a fourth running day when comfortable
4. Set a goal like completing a 5K race`;

export function getRunningPlan(level: string = "beginner"): string {
  // In the future, we could have different plans based on level
  return runningPlan;
}