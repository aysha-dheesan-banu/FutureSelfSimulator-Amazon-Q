/**
 * Generate personalized goal plans based on user input
 */

/**
 * Creates a personalized goal plan based on the user's specific goal
 * @param goalDescription The user's goal description
 * @returns A personalized goal plan
 */
export function generateGoalPlan(goalDescription: string): string {
  // Extract key terms from the goal description
  const cleanGoal = goalDescription.toLowerCase().trim();
  
  // Check for specific goal types
  if (cleanGoal.includes("yoga")) {
    return generateYogaGoalPlan(goalDescription);
  } else if (cleanGoal.includes("run") || cleanGoal.includes("running")) {
    return generateRunningGoalPlan(goalDescription);
  } else if (cleanGoal.includes("weight") || cleanGoal.includes("strength") || cleanGoal.includes("muscle")) {
    return generateStrengthGoalPlan(goalDescription);
  } else if (cleanGoal.includes("meditat") || cleanGoal.includes("mindful")) {
    return generateMeditationGoalPlan(goalDescription);
  } else if (cleanGoal.includes("diet") || cleanGoal.includes("nutrition") || cleanGoal.includes("eat")) {
    return generateNutritionGoalPlan(goalDescription);
  } else {
    // Generic goal plan with the goal description incorporated
    return generateGenericGoalPlan(goalDescription);
  }
}

/**
 * Generate a yoga-specific goal plan
 */
function generateYogaGoalPlan(goalDescription: string): string {
  return `# Personalized Yoga Plan: ${goalDescription}

## Goal Clarity
Your goal is to develop a yoga practice. This plan will help you build consistency, improve flexibility, and gain the mental benefits of regular yoga practice.

## 7-Day Plan

### Day 1: Foundation & Breathing
**Duration**: 15-20 minutes
**Focus**: Basic poses and breath awareness
* 5 min: Seated breathing practice (pranayama)
* 5 min: Cat-cow stretches and gentle spinal movements
* 5 min: Mountain pose, standing forward fold
* 5 min: Easy seated pose and final relaxation

### Day 2: Sun Salutations
**Duration**: 20-25 minutes
**Focus**: Building warmth and flow
* 5 min: Seated centering and breath awareness
* 10 min: 3-5 rounds of modified sun salutations
* 5 min: Standing poses (warrior I, triangle)
* 5 min: Seated forward fold and relaxation

### Day 3: Gentle Recovery
**Duration**: 15 minutes
**Focus**: Relaxation and gentle stretching
* 5 min: Reclined stretching
* 5 min: Gentle twists and hip openers
* 5 min: Legs up the wall pose and relaxation

### Day 4: Balance & Core
**Duration**: 25-30 minutes
**Focus**: Building stability and core strength
* 5 min: Standing centering and breath work
* 10 min: Standing balance poses (tree, eagle)
* 10 min: Core strengthening (boat pose, plank variations)
* 5 min: Relaxation

### Day 5: Flexibility Focus
**Duration**: 20-25 minutes
**Focus**: Deepening flexibility
* 5 min: Gentle warm-up movements
* 10 min: Seated poses (forward folds, butterfly)
* 5 min: Reclined stretches
* 5 min: Final relaxation

### Day 6: Flow Sequence
**Duration**: 30 minutes
**Focus**: Combining learned poses into a flow
* 5 min: Centering and intention setting
* 20 min: Flow sequence combining sun salutations and standing poses
* 5 min: Cool down and relaxation

### Day 7: Mindfulness & Meditation
**Duration**: 20 minutes
**Focus**: Mental clarity and relaxation
* 5 min: Gentle movement to prepare the body
* 5 min: Seated comfortable pose
* 10 min: Guided meditation and breath awareness

## Resources Needed
* Yoga mat
* Comfortable clothing
* Optional: yoga blocks, strap, bolster
* Quiet space where you won't be disturbed

## Success Metrics
* Completion of daily practices
* Improved flexibility and balance
* Reduced stress levels
* Better sleep quality
* Increased mind-body awareness

## Next Steps
After completing this 7-day plan, you can:
1. Repeat the cycle with increased duration
2. Add more challenging variations to familiar poses
3. Explore specific styles like Hatha, Vinyasa, or Yin yoga
4. Consider joining a class or finding online tutorials for continued guidance`;
}

/**
 * Generate a running-specific goal plan
 */
