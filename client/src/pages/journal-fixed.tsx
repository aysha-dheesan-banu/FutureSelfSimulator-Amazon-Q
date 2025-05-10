import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Journal, Sentiment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Calendar, Trash2 } from "lucide-react";
import { JournalEntryForm } from "@/components/journal-entry-form";
import { formatSafeDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold leading-6 text-gray-900 pb-5 border-b border-gray-200">
              Journal
            </h2>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <JournalEntryForm />
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Journal History</CardTitle>
                    <CardDescription>Review past entries and track your mood over time</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                    ) : journals && journals.length > 0 ? (
                      <div className="space-y-6">
                        {journals.map((journal) => (
                          <div key={journal.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700 font-medium">
                                  {formatSafeDate(journal.date, 'Journal entry')}
                                </span>
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
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}