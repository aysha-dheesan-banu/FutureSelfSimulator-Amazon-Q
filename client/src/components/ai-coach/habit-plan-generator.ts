/**
 * Generate personalized habit plans based on user input
 */

/**
 * Creates a personalized habit plan based on the user's specific habit
 * @param habitDescription The user's habit description
 * @returns A personalized habit plan
 */
export function generateHabitPlan(habitDescription: string): string {
  // Extract key terms from the habit description
  const cleanHabit = habitDescription.toLowerCase().trim();
  
  // Check for specific habit types
  if (cleanHabit.includes("meditat") || cleanHabit.includes("mindful")) {
    return generateMeditationHabitPlan(habitDescription);
  } else if (cleanHabit.includes("read") || cleanHabit.includes("book")) {
    return generateReadingHabitPlan(habitDescription);
  } else if (cleanHabit.includes("exercise") || cleanHabit.includes("workout") || cleanHabit.includes("gym")) {
    return generateExerciseHabitPlan(habitDescription);
  } else if (cleanHabit.includes("water") || cleanHabit.includes("hydrat")) {
    return generateHydrationHabitPlan(habitDescription);
  } else if (cleanHabit.includes("sleep") || cleanHabit.includes("bed") || cleanHabit.includes("rest")) {
    return generateSleepHabitPlan(habitDescription);
  } else {
    // Generic habit plan with the habit description incorporated
    return generateGenericHabitPlan(habitDescription);
  }
}

/**
 * Generate a meditation-specific habit plan
 */
function generateMeditationHabitPlan(habitDescription: string): string {
  return `# Meditation Habit Building Plan: ${habitDescription}

## 1. Habit Clarity
**Your habit**: Regular meditation practice

This habit will help reduce stress, improve focus, enhance mental clarity, and promote emotional regulation. Consistent meditation has been linked to reduced anxiety, better sleep, and improved overall wellbeing.

## 2. Implementation Intention
* **When**: First thing in the morning, right after waking up
* **Where**: A quiet corner in your bedroom or living room
* **Trigger**: After drinking a glass of water in the morning
* **Specific plan**: "After I drink my morning water, I will sit on my meditation cushion for at least 2 minutes"

## 3. Starting Small
* Begin with just 2 minutes of meditation daily
* Focus on simply sitting and breathing
* Use guided meditations if silent meditation is challenging
* Gradually increase by 1 minute each week until you reach your desired duration

## 4. Environment Design
* Create a dedicated meditation space with a cushion or chair
* Keep the area clean and free from distractions
* Consider using soft lighting or candles to create a calming atmosphere
* Have a timer or meditation app ready and set up
* Put a visual reminder (like your cushion) in a prominent place

## 5. Accountability System
* Use a meditation app that tracks your streak
* Join a meditation challenge or group
* Share your commitment with a friend who will check in on your progress
* Schedule a weekly review of your meditation practice
* Consider finding a meditation buddy

## 6. Tracking Method
* Mark each day you meditate on a calendar
* Record how you feel before and after each session
* Track your longest streak to build momentum
* Note any insights or experiences in a meditation journal
* Celebrate milestones (7 days, 30 days, etc.)

## 7. Reward System
* After each session, enjoy a favorite tea or coffee mindfully
* Celebrate milestones with meaningful rewards
* Notice and appreciate the mental clarity and calm that develops
* Share your progress with supportive friends
* Reflect on how meditation is improving your life weekly

## Common Obstacles and Solutions
* **Obstacle**: "I don't have time"
  * **Solution**: Start with just 2 minutes; meditate while waiting for coffee to brew
* **Obstacle**: "My mind is too busy"
  * **Solution**: That's normal! Use guided meditations or simply count breaths
* **Obstacle**: "I keep forgetting"
  * **Solution**: Link to an existing habit and use visual reminders
* **Obstacle**: "I fall asleep"
  * **Solution**: Try meditating sitting up rather than lying down; meditate earlier in the day

Remember, consistency is more important than perfection. If you miss a day, simply begin again the next day without judgment.`;
}

