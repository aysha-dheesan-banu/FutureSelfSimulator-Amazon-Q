/**
 * Generate personalized inspirational content based on user input
 */

/**
 * Creates personalized inspirational content based on the user's request
 * @param request The user's request for inspiration
 * @returns Personalized inspirational content
 */
export function generateInspiration(request: string): string {
  // Extract key terms from the request
  const cleanRequest = request.toLowerCase().trim();
  
  // Check for specific inspiration types
  if (cleanRequest.includes("quote") || cleanRequest.includes("quotes")) {
    return generateInspirationalQuotes(cleanRequest);
  } else if (cleanRequest.includes("affirmation") || cleanRequest.includes("affirmations")) {
    return generateAffirmations(cleanRequest);
  } else if (cleanRequest.includes("morning") || cleanRequest.includes("start day")) {
    return generateMorningInspiration(cleanRequest);
  } else if (cleanRequest.includes("evening") || cleanRequest.includes("night")) {
    return generateEveningInspiration(cleanRequest);
  } else if (cleanRequest.includes("motivation") || cleanRequest.includes("motivate")) {
    return generateMotivationalContent(cleanRequest);
  } else {
    // Generic inspiration with the request incorporated
    return generateGenericInspiration(cleanRequest);
  }
}

/**
 * Generate inspirational quotes
 */
function generateInspirationalQuotes(request: string): string {
  // Determine the theme based on the request
  let theme = "general";
  if (request.includes("success") || request.includes("achievement")) {
    theme = "success";
  } else if (request.includes("courage") || request.includes("brave")) {
    theme = "courage";
  } else if (request.includes("happiness") || request.includes("joy")) {
    theme = "happiness";
  } else if (request.includes("growth") || request.includes("learning")) {
    theme = "growth";
  }
  
  // Quotes by theme
  const quotes = {
    success: [
      "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
      "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
      "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
      "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
      "The secret of success is to do the common thing uncommonly well. - John D. Rockefeller Jr."
    ],
    courage: [
      "Courage is resistance to fear, mastery of fear, not absence of fear. - Mark Twain",
      "It takes courage to grow up and become who you really are. - E.E. Cummings",
      "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.' - Mary Anne Radmacher",
      "You cannot swim for new horizons until you have courage to lose sight of the shore. - William Faulkner",
      "Life shrinks or expands in proportion to one's courage. - Anais Nin"
    ],
    happiness: [
      "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
      "The most important thing is to enjoy your life—to be happy—it's all that matters. - Audrey Hepburn",
      "Happiness is when what you think, what you say, and what you do are in harmony. - Mahatma Gandhi",
      "The purpose of our lives is to be happy. - Dalai Lama",
      "Happiness is not by chance, but by choice. - Jim Rohn"
    ],
    growth: [
      "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
      "In the middle of every difficulty lies opportunity. - Albert Einstein",
      "Life is 10% what happens to you and 90% how you react to it. - Charles R. Swindoll",
      "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
      "We must be willing to let go of the life we planned so as to have the life that is waiting for us. - Joseph Campbell"
    ],
    general: [
      "The only way to do great work is to love what you do. - Steve Jobs",
      "It does not matter how slowly you go as long as you do not stop. - Confucius",
      "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
      "Believe you can and you're halfway there. - Theodore Roosevelt",
      "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
    ]
  };
  
  // Select 3 random quotes from the theme
  const selectedQuotes = getRandomItems(quotes[theme as keyof typeof quotes], 3);
  
  return `# Daily Inspirational Quotes: ${capitalizeFirstLetter(theme)} Edition

Here are today's inspirational quotes to uplift and motivate you:

## Quote 1
"${selectedQuotes[0]}"

## Quote 2
"${selectedQuotes[1]}"

## Quote 3
"${selectedQuotes[2]}"

## Reflection Question
Take a moment to reflect: Which of these quotes resonates most with you today, and why?

## Action Step
Choose one quote that speaks to you and write it somewhere visible. Let it guide your actions today.`;
}

/**
 * Generate affirmations
 */
function generateAffirmations(request: string): string {
  // Determine the focus based on the request
  let focus = "general";
  if (request.includes("confidence") || request.includes("self-esteem")) {
    focus = "confidence";
  } else if (request.includes("abundance") || request.includes("wealth")) {
    focus = "abundance";
  } else if (request.includes("health") || request.includes("wellness")) {
    focus = "health";
  } else if (request.includes("relationship") || request.includes("love")) {
    focus = "relationships";
  }
  
  // Affirmations by focus
  const affirmations = {
    confidence: [
      "I am confident in my abilities and trust myself completely.",
      "I am worthy of respect and acceptance from others and myself.",
      "I believe in myself and my capacity to succeed.",
      "I am enough exactly as I am.",
      "I face challenges with courage and determination.",
      "I am becoming more confident every day.",
      "I value my unique qualities and strengths."
    ],
    abundance: [
      "I am open and receptive to all the wealth life offers me.",
      "Money flows to me easily and abundantly.",
      "I am worthy of a prosperous life.",
      "My actions create constant prosperity.",
      "I am aligned with the energy of abundance.",
      "Wealth constantly flows into my life.",
      "I am a magnet for success and prosperity."
    ],
    health: [
      "My body is healthy, strong, and full of energy.",
      "I make choices that nourish my body and mind.",
      "I am becoming healthier and stronger every day.",
      "My body knows how to heal itself, and I listen to its wisdom.",
      "I honor my body and give it what it needs.",
      "I am filled with energy and vitality.",
      "Every cell in my body vibrates with energy and health."
    ],
    relationships: [
      "I am worthy of love and belonging.",
      "I attract positive and loving relationships into my life.",
      "I am surrounded by people who respect and value me.",
      "I communicate my needs clearly and with compassion.",
      "I release all toxic relationships from my life.",
      "I am open to giving and receiving love fully.",
      "My relationships are harmonious and fulfilling."
    ],
    general: [
      "I am capable of achieving anything I set my mind to.",
      "Today, I choose to focus on what I can control.",
      "I am becoming better every day in every way.",
      "I have the power to create change in my life.",
      "I am worthy of the success I desire.",
      "My potential is limitless, and my opportunities are abundant.",
      "I trust my intuition and make decisions with confidence."
    ]
  };
  
  // Select 5 random affirmations from the focus
  const selectedAffirmations = getRandomItems(affirmations[focus as keyof typeof affirmations], 5);
  
  return `# Daily Affirmations: ${capitalizeFirstLetter(focus)} Focus

Start your day with these powerful affirmations. Repeat each one 3 times, either aloud or silently:

## Morning Affirmations

1. "${selectedAffirmations[0]}"

2. "${selectedAffirmations[1]}"

3. "${selectedAffirmations[2]}"

## Throughout Your Day

4. "${selectedAffirmations[3]}"

5. "${selectedAffirmations[4]}"

## How to Use These Affirmations

* Say them with conviction and feeling
* Visualize each statement as already true
* Repeat them when facing challenges
* Write your favorite in a place you'll see often

Remember: Your thoughts create your reality. These affirmations help reprogram your subconscious mind for success and positivity.`;
}

