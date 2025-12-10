// /auth/signin/page.tsx
"use client";

import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-12">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-20 h-20 bg-blue-300 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-1/3 left-20 w-16 h-16 bg-purple-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-32 right-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-cyan-300 rounded-full opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎮 Student Hub 🚀
          </h1>
          <p className="text-xl text-gray-700 font-bold">
            Welcome Back, Game Creator!
          </p>
        </div>

        <SignInForm />

        <div className="text-center mt-8">
          <p className="text-gray-700 font-medium">
            New to Student Hub?{" "}
            <Link href="/auth/signup"
              className="text-purple-600 hover:text-purple-800 font-bold underline">
              Create Account! →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}