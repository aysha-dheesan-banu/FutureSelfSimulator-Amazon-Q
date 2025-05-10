import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smile, Calendar, PenLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Sentiment } from "@shared/schema";

interface EnhancedJournalEntryProps {
  onSuccess?: () => void;
}

export function EnhancedJournalEntry({ onSuccess }: EnhancedJournalEntryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [journalEntry, setJournalEntry] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [journalType, setJournalType] = useState<string>("daily");
  const [mood, setMood] = useState<string>("neutral");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Create journal entry mutation
  const createJournalMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      setIsAnalyzing(true);
      
      // Add metadata based on journal type and mood
      const metadata = {
        journalType,
        mood,
        tags: getTagsFromContent(journalEntry)
      };
      
      const response = await apiRequest("POST", "/api/journals", {
        userId: user.id,
        content: journalEntry,
        date: new Date().toISOString(),
        metadata
      });
      
      setIsAnalyzing(false);
      return response.json();
    },
    onSuccess: (data) => {
      // Set sentiment for display
      if (data?.sentiment) {
        setSentiment(data.sentiment as Sentiment);
      }
      
      // Clear the form
      setJournalEntry("");
      
      // Show success message
      toast({
        title: "Success",
        description: "Your journal entry has been saved.",
        variant: "default",
      });
      
      // Invalidate queries to refresh data
      if (user) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/users/${user.id}/journals`] 
        });
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Journal creation error:", error);
      setIsAnalyzing(false);
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Extract potential tags from content
  const getTagsFromContent = (content: string): string[] => {
    // Look for hashtags in the content
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    
    if (matches) {
      return matches.map(tag => tag.substring(1));
    }
    
    return [];
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (journalEntry.trim() && !createJournalMutation.isPending) {
      createJournalMutation.mutate();
    }
  };
  
  // Function to get sentiment text
  const getSentimentText = (sentiment: Sentiment) => {
    const rating = sentiment.rating;
    if (rating >= 4) return "Very Positive";
    if (rating >= 3) return "Positive";
    if (rating > 2) return "Neutral";
    if (rating > 1) return "Negative";
    return "Very Negative";
  };
  
  // Get placeholder text based on journal type
  const getPlaceholder = () => {
    switch (journalType) {
      case "daily":
        return "How are you feeling today? What's on your mind?";
      case "gratitude":
        return "What are you grateful for today? List 3-5 things that brought you joy or appreciation.";
      case "reflection":
        return "Reflect on your recent experiences. What have you learned? What would you do differently?";
      case "goals":
        return "What progress have you made toward your goals? What are your next steps?";
      default:
        return "Write your thoughts here...";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PenLine className="h-5 w-5 mr-2" />
          New Journal Entry
        </CardTitle>
        <CardDescription>Express yourself and track your emotional journey</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="w-full sm:w-1/2">
              <Label htmlFor="journal-type">Entry Type</Label>
              <Select 
                value={journalType} 
                onValueChange={setJournalType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Journal</SelectItem>
                  <SelectItem value="gratitude">Gratitude</SelectItem>
                  <SelectItem value="reflection">Reflection</SelectItem>
                  <SelectItem value="goals">Goal Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/2">
              <Label htmlFor="mood">Current Mood</Label>
              <Select 
                value={mood} 
                onValueChange={setMood}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="anxious">Anxious</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="frustrated">Frustrated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="journal-content">Journal Entry</Label>
            <Textarea
              id="journal-content"
              rows={10}
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder={getPlaceholder()}
              className="resize-none"
              disabled={createJournalMutation.isPending || isAnalyzing}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Use #hashtags to add tags to your entry
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            {sentiment && (
              <div className="text-sm">
                <span className="font-medium">Sentiment Analysis: </span>
                <span className={cn(
                  "font-medium",
                  sentiment.rating >= 4 ? "text-green-600" :
                  sentiment.rating >= 3 ? "text-green-500" :
                  sentiment.rating > 2 ? "text-gray-600" :
                  sentiment.rating > 1 ? "text-orange-600" :
                  "text-red-600"
                )}>
                  {getSentimentText(sentiment)}
                </span>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={!journalEntry.trim() || createJournalMutation.isPending || isAnalyzing}
              className="flex items-center"
            >
              {createJournalMutation.isPending || isAnalyzing ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}