function generateRunningGoalPlan(goalDescription: string): string {
  return `# Personalized Running Plan: ${goalDescription}

## Goal Clarity
Your goal is to develop a running practice. This plan will help you build endurance, improve cardiovascular fitness, and establish a consistent running routine.

## 7-Day Plan

### Day 1: Getting Started
**Duration**: 20 minutes
**Focus**: Building baseline and proper form
* 5 min: Brisk walking warm-up
* 10 min: Alternating 1 minute jogging, 1 minute walking
* 5 min: Cool down walk and light stretching
* **Form tip**: Keep shoulders relaxed, slight forward lean from ankles

### Day 2: Building Endurance
**Duration**: 25 minutes
**Focus**: Extending running intervals
* 5 min: Dynamic warm-up (leg swings, high knees, butt kicks)
* 15 min: Alternating 2 minutes jogging, 1 minute walking
* 5 min: Cool down and stretching focus on calves and hamstrings
* **Breathing tip**: Breathe through both nose and mouth, find comfortable rhythm

### Day 3: Active Recovery
**Duration**: 20 minutes
**Focus**: Light activity and recovery
* 20 min: Brisk walking or light cross-training (swimming, cycling)
* Focus on hydration and proper nutrition
* Gentle stretching throughout the day

### Day 4: Interval Training
**Duration**: 25 minutes
**Focus**: Building speed and cardiovascular fitness
* 5 min: Warm-up walk
* 15 min: 30 seconds faster pace, 90 seconds recovery jog/walk
* 5 min: Cool down and stretching
* **Mental tip**: Focus on completing each interval one at a time

### Day 5: Technique Focus
**Duration**: 25 minutes
**Focus**: Improving running efficiency
* 5 min: Warm-up
* 15 min: Steady, comfortable pace with focus on form
* 5 min: Cool down and stretching
* **Form focus**: Mid-foot strike, 180 steps per minute cadence

### Day 6: Distance Challenge
**Duration**: 30 minutes
**Focus**: Building endurance
* 5 min: Warm-up
* 20 min: Longest continuous run of the week (walk when needed)
* 5 min: Cool down and thorough stretching
* **Recovery tip**: Proper refueling within 30 minutes after run

### Day 7: Rest and Reflect
**Duration**: 0-15 minutes
**Focus**: Complete rest or very light activity
* Full rest day or gentle walking/stretching only
* Reflect on week's progress
* Plan adjustments for next week
* Focus on proper hydration and nutrition

## Resources Needed
* Proper running shoes fitted for your gait
* Comfortable clothing appropriate for weather
* Water bottle
* Optional: fitness tracker or running app

## Success Metrics
* Completion of scheduled runs
* Increased duration of continuous running
* Improved recovery time
* Reduced perceived exertion
* Enjoyment of the activity

## Next Steps
After completing this 7-day plan, you can:
1. Repeat the week with longer running intervals
2. Gradually increase your longest run by 5-10% each week
3. Add a fourth running day when comfortable
4. Set a goal like completing a 5K race`;
}

/**
 * Generate a strength training-specific goal plan
 */
function generateStrengthGoalPlan(goalDescription: string): string {
  return `# Personalized Strength Training Plan: ${goalDescription}

## Goal Clarity
Your goal is to build strength and muscle. This plan will help you develop functional strength, improve muscle tone, and establish proper lifting technique.

## 7-Day Plan

### Day 1: Full Body Basics
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

### Day 2: Upper Body Focus
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

### Day 3: Active Recovery
**Duration**: 20-25 minutes
**Focus**: Light movement and mobility
* 10 min: Light cardio (walking, cycling)
* 10 min: Mobility work (arm circles, hip rotations, ankle circles)
* 5 min: Foam rolling or gentle stretching
* **Recovery tip**: Focus on quality sleep tonight

### Day 4: Lower Body Strength
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

### Day 5: Core and Stability
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

### Day 6: Full Body Integration
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

### Day 7: Rest and Recovery
**Duration**: 15-20 minutes (optional)
**Focus**: Complete rest or gentle mobility
* Full rest day or gentle yoga/stretching
* Reflect on the week's progress
* Plan adjustments for next week
* Focus on proper nutrition and hydration

## Resources Needed
* Dumbbells or resistance bands
* Exercise mat
* Comfortable clothing
* Water bottle
* Optional: fitness tracker or workout app

## Success Metrics
* Completion of scheduled workouts
* Improved form and technique
* Increased strength (weight or reps)
* Reduced post-workout soreness over time
* Visible muscle definition (longer term)

## Next Steps
After completing this 7-day plan, you can:
1. Increase weights by 5-10% where appropriate
2. Add an additional set to each exercise
3. Explore more advanced variations of these exercises
4. Consider a split routine (upper/lower or push/pull/legs)`;
}

