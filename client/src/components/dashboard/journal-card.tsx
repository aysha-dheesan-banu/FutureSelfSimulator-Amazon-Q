import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Journal, Sentiment } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

export default function JournalCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [entry, setEntry] = useState("");
  
  // Fetch recent journal entries
  const { data: journals, isLoading } = useQuery<Journal[]>({
    queryKey: [user ? `/api/users/${user.id}/journals?limit=3` : null],
    enabled: !!user
  });
  
  // Create new journal entry
  const createJournalMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/journals", {
        userId: user?.id,
        content,
        date: new Date().toISOString()
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache to refetch journals
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/journals?limit=3` : null] });
      setEntry("");
    }
  });
  
  const handleSaveEntry = () => {
    if (entry.trim() && !createJournalMutation.isPending) {
      createJournalMutation.mutate(entry);
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };
  
  // Helper function to render sentiment stars
  const renderSentimentStars = (sentiment: Sentiment) => {
    const rating = Math.round(sentiment.rating);
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Smile 
            key={i}
            className={i <= rating 
              ? "text-green-500 h-4 w-4" 
              : "text-gray-300 h-4 w-4"
            } 
          />
        ))}
      </div>
    );
  };
  
  // Calculate the number of entries this week
  const entriesThisWeek = journals?.length || 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Journal</h3>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
            {entriesThisWeek} entries this week
          </Badge>
        </div>
        <div className="mt-4">
          <div className="relative">
            <Textarea
              rows={5}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write today's entry..."
              className="resize-none"
              disabled={createJournalMutation.isPending}
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-gray-500 px-3 py-2">
              {createJournalMutation.data ? (
                <span>
                  Sentiment: <span className="text-green-600">
                    {createJournalMutation.data.sentiment.rating >= 4 
                      ? "Mostly positive" 
                      : createJournalMutation.data.sentiment.rating >= 3 
                        ? "Neutral" 
                        : "Needs attention"}
                  </span>
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
              <Button 
                type="button" 
                variant="link" 
                className="text-primary hover:text-primary/80 h-auto p-0 font-medium"
                onClick={handleSaveEntry}
                disabled={!entry.trim() || createJournalMutation.isPending}
              >
                {createJournalMutation.isPending ? "Saving..." : "Save entry"}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-900">Recent entries</span>
            <span className="text-gray-500">Sentiment</span>
          </div>
          <div className="mt-2 divide-y divide-gray-200">
            {isLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="py-2 flex justify-between items-center animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 w-4 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
              ))
            ) : journals && journals.length > 0 ? (
              journals.map((journal) => (
                <div key={journal.id} className="py-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{formatDate(journal.date)}</span>
                  {journal.sentiment && renderSentimentStars(journal.sentiment as Sentiment)}
                </div>
              ))
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500">No journal entries yet</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