/**
 * Generate morning inspiration
 */
function generateMorningInspiration(request: string): string {
  return `# Morning Inspiration: Start Your Day with Purpose

## Morning Affirmation
"Today is full of possibility. I am ready to receive all the good that is coming my way."

## Morning Visualization
Take 30 seconds to close your eyes and visualize your day going perfectly. See yourself accomplishing your goals with ease and joy.

## Today's Focus Areas
1. **Mind**: Learn something new, however small
2. **Body**: Move your body for at least 10 minutes
3. **Spirit**: Take 5 minutes for gratitude or reflection

## Morning Ritual Suggestions
* Drink a full glass of water before anything else
* Stretch for 2 minutes to awaken your body
* Write down your top 3 priorities for the day
* Avoid digital devices for the first 15 minutes

## Today's Inspiration Quote
"The morning wind spreads its fresh smell. We must get up and take that in, that wind that lets us live. Breathe before it's gone." - Rumi

## Quick Morning Energizer
Take 5 deep breaths, inhaling for 4 counts and exhaling for 6 counts. Feel the energy filling your body with each breath.

Make today amazing!`;
}

/**
 * Generate evening inspiration
 */
function generateEveningInspiration(request: string): string {
  return `# Evening Reflection: Close Your Day with Gratitude

## Evening Affirmation
"I release the events of today with peace. I have done my best, and tomorrow is a new opportunity."

## Three Questions for Reflection
1. What went well today? (Celebrate your wins, however small)
2. What challenged me today? (Consider what you learned)
3. What am I grateful for today? (Find at least three things)

## Wind-Down Ritual Suggestions
* Write down any lingering thoughts or tasks for tomorrow
* Dim the lights to signal to your body it's time to rest
* Stretch gently to release physical tension
* Practice 5 minutes of deep breathing or meditation

## Evening Inspiration Quote
"Each night, when I go to sleep, I die. And the next morning, when I wake up, I am reborn." - Mahatma Gandhi

## Tomorrow's Intention
Set a simple intention for tomorrow. Complete this sentence:
"Tomorrow, I intend to approach my day with ________________."

Rest well and recharge. You've earned it.`;
}

/**
 * Generate motivational content
 */
function generateMotivationalContent(request: string): string {
  return `# Daily Motivation: Ignite Your Inner Fire

## Power Statement
You have within you right now everything you need to succeed. Your potential is limitless.

## Remember Your "Why"
Take a moment to reconnect with your deepest motivation:
* What drives you forward?
* Who are you becoming?
* What impact do you want to make?

## Motivation Boosters
1. **Visualize Success**: Take 60 seconds to see yourself achieving your biggest goal
2. **Celebrate Progress**: Acknowledge how far you've already come
3. **Connect to Purpose**: Remember who benefits from your success
4. **Small Wins**: Identify one small action you can take right now

## Motivational Quote
"The difference between a stumbling block and a stepping stone is how high you raise your foot." - Benny Lewis

## Quick Motivation Exercise
Stand tall in a power pose for 2 minutes (hands on hips, shoulders back, chin up). Feel your confidence rising.

## Today's Mantra
"I don't have to be perfect. I just have to take action."

You've got this. Now go make it happen!`;
}

/**
 * Generate generic inspiration
 */
function generateGenericInspiration(request: string): string {
  return `# Daily Inspiration: Fuel for Your Journey

## Today's Inspirational Quote
"The best way to predict the future is to create it." - Abraham Lincoln

## Daily Affirmation
"I am capable, confident, and creating the life I desire."

## Mindful Moment
Take 30 seconds right now to breathe deeply and center yourself. Feel gratitude for this present moment.

## Three Powerful Reminders
1. Your past does not define your future
2. Small steps consistently taken lead to massive results
3. You are stronger than you think and braver than you believe

## Action Challenge
Choose one small action today that aligns with your goals. Even 5 minutes of focused effort creates momentum.

## Inspiration Booster
"Everything you've ever wanted is on the other side of fear." - George Addair

Remember: You are exactly where you need to be on your journey. Trust the process and keep moving forward.`;
}

// Helper function to get random items from an array
function getRandomItems(array: string[], count: number): string[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}