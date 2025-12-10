"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export default function Input({ label, error, icon, helperText, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 
        disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 transition-all duration-200 
            ${icon ? "pl-10" : ""}
            ${error? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-purple-400 focus:ring-purple-100"}
            ${className}`}
          {...props}/>
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}