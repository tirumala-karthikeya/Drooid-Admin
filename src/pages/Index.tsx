import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, Link } from "react-router-dom";
import { Users, FileText, MessageSquare, AlertTriangle, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { getStats } from "@/lib/api/apiClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = React.useState([
    { title: "Total Users", value: "0", icon: Users, color: "bg-droid-orange" },
    { title: "Total Posts", value: "0", icon: FileText, color: "bg-droid-orange" },
    { title: "Total Comments", value: "0", icon: MessageSquare, color: "bg-droid-orange" },
    { title: "Active Reports", value: "0", icon: AlertTriangle, color: "bg-droid-orange" },
    { title: "Active Sessions", value: "0", icon: Clock, color: "bg-droid-orange" },
    { title: "Avg. Session Time", value: "0m", icon: BarChart3, color: "bg-droid-orange" }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        
        // Update stats
        setStats([
          { title: "Total Users", value: data.totalUsers.toString(), icon: Users, color: "bg-droid-orange" },
          { title: "Total Posts", value: data.totalPosts.toString(), icon: FileText, color: "bg-droid-orange" },
          { title: "Total Comments", value: data.totalComments.toString(), icon: MessageSquare, color: "bg-droid-orange" },
          { title: "Weekly Posts", value: data.weeklyPosts.toString(), icon: AlertTriangle, color: "bg-droid-orange" },
          { title: "Active Sessions", value: data.activeSessions.toString(), icon: Clock, color: "bg-droid-orange" },
          { title: "Avg. Session Time", value: data.avgSessionTime.toString() + "m", icon: BarChart3, color: "bg-droid-orange" }
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  const renderDashboard = () => (
    <>
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold tracking-tight text-droid-gray"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        <motion.p 
          className="text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to your admin panel overview.
        </motion.p>
      </div>
      
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="overflow-hidden border-droid-orange/20 hover:shadow-lg hover:shadow-droid-orange/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-droid-orange/20 hover:shadow-lg hover:shadow-droid-orange/10 transition-all duration-300">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in the past 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-center"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-2 h-2 bg-droid-orange rounded-full mr-2"></span>
                <span className="text-sm">User #1234 posted a new comment</span>
                <span className="ml-auto text-xs text-gray-500">5 mins ago</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span className="text-sm">Post #5678 was reported</span>
                <span className="ml-auto text-xs text-gray-500">28 mins ago</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="w-2 h-2 bg-droid-orange rounded-full mr-2"></span>
                <span className="text-sm">New user #1235 registered</span>
                <span className="ml-auto text-xs text-gray-500">1 hour ago</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="w-2 h-2 bg-droid-orange rounded-full mr-2"></span>
                <span className="text-sm">Comment #9876 was deleted</span>
                <span className="ml-auto text-xs text-gray-500">3 hours ago</span>
              </motion.li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );

  // Placeholder content for other routes
  const renderPlaceholder = (title: string) => (
    <>
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-droid-gray">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your {title.toLowerCase()} here.</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full border-droid-orange/20 hover:shadow-lg hover:shadow-droid-orange/10 transition-all duration-300">
          <CardHeader>
            <CardTitle>{title} Management</CardTitle>
            <CardDescription>This section will contain {title.toLowerCase()} management functionality.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This feature is under development. Coming soon!</p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );

  const renderLandingPage = () => (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/public/Drooid_Logo_wordmark.png" 
              alt="Droid Logo" 
              className="h-8 mr-2"
            />
          </div>
          <div className="flex space-x-4">
            {isLoading ? (
              <div className="animate-pulse w-20 h-9 bg-gray-200 rounded-md"></div>
            ) : isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-droid-gray text-droid-gray hover:bg-droid-gray/10">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="max-w-md space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-droid-gray dark:text-white">
              Manage Your World with <span className="text-droid-orange">Droid</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The ultimate dashboard for organizing your work, tracking progress, and collaborating with your team.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-droid-gray text-droid-gray hover:bg-droid-gray/10">
                      Sign in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="md:w-1/2 bg-gradient-to-br from-droid-orange to-orange-600 flex items-center justify-center p-8 md:p-16">
          <div className="relative w-full max-w-lg aspect-video bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden animate-slide-in-right">
            <div className="absolute inset-0 flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="h-6 w-24 bg-white/20 rounded-md"></div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg"></div>
                <div className="bg-white/20 rounded-lg"></div>
                <div className="bg-white/20 rounded-lg"></div>
                <div className="bg-white/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>



      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="/public/Drooid_Logo_wordmark.png" 
                alt="Drooid Logo" 
                className="h-6 mr-2" 
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                © 2023 Droid Inc. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-droid-orange">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-droid-orange">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-droid-orange">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // Modify the renderContent function to include the landing page
  const renderContent = () => {
    if (!isAuthenticated && path === '/') {
      return renderLandingPage();
    }

    switch (path) {
      case '/dashboard':
        return renderDashboard();
      case '/users':
        return renderPlaceholder('Users');
      case '/reports':
        return renderPlaceholder('Reports');
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {renderContent()}
    </div>
  );
};

export default Index;
