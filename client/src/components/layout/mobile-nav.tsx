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

export default function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      active: location === "/dashboard",
    },
    {
      name: "Future Self",
      href: "/future-self",
      icon: Rocket,
      active: location === "/future-self",
    },
    {
      name: "Goals",
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
      name: "Coach",
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
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 inset-x-0 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex-1 flex flex-col items-center pt-2 pb-2"
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                item.active ? "text-primary" : "text-gray-500"
              )}
            />
            <span className={cn(
              "text-xs mt-1",
              item.active ? "text-primary" : "text-gray-500"
            )}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