/**
 * Generate a meditation-specific goal plan
 */
function generateMeditationGoalPlan(goalDescription: string): string {
  return `# Personalized Meditation Plan: ${goalDescription}

## Goal Clarity
Your goal is to develop a meditation practice. This plan will help you build mindfulness, reduce stress, and improve mental clarity through consistent meditation.

## 7-Day Plan

### Day 1: Breath Awareness
**Duration**: 5 minutes
**Focus**: Simply noticing your breath
* Find a comfortable seated position
* Close your eyes or maintain a soft gaze
* Notice your natural breathing pattern without changing it
* When mind wanders, gently return focus to the breath
* **Beginner tip**: Count breaths from 1-10, then restart

### Day 2: Body Scan
**Duration**: 7 minutes
**Focus**: Building body awareness
* Sit or lie down comfortably
* Bring attention to different parts of your body
* Start at your toes and work up to the top of your head
* Notice sensations without judgment
* **Relaxation tip**: Consciously release tension in each area

### Day 3: Mindful Breathing
**Duration**: 8 minutes
**Focus**: Deepening breath awareness
* Focus on the sensation of breathing
* Notice the rise and fall of your chest and abdomen
* Feel the air entering and exiting your nostrils
* **Technique tip**: Try 4-count inhale, 4-count exhale

### Day 4: Loving-Kindness
**Duration**: 10 minutes
**Focus**: Cultivating positive emotions
* Begin with self-directed well-wishes
* Extend to loved ones, neutral people, difficult people
* Use phrases like "May I/you be happy, healthy, safe, at ease"
* **Connection tip**: Visualize the person as you direct wishes to them

### Day 5: Thought Observation
**Duration**: 10 minutes
**Focus**: Noticing thoughts without attachment
* Observe thoughts as they arise
* Imagine them as clouds passing in the sky
* Don't judge or follow the thoughts
* **Mindfulness tip**: Label thoughts as "thinking" and return to breath

### Day 6: Open Awareness
**Duration**: 12 minutes
**Focus**: Expanding awareness
* Begin with breath focus
* Gradually expand awareness to sounds, sensations, thoughts
* Maintain an open, receptive attitude
* **Awareness tip**: Notice where attention naturally goes

### Day 7: Gratitude Meditation
**Duration**: 15 minutes
**Focus**: Cultivating appreciation
* Begin with breath awareness
* Reflect on things you're grateful for
* Notice how gratitude feels in your body
* **Integration tip**: Journal briefly after this session

## Resources Needed
* Quiet space
* Comfortable cushion or chair
* Optional: meditation app or timer
* Optional: meditation cushion or bench

## Success Metrics
* Completion of daily practice
* Increased periods of focus
* Reduced stress response
* Improved emotional regulation
* Greater self-awareness

## Next Steps
After completing this 7-day plan, you can:
1. Gradually increase session length (add 2-5 minutes per week)
2. Explore different meditation styles (Vipassana, Zen, etc.)
3. Join a meditation group for community support
4. Integrate mini-meditations throughout your day`;
}

/**
 * Generate a nutrition-specific goal plan
 */
