import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Conversation, Message } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AiCoach() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
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
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages]);
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="py-4 px-4 sm:px-6 border-b">
              <h2 className="text-xl font-bold leading-6 text-gray-900">
                AI Life Coach
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Get personalized advice and support for achieving your goals
              </p>
            </div>
            
            <ScrollArea
              ref={scrollRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading conversation...</p>
                </div>
              ) : conversation?.messages && (conversation.messages as Message[]).length > 0 ? (
                (conversation.messages as Message[]).map((msg, index) => (
                  <div key={index} className={cn(
                    "flex mb-4",
                    msg.role === "user" && "justify-end"
                  )}>
                    {msg.role === "assistant" && (
                      <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700 mr-2 flex-shrink-0">
                        <Bot className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <div className={cn(
                        "rounded-lg px-4 py-2 max-w-md",
                        msg.role === "assistant" 
                          ? "bg-secondary-50 rounded-tl-none" 
                          : "bg-primary-50 rounded-tr-none"
                      )}>
                        <p className="text-gray-800">{msg.content}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 ml-2">
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 ml-2 flex-shrink-0">
                        <span className="font-medium">{user.name?.split(" ").map(n => n[0]).join("") || "U"}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mb-4">
                    <Bot className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to your AI Coach</h3>
                  <p className="text-gray-500 max-w-md">
                    I'm here to help you achieve your goals and build habits that lead to success. 
                    Ask me anything about goal setting, habit formation, or overcoming obstacles.
                  </p>
                </div>
              )}
              {sendMessageMutation.isPending && (
                <div className="flex justify-center py-2">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-3 w-3 bg-primary-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-primary-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-primary-300 rounded-full"></div>
                  </div>
                </div>
              )}
            </ScrollArea>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                  placeholder="Ask your AI coach anything..."
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  type="submit" 
                  disabled={!message.trim() || sendMessageMutation.isPending}
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
