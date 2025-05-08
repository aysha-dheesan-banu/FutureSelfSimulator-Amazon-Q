import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Briefcase, GraduationCap, Heart, Coins } from "lucide-react";
import { Link } from "wouter";
import { FutureProfile } from "@shared/schema";

interface FutureSelfCardProps {
  profile: Partial<FutureProfile> | null;
  isLoading?: boolean;
}

export default function FutureSelfCard({ profile, isLoading = false }: FutureSelfCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 animate-pulse">
          <h3 className="text-lg font-medium text-gray-900">Your Future Self</h3>
          <div className="mt-4 flex items-center">
            <div className="mr-4">
              <div className="h-20 w-20 rounded-full bg-gray-200 border-2 border-primary-300"></div>
            </div>
            <div className="w-full">
              <div className="mt-1 flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="ml-2 h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="mt-1 flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="ml-2 h-4 bg-gray-200 rounded w-36"></div>
              </div>
              <div className="mt-1 flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="ml-2 h-4 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="mt-1 flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="ml-2 h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium text-gray-900">Your Future Self</h3>
        <div className="mt-4 flex items-center">
          <div className="mr-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary-300">
              <img 
                src={profile?.avatarUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"} 
                alt="Future avatar" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
          <div>
            <div className="mt-1 flex items-center">
              <Briefcase className="text-gray-400 w-5 h-5" />
              <span className="ml-2 text-sm text-gray-900">{profile?.career || "Loading..."}</span>
            </div>
            <div className="mt-1 flex items-center">
              <GraduationCap className="text-gray-400 w-5 h-5" />
              <span className="ml-2 text-sm text-gray-900">{profile?.education || "Loading..."}</span>
            </div>
            <div className="mt-1 flex items-center">
              <Heart className="text-gray-400 w-5 h-5" />
              <span className="ml-2 text-sm text-gray-900">{profile?.health || "Loading..."}</span>
            </div>
            <div className="mt-1 flex items-center">
              <Coins className="text-gray-400 w-5 h-5" />
              <span className="ml-2 text-sm text-gray-900">{profile?.wealth || "Loading..."}</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="link" asChild className="p-0 h-auto text-sm font-medium text-primary hover:text-primary/80">
            <Link href="/future-self">
              Update your profile <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
