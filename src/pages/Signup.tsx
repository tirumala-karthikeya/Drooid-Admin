
import React from "react";
import AuthLayout from "@/components/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

const Signup: React.FC = () => {
  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Join us! Enter your details to create your account"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
