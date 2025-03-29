
import React from "react";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Welcome back! Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
