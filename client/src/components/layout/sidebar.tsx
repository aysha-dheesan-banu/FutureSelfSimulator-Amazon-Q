import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Rocket, 
  Target, 
  BookOpen, 
  MessageSquare, 
  Settings 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { User } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  
  // Get user from localStorage
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("futureUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }
  }, []);
  
  // User level and points
  const level = user?.level || 1;
  const points = user?.points || 0;
  const avatarUrl = user?.avatarUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120";
  
  // Calculate progress to next level
  const pointsToNextLevel = level * 100;
  const progress = (points / pointsToNextLevel) * 100;
  
  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      active: location === "/dashboard",
    },
    {
      name: "My Future Self",
      href: "/future-self",
      icon: Rocket,
      active: location === "/future-self",
    },
    {
      name: "Goals & Habits",
      href: "/goals",
      icon: Target,
      active: location === "/goals",
    },
    {
      name: "Journal",
      href: "/journal",
      icon: BookOpen,
      active: location === "/journal",
    },
    {
      name: "AI Coach",
      href: "/ai-coach",
      icon: MessageSquare,
      active: location === "/ai-coach",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: location === "/settings",
    },
  ];
  
  return (
    <nav className="hidden md:flex md:flex-shrink-0 bg-white border-r border-gray-200">
      <div className="w-64 flex flex-col">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="px-3 mt-3">
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-center">
                {/* Avatar display area */}
                <div className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100 mb-2">
                  <img 
                    src={avatarUrl} 
                    alt="User avatar" 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Level {level}</h3>
                <Progress value={progress} className="h-2 mt-1" />
                <p className="text-xs text-gray-500 mt-1">{points} points</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-2 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  item.active
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    item.active
                      ? "text-primary-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}