/**
 * Generate a reading-specific habit plan
 */
function generateReadingHabitPlan(habitDescription: string): string {
  return `# Reading Habit Building Plan: ${habitDescription}

## 1. Habit Clarity
**Your habit**: Reading books regularly

This habit will expand your knowledge, improve vocabulary, reduce stress, enhance creativity and empathy, and provide quality entertainment. Regular reading has been linked to cognitive benefits and may help prevent cognitive decline.

## 2. Implementation Intention
* **When**: Before bed each night for 20 minutes
* **Where**: In your bedroom or favorite reading spot
* **Trigger**: After brushing your teeth or completing your evening routine
* **Specific plan**: "After I brush my teeth, I will read at least one page of my book in bed"

## 3. Starting Small
* Begin with just 5 minutes of reading daily (or even just one page)
* Choose highly engaging books that you're excited to read
* Keep your expectations low at first - focus on consistency, not quantity
* Gradually increase to 10, 15, then 20+ minutes as the habit forms

## 4. Environment Design
* Keep your current book on your nightstand or visible in your reading area
* Remove digital distractions (phone, tablet) from your reading environment
* Ensure good lighting and a comfortable seating position
* Create a "reading trigger" like a special bookmark or reading light
* Have multiple books available to match different moods

## 5. Accountability System
* Join a book club or reading challenge
* Share what you're reading with friends or on social media
* Set a monthly reading goal and track your progress
* Use a reading app like Goodreads to log books and connect with others
* Schedule regular visits to the library or bookstore

## 6. Tracking Method
* Use a reading app or journal to record books and pages read
* Track minutes spent reading each day
* Note interesting ideas or quotes to increase engagement
* Keep a "books read" list to see your accomplishments
* Use a visual tracker like a reading thermometer for each book

## 7. Reward System
* Allow yourself to purchase a new book after finishing one
* Create a special reading environment with tea, comfortable blankets, etc.
* Share interesting findings from your reading with others
* Take yourself to a café for a special reading session after completing a book
* Create a "reading rewards" jar - add a dollar for each day you read, then use it for book purchases

## Common Obstacles and Solutions
* **Obstacle**: "I fall asleep when reading"
  * **Solution**: Read earlier in the day or try audiobooks
* **Obstacle**: "I can't find books I enjoy"
  * **Solution**: Ask for recommendations, try different genres, abandon books that don't engage you
* **Obstacle**: "I'm too busy"
  * **Solution**: Start with just 5 minutes; always carry a book or e-reader; use audiobooks during commutes
* **Obstacle**: "I get distracted"
  * **Solution**: Create a distraction-free reading environment; use the Pomodoro technique (25 min reading, 5 min break)

Remember that the goal is to make reading a natural and enjoyable part of your day, not a chore to be completed.`;
}

/**
 * Generate an exercise-specific habit plan
 */
