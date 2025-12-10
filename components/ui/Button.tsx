"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
    variant = "primary", size = "md", isLoading = false, children, className = "", disabled, ...props
}: ButtonProps) {
  const baseStyles =
    "font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4";

  const variants = {
    primary: `bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:via-pink-600 
        hover:to-red-600 shadow-lg hover:shadow-xl hover:scale-105 focus:ring-purple-300`,
    secondary: `bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white hover:from-blue-600 hover:via-cyan-600 
        hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105 focus:ring-blue-300`,
    outline: `border-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:scale-105 focus:ring-purple-300`,
    ghost: `text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300`,
    danger: `bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl 
        hover:scale-105 focus:ring-red-300`,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}