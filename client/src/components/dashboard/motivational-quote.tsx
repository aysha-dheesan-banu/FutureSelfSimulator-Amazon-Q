import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMotivationalQuote } from "@/lib/openai";

export default function MotivationalQuote() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch a motivational quote on component mount
  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoading(true);
      try {
        const { quote, author } = await getMotivationalQuote();
        setQuote(quote);
        setAuthor(author);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote("The future belongs to those who believe in the beauty of their dreams.");
        setAuthor("Eleanor Roosevelt");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuote();
  }, []);
  
  const handleRefreshQuote = async () => {
    setIsLoading(true);
    try {
      const { quote, author } = await getMotivationalQuote();
      setQuote(quote);
      setAuthor(author);
    } catch (error) {
      console.error("Error refreshing quote:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-8">
      <Card className="bg-gradient-to-r from-primary to-purple-600 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-8 sm:px-6 flex flex-col md:flex-row items-center">
          {/* Inspirational image */}
          <img 
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
            alt="Person climbing mountain at sunrise" 
            className="rounded-lg shadow-lg h-48 w-auto object-cover md:mr-6 mb-4 md:mb-0" 
          />
          
          <div className="flex-1 text-center md:text-left">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-7 bg-white bg-opacity-20 rounded w-3/4 mx-auto md:mx-0"></div>
                <div className="mt-2 h-5 bg-white bg-opacity-20 rounded w-1/4 mx-auto md:mx-0"></div>
              </div>
            ) : (
              <>
                <p className="text-xl font-medium text-white italic">"{quote}"</p>
                <p className="mt-2 text-white text-opacity-80">{author}</p>
              </>
            )}
            <Button 
              onClick={handleRefreshQuote} 
              className="mt-4 bg-white hover:bg-gray-100 text-primary-700"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get daily inspiration"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
