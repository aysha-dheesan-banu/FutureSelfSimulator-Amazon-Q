import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading } = useAuth();
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and App Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Future Self</h1>
          <p className="text-gray-600">Visualize your potential, design your future</p>
        </div>
        
        {/* Hero Image */}
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
          alt="Person looking at mountain sunrise" 
          className="rounded-xl shadow-lg w-full h-auto my-6" 
        />
        
        {/* Auth Form */}
        {isLogin ? (
          <LoginForm toggleForm={toggleForm} />
        ) : (
          <SignupForm toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
}