function generateExerciseHabitPlan(habitDescription: string): string {
  return `# Exercise Habit Building Plan: ${habitDescription}

## 1. Habit Clarity
**Your habit**: Consistent physical exercise

This habit will improve your physical health, boost energy levels, enhance mood through endorphin release, help manage stress, improve sleep quality, and potentially increase longevity. Regular exercise is one of the most impactful habits for overall wellbeing.

## 2. Implementation Intention
* **When**: Morning before work or during lunch break
* **Where**: Home, local park, or gym
* **Trigger**: After having a glass of water or changing into workout clothes
* **Specific plan**: "After I drink my morning water, I will put on my workout clothes and exercise for at least 5 minutes"

## 3. Starting Small
* Begin with just 5-10 minutes of light exercise
* Choose activities you enjoy (walking, dancing, yoga, etc.)
* Focus on showing up, not intensity or duration
* Gradually increase duration and intensity as your fitness improves

## 4. Environment Design
* Prepare workout clothes the night before
* Create a dedicated space for home workouts if applicable
* Remove obstacles by having equipment ready and accessible
* Put your workout shoes by the door as a visual reminder
* Schedule workouts in your calendar as non-negotiable appointments

## 5. Accountability System
* Find a workout buddy or join a class
* Use a fitness app that tracks your workouts
* Schedule sessions with a personal trainer
* Share your commitment with friends or family
* Join an online fitness community or challenge

## 6. Tracking Method
* Log each workout in a fitness app or journal
* Track key metrics like duration, intensity, or steps
* Take progress photos or measurements monthly
* Note how you feel after each workout
* Use a visual habit tracker (calendar, app, or journal)

## 7. Reward System
* Listen to favorite podcasts or music only during workouts
* Create a post-workout ritual you enjoy (healthy smoothie, etc.)
* Set milestone rewards for consistent adherence (new workout gear, massage)
* Track "non-scale victories" like improved energy or mood
* Celebrate streak milestones (7 days, 30 days, etc.)

## Common Obstacles and Solutions
* **Obstacle**: "I don't have time"
  * **Solution**: Schedule shorter, more intense workouts; break exercise into 5-10 minute segments throughout the day
* **Obstacle**: "I'm too tired"
  * **Solution**: Schedule workouts when your energy is highest; commit to just 5 minutes (often you'll continue once started)
* **Obstacle**: "I don't enjoy exercise"
  * **Solution**: Experiment with different activities until you find enjoyable ones; make it social; combine with entertainment
* **Obstacle**: "I keep getting injured"
  * **Solution**: Start very gradually; focus on proper form; consider working with a professional

Remember that consistency trumps intensity when building a habit. Focus on showing up regularly, even if some sessions are shorter or less intense.`;
}

/**
 * Generate a hydration-specific habit plan
 */
function generateHydrationHabitPlan(habitDescription: string): string {
  return `# Hydration Habit Building Plan: ${habitDescription}

## 1. Habit Clarity
**Your habit**: Drinking adequate water throughout the day

This habit will improve energy levels, cognitive function, skin health, digestion, and overall physical performance. Proper hydration supports nearly every system in your body and can help prevent headaches and fatigue.

## 2. Implementation Intention
* **When**: Throughout the day, starting immediately after waking
* **Where**: Wherever you are - home, work, on the go
* **Trigger**: Link to existing habits like waking up, meals, and breaks
* **Specific plan**: "After I wake up, I will drink a full glass of water before doing anything else"

## 3. Starting Small
* Begin by adding just one additional glass of water per day
* Start with drinking a full glass first thing in the morning
* Use a smaller water bottle if a large one feels overwhelming
* Focus on consistency rather than immediately hitting optimal intake

## 4. Environment Design
* Keep a water bottle visible at all times
* Prepare water bottles the night before and place strategically
* Set up water stations at home and work
* Remove obstacles by having clean bottles ready
* Consider a marked water bottle with time indicators

## 5. Accountability System
* Use a hydration tracking app
* Set regular reminders on your phone
* Find a "hydration buddy" to check in with
* Share your commitment with others
* Track your progress visibly (app, journal, or chart)

## 6. Tracking Method
* Mark each glass of water on a tracking sheet or app
* Note improvements in energy, skin, and other benefits
* Track urine color as an indicator of hydration status
* Record daily total water intake
* Note how you feel on days with good vs. poor hydration

## 7. Reward System
* Add natural flavors to make water more enjoyable
* Invest in a special water bottle you enjoy using
* Celebrate hydration milestones with small rewards
* Link hydration to a cause you care about
* Notice and appreciate improvements in how you feel

## Common Obstacles and Solutions
* **Obstacle**: "I forget to drink water"
  * **Solution**: Set reminders; link to existing habits; use a marked water bottle
* **Obstacle**: "I don't like the taste of water"
  * **Solution**: Add natural flavors like lemon, cucumber, or berries; try sparkling water
* **Obstacle**: "I have limited bathroom access"
  * **Solution**: Focus hydration during times when bathroom access is available
* **Obstacle**: "I prefer other beverages"
  * **Solution**: Gradually replace other drinks with water; use herbal teas as an alternative

Remember that hydration needs vary based on activity level, climate, and individual factors. Focus on consistent improvement rather than an arbitrary number of glasses.`;
}

