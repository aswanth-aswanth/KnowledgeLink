"use client";

import React from "react";
import LoginForm from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center sm:p-4 p-2">
      <div className="w-full max-w-md bg-white md:p-8 p-4 rounded-lg shadow-lg transform transition-all">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Welcome back
        </h2>
        <SocialLoginButtons />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
