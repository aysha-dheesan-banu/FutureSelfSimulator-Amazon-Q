import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { AdvancedAICoach } from "@/components/ai-coach/advanced-ai-coach";

export default function AiCoachPage() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="py-4 px-4 sm:px-6 border-b">
            <h2 className="text-xl font-bold leading-6 text-gray-900">
              AI Life Coach
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Get personalized advice and support for achieving your goals
            </p>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <AdvancedAICoach className="h-full" />
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}