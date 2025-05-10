import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import FuturePredictPage from "@/pages/future-predict";
import GoalsPage from "@/pages/goals";
import HabitsPage from "@/pages/habits";
import JournalPage from "@/pages/journal";
import ProtectedRoute from "@/components/auth/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/future-predict">
          <ProtectedRoute>
            <AppLayout>
              <FuturePredictPage />
            </AppLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/goals">
          <ProtectedRoute>
            <AppLayout>
              <GoalsPage />
            </AppLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/habits">
          <ProtectedRoute>
            <AppLayout>
              <HabitsPage />
            </AppLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/journal">
          <ProtectedRoute>
            <AppLayout>
              <JournalPage />
            </AppLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/">
          <LoginPage />
        </Route>
      </Switch>
      <Toaster />
    </AuthProvider>
  );
}