import { useAuth } from "@/hooks/use-auth";
import { useTimeline } from "@/hooks/use-timeline";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TimelineController from "@/components/dashboard/timeline-controller";
import FutureSelfCard from "@/components/dashboard/future-self-card";
import GoalsProgressCard from "@/components/dashboard/goals-progress-card";
import HabitsTrackerCard from "@/components/dashboard/habits-tracker-card";
import FutureImpactCard from "@/components/dashboard/future-impact-card";
import AICoachCard from "@/components/dashboard/ai-coach-card";
import JournalCard from "@/components/dashboard/journal-card";
import MotivationalQuote from "@/components/dashboard/motivational-quote";

export default function Dashboard() {
  const { user } = useAuth();
  const { timelineYear, updateTimelineYear, projectedProfile, isLoading } = useTimeline();
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fadeIn">
              <div className="pb-5 border-b border-gray-200 flex flex-wrap items-center justify-between">
                <h2 className="text-xl font-bold leading-6 text-gray-900 mb-2 sm:mb-0">Dashboard</h2>
                
                {/* Timeline Controller */}
                <TimelineController 
                  value={timelineYear} 
                  onChange={updateTimelineYear} 
                />
              </div>
              
              {/* Dashboard Content */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Future Self Overview Card */}
                <FutureSelfCard profile={projectedProfile} isLoading={isLoading} />
                
                {/* Goals Progress Card */}
                <GoalsProgressCard />
                
                {/* Habits Tracker Card */}
                <HabitsTrackerCard />
                
                {/* Future Impact Card */}
                <FutureImpactCard timelineYear={timelineYear} />
                
                {/* AI Coach Card */}
                <AICoachCard />
                
                {/* Journal Entry Card */}
                <JournalCard />
              </div>
              
              {/* Motivational Quote Section */}
              <MotivationalQuote />
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