function generateNutritionGoalPlan(goalDescription: string): string {
  return `# Personalized Nutrition Plan: ${goalDescription}

## Goal Clarity
Your goal is to improve your nutrition. This plan will help you develop healthier eating habits, make better food choices, and establish a sustainable approach to nutrition.

## 7-Day Plan

### Day 1: Awareness & Assessment
**Focus**: Understanding your current habits
* Track everything you eat and drink today
* Note hunger levels before and after meals
* Identify 3 positive aspects of your current diet
* Identify 3 areas for improvement
* **Awareness tip**: Don't judge your choices, just observe

### Day 2: Hydration Focus
**Focus**: Optimizing water intake
* Start day with 16oz water upon waking
* Aim for 8-10 cups total water intake
* Replace one sugar-sweetened beverage with water
* Notice how hydration affects energy and hunger
* **Hydration tip**: Keep a water bottle visible at all times

### Day 3: Protein Optimization
**Focus**: Balancing protein intake
* Include protein with each meal and snack
* Aim for palm-sized portion at main meals
* Experiment with different protein sources
* Notice how protein affects fullness
* **Protein tip**: Prepare easy protein options for busy days

### Day 4: Vegetable Expansion
**Focus**: Increasing vegetable variety
* Add vegetables to at least 2 meals
* Try a new vegetable or preparation method
* Aim for 3+ different colored vegetables
* **Veggie tip**: Prep cut vegetables for easy snacking

### Day 5: Mindful Eating
**Focus**: Improving eating awareness
* Eat without screens for at least 2 meals
* Chew thoroughly and put fork down between bites
* Notice flavors, textures, and satisfaction levels
* **Mindfulness tip**: Take 3 deep breaths before eating

### Day 6: Meal Planning & Prep
**Focus**: Setting yourself up for success
* Plan 3 balanced meals for the coming days
* Grocery shop with a specific list
* Prep at least one component in advance
* **Planning tip**: Start with just planning dinners if overwhelmed

### Day 7: Review & Adjust
**Focus**: Learning and iterating
* Review your week's observations
* Identify what worked well
* Note challenges and brainstorm solutions
* Set specific intentions for next week
* **Sustainability tip**: Focus on progress, not perfection

## Resources Needed
* Food journal or tracking app
* Water bottle
* Basic cooking equipment
* Storage containers for meal prep
* Grocery shopping list

## Success Metrics
* Consistent tracking and awareness
* Increased water intake
* More balanced meals
* Greater variety of vegetables
* Improved energy levels
* Better relationship with food

## Next Steps
After completing this 7-day plan, you can:
1. Focus on one specific nutrition habit for 2-3 weeks
2. Expand your cooking skills with new recipes
3. Learn more about nutrient timing around workouts
4. Consider consulting with a registered dietitian for personalized guidance`;
}

/**
 * Generate a generic goal plan
 */
function generateGenericGoalPlan(goalDescription: string): string {
  return `# Personalized Plan: ${goalDescription}

## Goal Clarity
Your goal is to ${goalDescription}. This plan will help you make consistent progress, develop necessary skills, and achieve measurable results.

## 7-Day Action Plan

### Day 1: Assessment & Planning
**Focus**: Understanding your starting point
* Assess your current skills/knowledge related to this goal
* Research best practices and success stories
* Set 3 specific, measurable sub-goals
* Identify potential obstacles and solutions
* **Planning tip**: Break your goal into weekly milestones

### Day 2: Skill Building - Fundamentals
**Focus**: Learning essential skills
* Identify 3 core skills needed for your goal
* Spend 30-60 minutes practicing the most important skill
* Find learning resources (videos, articles, courses)
* **Learning tip**: Focus on understanding principles, not just techniques

### Day 3: Environment Setup
**Focus**: Creating supportive conditions
* Organize your physical space to support your goal
* Gather necessary tools and resources
* Remove or minimize potential distractions
* Tell a supportive friend about your goal
* **Environment tip**: Make the desired action obvious and easy

### Day 4: Implementation - First Steps
**Focus**: Taking concrete action
* Complete one significant task toward your goal
* Apply what you learned on Day 2
* Document your process and results
* **Action tip**: Start with the smallest possible step if feeling resistance

### Day 5: Review & Adjust
**Focus**: Learning from early experience
* Review your progress so far
* Identify what's working well
* Note challenges and brainstorm solutions
* Adjust your approach based on learnings
* **Reflection tip**: Ask "What made this easy or difficult?"

### Day 6: Skill Building - Advanced
**Focus**: Deepening your capabilities
* Learn one more advanced technique
* Practice combining skills you've developed
* Connect with others pursuing similar goals
* **Progress tip**: Compare to your starting point, not ideal end state

### Day 7: Habit Integration & Planning
**Focus**: Ensuring long-term success
* Create a specific plan for week 2
* Identify a trigger for your new habit
* Set up accountability system
* Schedule specific times for practice
* **Consistency tip**: Link your new habit to an existing daily routine

## Resources Needed
* Tools specific to your goal
* Learning materials (books, courses, videos)
* Tracking system (journal, app, spreadsheet)
* Accountability partner or community

## Success Metrics
* Completion of daily actions
* Skill improvement
* Increased confidence
* Measurable progress toward goal
* Habit formation

## Next Steps
After completing this 7-day plan, you can:
1. Continue with more advanced skills
2. Increase duration or intensity
3. Set more challenging sub-goals
4. Find a mentor or community for support`;
}