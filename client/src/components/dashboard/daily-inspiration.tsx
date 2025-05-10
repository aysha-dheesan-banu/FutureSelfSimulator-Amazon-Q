import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

interface DailyInspirationProps {
  category?: "motivation" | "mindfulness" | "growth" | "success" | "random";
}

// Collection of inspirational quotes by category
const inspirationalQuotes = {
  motivation: [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "The way to get started is to quit talking and begin doing. - Walt Disney"
  ],
  mindfulness: [
    "The present moment is the only moment available to us, and it is the door to all moments. - Thich Nhat Hanh",
    "Mindfulness isn't difficult, we just need to remember to do it. - Sharon Salzberg",
    "Be happy in the moment, that's enough. Each moment is all we need, not more. - Mother Teresa",
    "The best way to capture moments is to pay attention. - Jon Kabat-Zinn",
    "Wherever you are, be there totally. - Eckhart Tolle",
    "The mind is everything. What you think you become. - Buddha",
    "You are the sky. Everything else is just the weather. - Pema Chödrön",
    "Life is available only in the present moment. - Thich Nhat Hanh"
  ],
  growth: [
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "In the middle of every difficulty lies opportunity. - Albert Einstein",
    "Life is 10% what happens to you and 90% how you react to it. - Charles R. Swindoll",
    "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
    "We must be willing to let go of the life we planned so as to have the life that is waiting for us. - Joseph Campbell",
    "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong. - N.R. Narayana Murthy",
    "The greatest discovery of all time is that a person can change their future by merely changing their attitude. - Oprah Winfrey",
    "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar"
  ],
  success: [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
    "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
    "The secret of success is to do the common thing uncommonly well. - John D. Rockefeller Jr.",
    "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
    "Success is not how high you have climbed, but how you make a positive difference to the world. - Roy T. Bennett",
    "Don't be afraid to give up the good to go for the great. - John D. Rockefeller"
  ]
};

// Collection of daily affirmations
const dailyAffirmations = [
  "I am capable of achieving anything I set my mind to.",
  "Today, I choose to focus on what I can control.",
  "I am becoming better every day in every way.",
  "I have the power to create change in my life.",
  "I am worthy of the success I desire.",
  "My potential is limitless, and my opportunities are abundant.",
  "I trust my intuition and make decisions with confidence.",
  "I am resilient and can overcome any challenge.",
  "I embrace change and welcome new opportunities.",
  "I am grateful for all that I have and all that is coming.",
  "My body is healthy; my mind is brilliant; my soul is tranquil.",
  "I am surrounded by people who believe in me and support my goals."
];

// Collection of action prompts
const actionPrompts = [
  "Take 5 minutes today to write down three things you're grateful for.",
  "Reach out to someone you admire and ask them one question about their journey.",
  "Try a new approach to a challenge you've been facing.",
  "Take a 10-minute walk outside and notice five beautiful things.",
  "Write down your top three priorities for tomorrow before ending your day.",
  "Practice deep breathing for 2 minutes whenever you feel stressed today.",
  "Compliment someone sincerely on something they might not hear often.",
  "Read one article or watch one video about a topic you want to learn more about.",
  "Drink a glass of water right now and set a reminder to stay hydrated throughout the day.",
  "Identify one task you've been procrastinating and take the first small step toward completing it.",
  "Spend 15 minutes organizing your workspace for better focus and productivity.",
  "Write down one limiting belief you have and challenge it with evidence to the contrary."
];

export function DailyInspiration({ category = "random" }: DailyInspirationProps) {
  const [quote, setQuote] = useState<string>("");
  const [affirmation, setAffirmation] = useState<string>("");
  const [actionPrompt, setActionPrompt] = useState<string>("");
  
  // Function to get a random item from an array
  const getRandomItem = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Function to generate new inspiration
  const generateInspiration = () => {
    // Get a random category if set to random
    const categories = Object.keys(inspirationalQuotes) as Array<keyof typeof inspirationalQuotes>;
    const selectedCategory = category === "random" 
      ? categories[Math.floor(Math.random() * categories.length)]
      : category;
    
    // Set new quote, affirmation, and action prompt
    setQuote(getRandomItem(inspirationalQuotes[selectedCategory]));
    setAffirmation(getRandomItem(dailyAffirmations));
    setActionPrompt(getRandomItem(actionPrompts));
  };
  
  // Generate inspiration on component mount and when category changes
  useEffect(() => {
    generateInspiration();
    
    // Set up daily refresh (if component stays mounted)
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      generateInspiration();
    }, timeUntilMidnight);
    
    return () => clearTimeout(timer);
  }, [category]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Daily Inspiration
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {quote && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Quote of the Day</h3>
            <p className="text-sm italic">{quote}</p>
          </div>
        )}
        
        {affirmation && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Today's Affirmation</h3>
            <p className="text-sm font-medium">{affirmation}</p>
          </div>
        )}
        
        {actionPrompt && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Action Step</h3>
            <p className="text-sm">{actionPrompt}</p>
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateInspiration}
            className="text-xs flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            New Inspiration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}