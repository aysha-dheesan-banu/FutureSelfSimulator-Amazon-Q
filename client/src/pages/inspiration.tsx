import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyInspiration } from "@/components/dashboard/daily-inspiration";
import { generateInspiration } from "@/components/ai-coach/inspiration-generator";
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Quote, 
  MessageCircle, 
  RefreshCw,
  Heart
} from "lucide-react";

export default function InspirationPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("daily");
  
  // State for different types of inspiration
  const [morningInspiration, setMorningInspiration] = useState(generateInspiration("morning inspiration"));
  const [eveningInspiration, setEveningInspiration] = useState(generateInspiration("evening inspiration"));
  const [quotes, setQuotes] = useState(generateInspiration("inspirational quotes"));
  const [affirmations, setAffirmations] = useState(generateInspiration("daily affirmations"));
  
  // Function to refresh inspiration content
  const refreshInspiration = (type: string) => {
    switch (type) {
      case "morning":
        setMorningInspiration(generateInspiration("morning inspiration"));
        break;
      case "evening":
        setEveningInspiration(generateInspiration("evening inspiration"));
        break;
      case "quotes":
        setQuotes(generateInspiration("inspirational quotes"));
        break;
      case "affirmations":
        setAffirmations(generateInspiration("daily affirmations"));
        break;
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pb-5 border-b border-gray-200 flex flex-wrap items-center justify-between">
              <h2 className="text-xl font-bold leading-6 text-gray-900 mb-2 sm:mb-0 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                Daily Inspiration
              </h2>
            </div>
            
            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="daily">
                    <Heart className="h-4 w-4 mr-2" />
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="morning">
                    <Sun className="h-4 w-4 mr-2" />
                    Morning
                  </TabsTrigger>
                  <TabsTrigger value="evening">
                    <Moon className="h-4 w-4 mr-2" />
                    Evening
                  </TabsTrigger>
                  <TabsTrigger value="library">
                    <Quote className="h-4 w-4 mr-2" />
                    Library
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                          Today's Inspiration
                        </CardTitle>
                        <CardDescription>
                          Your daily dose of motivation and positivity
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DailyInspiration />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                          Personalized Inspiration
                        </CardTitle>
                        <CardDescription>
                          Ask for specific inspiration in the AI Coach
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Visit the AI Coach and ask for personalized inspiration like:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                          <li>"Give me inspiration for overcoming challenges"</li>
                          <li>"I need motivation for my fitness journey"</li>
                          <li>"Share some quotes about perseverance"</li>
                          <li>"Give me affirmations for self-confidence"</li>
                        </ul>
                        <div className="pt-2">
                          <Button>
                            Go to AI Coach
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="morning" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                          Morning Inspiration
                        </CardTitle>
                        <CardDescription>
                          Start your day with purpose and positivity
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => refreshInspiration("morning")}
                        className="text-xs flex items-center"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: morningInspiration.replace(/\n/g, '<br>').replace(/^# (.*)/gm, '<h2>$1</h2>').replace(/^## (.*)/gm, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="evening" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Moon className="h-5 w-5 mr-2 text-blue-500" />
                          Evening Reflection
                        </CardTitle>
                        <CardDescription>
                          End your day with gratitude and reflection
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => refreshInspiration("evening")}
                        className="text-xs flex items-center"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: eveningInspiration.replace(/\n/g, '<br>').replace(/^# (.*)/gm, '<h2>$1</h2>').replace(/^## (.*)/gm, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="library" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Quote className="h-5 w-5 mr-2 text-green-500" />
                            Inspirational Quotes
                          </CardTitle>
                          <CardDescription>
                            Wisdom to motivate and inspire
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => refreshInspiration("quotes")}
                          className="text-xs flex items-center"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refresh
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: quotes.replace(/\n/g, '<br>').replace(/^# (.*)/gm, '<h2>$1</h2>').replace(/^## (.*)/gm, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Heart className="h-5 w-5 mr-2 text-red-500" />
                            Daily Affirmations
                          </CardTitle>
                          <CardDescription>
                            Positive statements to empower your day
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => refreshInspiration("affirmations")}
                          className="text-xs flex items-center"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refresh
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: affirmations.replace(/\n/g, '<br>').replace(/^# (.*)/gm, '<h2>$1</h2>').replace(/^## (.*)/gm, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}