
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/services/authService";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Call the password reset API service
      await requestPasswordReset(email);
      
      setSuccess(true);
      toast({
        title: "Password reset link sent",
        description: "Check your email for instructions to reset your password",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to send password reset email. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Failed to send password reset link",
        description: "Please check your email address and try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {success ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Password reset email sent!</p>
            <p className="text-sm mt-1">
              We've sent instructions to {email}. Please check your inbox.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
            >
              Try another email
            </Button>
            
            <Link to="/login">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Return to login
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 ${
                  error ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
            </div>
            
            {error && (
              <p className="form-error flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>

          <Link to="/login" className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
            <ArrowLeft size={16} className="mr-1" />
            Back to login
          </Link>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
