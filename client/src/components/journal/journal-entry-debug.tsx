import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PenLine, Bug } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

/**
 * A simplified journal entry component for debugging
 */
export function JournalEntryDebug() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [journalEntry, setJournalEntry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalEntry.trim() || isLoading || !user?.id) return;
    
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      console.log("Submitting journal entry with data:", {
        userId: user.id,
        content: journalEntry,
        date: new Date().toISOString()
      });
      
      const response = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          content: journalEntry,
          date: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      console.log("Journal API response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to save journal entry");
      }
      
      setResponse(data);
      setJournalEntry("");
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${user.id}/journals`] 
      });
      
      toast({
        title: "Success",
        description: "Your journal entry has been saved.",
        variant: "default",
      });
    } catch (err) {
      console.error("Journal submission error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      
      toast({
        title: "Error",
        description: "Failed to save your journal entry. See debug info.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="h-5 w-5 mr-2" />
          Debug Journal Entry
        </CardTitle>
        <CardDescription>Simple form for testing journal creation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="debug-journal-content">Journal Entry</Label>
            <Textarea
              id="debug-journal-content"
              rows={5}
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="resize-none"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!journalEntry.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Entry"}
          </Button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800">Error:</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {response && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <h4 className="text-sm font-medium text-green-800">Success Response:</h4>
            <pre className="text-xs text-green-700 overflow-auto max-h-40">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}