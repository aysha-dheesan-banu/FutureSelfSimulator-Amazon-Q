import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { JournalEntryDebug } from "@/components/journal/journal-entry-debug";
import { JournalHistory } from "@/components/journal/journal-history";

export default function JournalDebugPage() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold leading-6 text-gray-900 pb-5 border-b border-gray-200">
              Journal Debug Page
            </h2>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <JournalEntryDebug />
              </div>
              
              <div className="lg:col-span-2">
                <JournalHistory />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}