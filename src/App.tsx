import './App.css'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";
import Posts from "./pages/Posts";
import Comments from "./pages/Comments";
import Sessions from "./pages/Sessions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Index />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute restricted>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute restricted>
              <Signup />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute restricted>
              <ForgotPassword />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Index />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Index />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/posts" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Posts />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/comments" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Comments />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Index />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Sessions />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
