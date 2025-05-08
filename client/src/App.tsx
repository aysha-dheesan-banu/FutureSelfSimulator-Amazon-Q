import { Route, Switch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import FutureSelf from "@/pages/future-self";
import Goals from "@/pages/goals";
import Journal from "@/pages/journal";
import AiCoach from "@/pages/ai-coach";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, [key: string]: any }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <Component {...rest} />;
}

function App() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/future-self">
        <ProtectedRoute component={FutureSelf} />
      </Route>
      <Route path="/goals">
        <ProtectedRoute component={Goals} />
      </Route>
      <Route path="/journal">
        <ProtectedRoute component={Journal} />
      </Route>
      <Route path="/ai-coach">
        <ProtectedRoute component={AiCoach} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
