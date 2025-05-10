/**
 * Specialized yoga plan with day-by-day guidance
 */

export const yogaPlan = `# 7-Day Yoga Plan

## Day 1: Foundation & Breathing
**Duration**: 15-20 minutes
**Focus**: Basic poses and breath awareness
* 5 min: Seated breathing practice (pranayama)
* 5 min: Cat-cow stretches and gentle spinal movements
* 5 min: Mountain pose, standing forward fold
* 5 min: Easy seated pose and final relaxation

## Day 2: Sun Salutations
**Duration**: 20-25 minutes
**Focus**: Building warmth and flow
* 5 min: Seated centering and breath awareness
* 10 min: 3-5 rounds of modified sun salutations
* 5 min: Standing poses (warrior I, triangle)
* 5 min: Seated forward fold and relaxation

## Day 3: Gentle Recovery
**Duration**: 15 minutes
**Focus**: Relaxation and gentle stretching
* 5 min: Reclined stretching
* 5 min: Gentle twists and hip openers
* 5 min: Legs up the wall pose and relaxation

## Day 4: Balance & Core
**Duration**: 25-30 minutes
**Focus**: Building stability and core strength
* 5 min: Standing centering and breath work
* 10 min: Standing balance poses (tree, eagle)
* 10 min: Core strengthening (boat pose, plank variations)
* 5 min: Relaxation

## Day 5: Flexibility Focus
**Duration**: 20-25 minutes
**Focus**: Deepening flexibility
* 5 min: Gentle warm-up movements
* 10 min: Seated poses (forward folds, butterfly)
* 5 min: Reclined stretches
* 5 min: Final relaxation

## Day 6: Flow Sequence
**Duration**: 30 minutes
**Focus**: Combining learned poses into a flow
* 5 min: Centering and intention setting
* 20 min: Flow sequence combining sun salutations and standing poses
* 5 min: Cool down and relaxation

## Day 7: Mindfulness & Meditation
**Duration**: 20 minutes
**Focus**: Mental clarity and relaxation
* 5 min: Gentle movement to prepare the body
* 5 min: Seated comfortable pose
* 10 min: Guided meditation and breath awareness

## Tips for Success
* Practice at the same time each day to build consistency
* Use a non-slip yoga mat and wear comfortable clothing
* Move slowly and mindfully, never forcing into pain
* Focus on your breath throughout each practice
* Modify poses as needed for your body

## Next Steps
After completing this 7-day plan, you can:
1. Repeat the cycle with increased duration
2. Add more challenging variations to familiar poses
3. Explore specific styles like Hatha, Vinyasa, or Yin yoga
4. Consider joining a class or finding online tutorials for continued guidance`;

export function getYogaPlan(level: string = "beginner"): string {
  // In the future, we could have different plans based on level
  return yogaPlan;
}