/**
 * Generate a sleep-specific habit plan
 */
function generateSleepHabitPlan(habitDescription: string): string {
  return `# Sleep Habit Building Plan: ${habitDescription}

## 1. Habit Clarity
**Your habit**: Establishing healthy sleep patterns

This habit will improve cognitive function, emotional regulation, physical recovery, immune function, and overall health. Quality sleep is foundational to nearly every aspect of wellbeing and performance.

## 2. Implementation Intention
* **When**: Begin your wind-down routine 30-60 minutes before target bedtime
* **Where**: Your bedroom and surrounding areas
* **Trigger**: Set an evening alarm as a cue to begin winding down
* **Specific plan**: "When my 9:30pm alarm sounds, I will turn off screens and begin my bedtime routine"

## 3. Starting Small
* Start by setting a consistent wake-up time, even on weekends
* Begin with a 10-minute wind-down routine before bed
* Focus first on sleep environment before changing other habits
* Gradually move bedtime earlier in 15-minute increments

## 4. Environment Design
* Make your bedroom cool, dark, and quiet
* Remove electronics from the bedroom or use night mode/blue light filters
* Invest in comfortable bedding and pillows
* Create a relaxing atmosphere with soft lighting in the evening
* Keep bedroom clutter-free and associated with sleep and relaxation

## 5. Accountability System
* Use a sleep tracking app or device
* Share your sleep goals with household members
* Schedule a weekly review of your sleep patterns
* Find a "sleep accountability" partner with similar goals
* Set up "sleep friendly" social agreements with family/roommates

## 6. Tracking Method
* Record bedtime, wake time, and sleep quality daily
* Note factors that seem to improve or worsen sleep
* Track energy and mood the following day
* Use a sleep tracking app or simple journal
* Review weekly to identify patterns

## 7. Reward System
* Enjoy a pleasant morning ritual after waking up on time
* Notice and appreciate increased daytime energy
* Create a relaxing, enjoyable wind-down routine
* Set milestone rewards for consistent sleep schedule
* Invest in sleep-supporting items as rewards (better pillows, etc.)

## Common Obstacles and Solutions
* **Obstacle**: "I can't fall asleep when I go to bed"
  * **Solution**: Focus on wake time consistency first; develop a relaxing pre-sleep routine; consider sleep restriction therapy
* **Obstacle**: "I use my phone to relax before bed"
  * **Solution**: Switch to physical books, audio content, or relaxation exercises; use extreme blue light filters if using devices
* **Obstacle**: "My schedule varies too much"
  * **Solution**: Set a consistent wake time even when bedtime must vary; create a portable wind-down routine
* **Obstacle**: "My mind races when I try to sleep"
  * **Solution**: Try "brain dumping" thoughts on paper before bed; practice relaxation techniques; consider mindfulness meditation

Remember that sleep quality is often more important than quantity, and that consistency in your sleep-wake cycle is one of the most powerful factors for improving sleep.`;
}

/**
 * Generate a generic habit plan
 */
function generateGenericHabitPlan(habitDescription: string): string {
  return `# Habit Building Plan: ${habitDescription}

## 1. Habit Clarity
**Your habit**: ${habitDescription}

This habit will help you make consistent progress toward your goals, improve your wellbeing, and develop positive routines that support your long-term success. Clear habits reduce decision fatigue and help automate positive behaviors.

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