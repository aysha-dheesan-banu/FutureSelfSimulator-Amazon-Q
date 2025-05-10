import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createJournal } from "@/lib/api-helpers";
import { Sentiment } from "@shared/schema";

interface JournalEntryFormProps {
  onSuccess?: () => void;
}

export function JournalEntryForm({ onSuccess }: JournalEntryFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [journalEntry, setJournalEntry] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  
  // Create journal entry mutation
  const createJournalMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      return createJournal(user.id, content);
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
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (journalEntry.trim() && !createJournalMutation.isPending) {
      createJournalMutation.mutate(journalEntry);
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Entry</CardTitle>
        <CardDescription>Write down your thoughts and feelings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            rows={10}
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="How are you feeling today? What's on your mind?"
            className="resize-none"
            disabled={createJournalMutation.isPending}
          />
          
          <div className="flex justify-between items-center">
            {sentiment && (
              <div className="text-sm">
                Sentiment: <span className={cn(
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
              disabled={!journalEntry.trim() || createJournalMutation.isPending}
            >
              {createJournalMutation.isPending ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}