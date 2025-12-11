// select.tsx
"use client";

import React from "react";

interface Option {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  options?: Option[];
  placeholder?: string;
  className?: string;
}

export default function Select({
  label,
  error,
  icon,
  helperText,
  options = [],
  placeholder,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`;
  const describedBy = error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-bold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        <select
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400
            disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                   : "border-gray-200 focus:border-purple-400 focus:ring-purple-100"}
            ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {/* render provided options if any; otherwise allow children */}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {/* small chevron on right (visual only) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
