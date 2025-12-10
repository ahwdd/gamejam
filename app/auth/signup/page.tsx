// /app/auth/signup/page.tsx
"use client";

import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-100 to-blue-100 px-4 py-12">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            🎮 Student Hub 🚀
          </h1>
          <p className="text-xl text-gray-700 font-bold">
            Join the ULTIMATE Game Jam Experience!
          </p>
        </div>

        <SignUpForm />

        <div className="text-center mt-8">
          <p className="text-gray-700 font-medium">
            Already have an account?{" "}
            <Link href="/auth/signin"
              className="text-purple-600 hover:text-purple-800 font-bold underline">
              Sign In Here! →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}