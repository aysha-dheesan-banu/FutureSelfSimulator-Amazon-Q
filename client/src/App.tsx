import { Route, Switch } from "wouter";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import FutureSelf from "@/pages/future-self";
import Goals from "@/pages/goals";
import Journal from "@/pages/journal";
import AiCoach from "@/pages/ai-coach";
import NotFound from "@/pages/not-found";
import { Suspense } from "react";

// Create a loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/future-self" component={FutureSelf} />
        <Route path="/goals" component={Goals} />
        <Route path="/journal" component={Journal} />
        <Route path="/ai-coach" component={AiCoach} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default App;
