import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Smile, Calendar, Trash2, Tag, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Journal, Sentiment } from "@shared/schema";
import { formatSafeDate } from "@/lib/date-utils";

interface JournalHistoryProps {
  limit?: number;
  showFilters?: boolean;
}

export function JournalHistory({ limit, showFilters = true }: JournalHistoryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Fetch journal entries
  const { data: journals, isLoading } = useQuery<Journal[]>({
    queryKey: [user ? `/api/users/${user.id}/journals` : null],
    enabled: !!user,
    onError: (error) => {
      console.error("Error fetching journals:", error);
      toast({
        title: "Error",
        description: "Failed to load journal entries. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete journal entry
  const deleteJournalMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/journals/${id}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate cache to refetch journals
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/journals` : null] });
      toast({
        title: "Success",
        description: "Your journal entry has been deleted.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Error deleting journal:", error);
      toast({
        title: "Error",
        description: "Failed to delete journal entry. Please try again.",
        variant: "destructive",
      });
    }
  });
  
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
  
  // Function to get sentiment text
  const getSentimentText = (sentiment: Sentiment) => {
    const rating = sentiment.rating;
    if (rating >= 4) return "Very Positive";
    if (rating >= 3) return "Positive";
    if (rating > 2) return "Neutral";
    if (rating > 1) return "Negative";
    return "Very Negative";
  };
  
  // Filter and search journals
  const filteredJournals = journals?.filter(journal => {
    // Apply type filter
    if (filter !== "all" && journal.metadata?.journalType !== filter) {
      return false;
    }
    
    // Apply search term
    if (searchTerm && !journal.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Limit the number of journals if specified
  const displayJournals = limit && filteredJournals 
    ? filteredJournals.slice(0, limit) 
    : filteredJournals;
  
  // Extract tags from journal
  const getJournalTags = (journal: Journal): string[] => {
    if (journal.metadata?.tags && Array.isArray(journal.metadata.tags)) {
      return journal.metadata.tags;
    }
    
    // Extract hashtags from content as fallback
    const hashtagRegex = /#(\w+)/g;
    const matches = journal.content.match(hashtagRegex);
    
    if (matches) {
      return matches.map(tag => tag.substring(1));
    }
    
    return [];
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal History</CardTitle>
        <CardDescription>Review past entries and track your mood over time</CardDescription>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:max-w-xs"
              />
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Tabs value={filter} onValueChange={setFilter} className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
                    <TabsTrigger value="reflection">Reflection</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-4 w-4 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="h-24 bg-gray-100 rounded mb-2"></div>
              </div>
            ))}
          </div>
        ) : displayJournals && displayJournals.length > 0 ? (
          <div className="space-y-6">
            {displayJournals.map((journal) => (
              <div key={journal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 font-medium">
                      {formatSafeDate(journal.date, 'Journal entry')}
                    </span>
                    {journal.metadata?.journalType && (
                      <Badge variant="outline" className="ml-2">
                        {journal.metadata.journalType}
                      </Badge>
                    )}
                    {journal.metadata?.mood && (
                      <Badge variant="secondary" className="ml-1">
                        {journal.metadata.mood}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {journal.sentiment && renderSentimentStars(journal.sentiment as Sentiment)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteJournalMutation.mutate(journal.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
                  {journal.content}
                </div>
                
                {/* Tags section */}
                {getJournalTags(journal).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Tag className="h-3.5 w-3.5 text-gray-500 mr-1" />
                    {getJournalTags(journal).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {journal.sentiment && (
                  <div className="text-xs text-gray-500">
                    Mood: <span className={cn(
                      "font-medium",
                      (journal.sentiment as Sentiment).rating >= 4 ? "text-green-600" :
                      (journal.sentiment as Sentiment).rating >= 3 ? "text-green-500" :
                      (journal.sentiment as Sentiment).rating > 2 ? "text-gray-600" :
                      (journal.sentiment as Sentiment).rating > 1 ? "text-orange-600" :
                      "text-red-600"
                    )}>
                      {getSentimentText(journal.sentiment as Sentiment)}
                    </span> (confidence: {Math.round((journal.sentiment as Sentiment).confidence * 100)}%)
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">You don't have any journal entries yet.</p>
            <p className="text-gray-500">Start journaling to track your thoughts and feelings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}