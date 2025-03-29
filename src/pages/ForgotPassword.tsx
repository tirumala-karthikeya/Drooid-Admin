
import React from "react";
import AuthLayout from "@/components/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your email and we'll send you a password reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
