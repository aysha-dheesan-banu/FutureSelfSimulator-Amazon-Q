import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Target, 
  Repeat, 
  BookOpen, 
  User, 
  Sparkles, 
  Menu, 
  X 
} from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Habits", href: "/habits", icon: Repeat },
    { name: "Journal", href: "/journal", icon: BookOpen },
    { name: "FuturePredict", href: "/future-predict", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      {/* Desktop navigation */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">FutureStimulus</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                  >
                    <a
                      className={`${
                        isActive(item.href)
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <Icon
                        className={`${
                          isActive(item.href)
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        } mr-3 h-5 w-5 flex-shrink-0`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + user.name}
                  alt={user.name}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name || user.username}</p>
                <Button
                  variant="link"
                  className="text-xs text-gray-500 p-0 h-auto"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-600">FutureStimulus</h1>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-14">
          <nav className="space-y-1 px-2 py-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <a
                    className={`${
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <Icon
                      className={`${
                        isActive(item.href)
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 h-6 w-6 flex-shrink-0`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 pt-4 pb-3 px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + user.name}
                  alt={user.name}
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name || user.username}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}