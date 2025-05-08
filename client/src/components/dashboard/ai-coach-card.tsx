import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation, Message } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

export default function AICoachCard() {
  // Get user from localStorage as a fallback if context is not available
  let user;
  try {
    const storedUser = localStorage.getItem("futureUser");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Error parsing stored user", e);
  }
  
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  
  // Fetch the user's conversation
  const { data: conversation, isLoading } = useQuery<Conversation>({
    queryKey: [user ? `/api/users/${user.id}/conversation` : null],
    enabled: !!user
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (conversation) {
        // Add user message to existing conversation
        const response = await apiRequest("POST", `/api/conversations/${conversation.id}`, { 
          message: text 
        });
        
        // Get AI reply
        const replyResponse = await apiRequest("POST", `/api/conversations/${conversation.id}/reply`, { 
          message: text 
        });
        
        return replyResponse.json();
      } else {
        // Create new conversation with user message
        const response = await apiRequest("POST", "/api/conversations", {
          userId: user?.id,
          message: text
        });
        
        const newConversation = await response.json();
        
        // Get AI reply
        const replyResponse = await apiRequest("POST", `/api/conversations/${newConversation.id}/reply`, { 
          message: text 
        });
        
        return replyResponse.json();
      }
    },
    onSuccess: () => {
      // Invalidate cache to refetch conversation
      queryClient.invalidateQueries({ queryKey: [user ? `/api/users/${user.id}/conversation` : null] });
      setMessage("");
    }
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
    }
  };
  
  // Get the most recent messages (up to 5)
  const recentMessages = conversation?.messages as Message[] || [];
  const displayMessages = recentMessages.slice(-5);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium text-gray-900">AI Life Coach</h3>
        <ScrollArea className="mt-4 h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading conversation...</p>
            </div>
          ) : displayMessages.length > 0 ? (
            displayMessages.map((msg, index) => (
              <div key={index} className={cn(
                "flex mb-3",
                msg.role === "user" && "justify-end"
              )}>
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700 mr-2 flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={cn(
                  "rounded-lg p-2 max-w-[85%]",
                  msg.role === "assistant" 
                    ? "bg-secondary-50 rounded-tl-none" 
                    : "bg-primary-50 rounded-tr-none"
                )}>
                  <p className="text-gray-800">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 ml-2 flex-shrink-0">
                    <span className="text-xs">{user?.name?.split(" ").map(n => n[0]).join("") || "U"}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-8 w-8 text-secondary-500 mb-2" />
              <p className="text-gray-500">Start chatting with your AI coach</p>
            </div>
          )}
          {sendMessageMutation.isPending && (
            <div className="flex justify-center py-2">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-primary-300 rounded-full"></div>
                <div className="h-2 w-2 bg-primary-300 rounded-full"></div>
                <div className="h-2 w-2 bg-primary-300 rounded-full"></div>
              </div>
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            placeholder="Ask your AI coach..."
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="ml-3"
            disabled={!message.trim() || sendMessageMutation.isPending}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
