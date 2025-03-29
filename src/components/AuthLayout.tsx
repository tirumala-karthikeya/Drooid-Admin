
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Left side - Auth Form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/public/Drooid_Logo_wordmark.png" 
                alt="Drooid Logo" 
                className="h-14 animate-pulse-scale"
              />
            </div>
            <h1 className="text-3xl font-bold text-drooid-gray dark:text-gray-200">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      
      {/* Right side - Decoration */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-drooid-orange to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-xl space-y-8 text-white animate-slide-in-right">
            <h2 className="text-4xl font-bold">Welcome to drooid Dashboard</h2>
            <p className="text-lg opacity-90">Manage all your tasks, track your progress, and stay organized with our powerful dashboard.</p>
            
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-xl font-medium">Easy Access</div>
                <p className="text-sm opacity-80 mt-2">Login securely from anywhere, anytime.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-xl font-medium">Powerful Analytics</div>
                <p className="text-sm opacity-80 mt-2">Get insights on your performance.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-xl font-medium">Team Collaboration</div>
                <p className="text-sm opacity-80 mt-2">Work together efficiently and effectively.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-xl font-medium">Task Management</div>
                <p className="text-sm opacity-80 mt-2">Organize and prioritize your tasks.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-orange-500/20 backdrop-blur-xl"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
