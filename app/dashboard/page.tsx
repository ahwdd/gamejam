"use client";

import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Link from "next/link";
import GuardianForm from "@/components/auth/GuardianForm";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showGuardianForm, setShowGuardianForm] = useState(false);

  // Check if user can participate in events
  const canParticipate = user?.profileComplete && 
    (!user?.isMinor || user?.guardianApprovalStatus === "approved");

  // Check if minor needs guardian form
  const needsGuardianForm = user?.isMinor && 
    user?.profileComplete && 
    !user?.guardianApprovalStatus;

  // Check if we can resend based on localStorage
  useEffect(() => {
    const lastResendTime = localStorage.getItem('lastConsentResend');
    if (lastResendTime) {
      const timePassed = Date.now() - parseInt(lastResendTime);
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      if (timePassed < oneHour) {
        setCanResend(false);
        setTimeRemaining(Math.ceil((oneHour - timePassed) / 1000 / 60)); // minutes remaining
      }
    }
  }, []);

  // Update timer every minute
  useEffect(() => {
    if (!canResend && timeRemaining > 0) {
      const interval = setInterval(() => {
        const lastResendTime = localStorage.getItem('lastConsentResend');
        if (lastResendTime) {
          const timePassed = Date.now() - parseInt(lastResendTime);
          const oneHour = 60 * 60 * 1000;
          
          if (timePassed >= oneHour) {
            setCanResend(true);
            setTimeRemaining(0);
          } else {
            setTimeRemaining(Math.ceil((oneHour - timePassed) / 1000 / 60));
          }
        }
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [canResend, timeRemaining]);

  const handleResendConsent = async () => {
    setResendLoading(true);
    setResendError("");
    setResendSuccess(false);

    try {
      const response = await fetch("/api/users/me/resend-consent", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to resend consent");
      }

      // Set last resend time in localStorage
      localStorage.setItem('lastConsentResend', Date.now().toString());
      setCanResend(false);
      setTimeRemaining(60); // 60 minutes
      setResendSuccess(true);

      // Clear success message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      setResendError(err instanceof Error ? err.message : "Failed to resend consent");
    } finally {
      setResendLoading(false);
    }
  };

  const handleGuardianFormSuccess = () => {
    setShowGuardianForm(false);
    refreshUser();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b-4 border-purple-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎮 Student Hub
            </h1>
            <Button variant="outline" onClick={logout} size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Profile Incomplete Alert */}
        {!user?.profileComplete && (
          <div className="bg-yellow-50 border-4 border-yellow-400 rounded-3xl p-6 mb-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <span className="text-5xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-yellow-800 mb-2">
                  Complete Your Profile First!
                </h3>
                <p className="text-yellow-700 font-medium mb-4">
                  You need to complete your profile before you can join events and participate in game jams.
                </p>
                <Link href="/profile/complete">
                  <Button variant="primary" size="lg">
                    ✏️ Complete Profile Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Form Needed Alert */}
        {needsGuardianForm && !showGuardianForm && (
          <div className="bg-purple-50 border-4 border-purple-400 rounded-3xl p-6 mb-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <span className="text-5xl">👨‍👩‍👧</span>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-purple-800 mb-2">
                  Guardian Information Required
                </h3>
                <p className="text-purple-700 font-medium mb-4">
                  You're under 18, so we need your parent or guardian's information before you can participate in events.
                </p>
                <Button variant="primary" size="lg" onClick={() => setShowGuardianForm(true)}>
                  📝 Add Guardian Information
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Form Modal */}
        {showGuardianForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
                👨‍👩‍👧 Guardian Information
              </h2>
              <GuardianForm
                onSuccess={handleGuardianFormSuccess}
                onCancel={() => setShowGuardianForm(false)}
                showCancelButton={true}
              />
            </div>
          </div>
        )}

        {/* Guardian Approval Pending Alert */}
        {user?.isMinor && (user?.guardianApprovalStatus === "pending"|| !user?.guardianApprovalStatus) && (
          <div className="bg-orange-50 border-4 border-orange-400 rounded-3xl p-6 mb-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <span className="text-5xl">⏳</span>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-orange-800 mb-2">
                  Waiting for Guardian Approval
                </h3>
                <p className="text-orange-700 font-medium mb-2">
                  Your guardian consent form is being reviewed by our team. You'll be able to join events once approved!
                </p>
                <p className="text-sm text-orange-600 font-bold mb-4">
                  Check back soon! We typically review forms within 24-48 hours. 🕐
                </p>

                {/* Resend Success Message */}
                {resendSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-green-100 border-2 border-green-400">
                    <p className="text-green-800 font-bold text-sm">
                      ✅ Consent form resent successfully!
                    </p>
                  </div>
                )}

                {/* Resend Error Message */}
                {resendError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-red-400">
                    <p className="text-red-800 font-bold text-sm">
                      ❌ {resendError}
                    </p>
                  </div>
                )}

                {/* Resend Button */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleResendConsent}
                    disabled={!canResend || resendLoading}
                    isLoading={resendLoading}
                  >
                    {canResend ? "📤 Resend Consent Form" : `⏰ Wait ${timeRemaining} min`}
                  </Button>
                  {!canResend && (
                    <span className="text-xs text-orange-600 font-medium">
                      You can resend in {timeRemaining} minute{timeRemaining !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Approval Rejected Alert */}
        {user?.isMinor && user?.guardianApprovalStatus === "rejected" && (
          <div className="bg-red-50 border-4 border-red-400 rounded-3xl p-6 mb-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <span className="text-5xl">❌</span>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-red-800 mb-2">
                  Guardian Approval Needed
                </h3>
                <p className="text-red-700 font-medium mb-4">
                  Your guardian consent was rejected. Please submit a new consent form with clear documents to participate in events.
                </p>
                <Link href="/profile/complete">
                  <Button variant="primary" size="lg">
                    📝 Submit New Guardian Consent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Approval Success Badge */}
        {canParticipate && (
          <div className="bg-green-50 border-4 border-green-400 rounded-3xl p-6 mb-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <span className="text-5xl">✅</span>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-green-800 mb-2">
                  You're All Set!
                </h3>
                <p className="text-green-700 font-medium">
                  Your account is fully activated. You can now join events, create teams, and participate in game jams! 🎉
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-4 border-purple-200">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <span className="text-5xl">👋</span>
                Welcome back, {user?.firstName || "Gamer"}!
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Ready to create some AWESOME games? 🚀
              </p>
            </div>
            <div className="w-20 h-20 bg-linear-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg">
              {user?.firstName?.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-4 border-blue-200">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">👤</span>
            Your Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
              <label className="block text-sm font-bold text-purple-600 mb-1">Name</label>
              <p className="text-gray-900 font-bold text-lg">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            {user?.email && !user?.email.startsWith('+') &&<div className="bg-linear-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
              <label className="block text-sm font-bold text-blue-600 mb-1">Email</label>
              <p className="text-gray-900 font-bold text-lg">{user?.email || "Not provided"}</p>
            </div>}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
              <label className="block text-sm font-bold text-green-600 mb-1">Phone</label>
              <p className="text-gray-900 font-bold text-lg">
                {user?.phoneNumber ? `${user.phoneKey || ""} ${user.phoneNumber}` : "Not provided"}
              </p>
            </div>
            <div className="bg-linear-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
              <label className="block text-sm font-bold text-yellow-600 mb-1">Language</label>
              <p className="text-gray-900 font-bold text-lg">
                {user?.preferredLanguage === "en" ? "English 🇬🇧" : "Arabic 🇦🇪"}
              </p>
            </div>
            <div className="bg-linear-to-r from-pink-50 to-red-50 p-4 rounded-xl border-2 border-pink-200">
              <label className="block text-sm font-bold text-pink-600 mb-1">Account Type</label>
              <p className="text-gray-900 font-bold text-lg">
                {user?.isMinor ? "Student 🎓" : "Adult 👨‍💼"}
              </p>
            </div>
            <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
              <label className="block text-sm font-bold text-indigo-600 mb-1">Status</label>
              <p className="text-gray-900 font-bold text-lg flex items-center gap-2">
                {user?.isActive ? "✅ Active" : "❌ Inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-4xl">⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Browse Events Card */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-blue-200 transition-all ${
            canParticipate 
              ? 'hover:scale-105 hover:shadow-purple-300 hover:shadow-2xl cursor-pointer group' 
              : 'opacity-50 cursor-not-allowed'
          }`}>
            <div className={`text-6xl mb-4 ${canParticipate ? 'group-hover:animate-bounce' : ''}`}>
              📅
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Browse Events</h3>
            <p className="text-gray-600 font-medium">
              {canParticipate 
                ? "Find awesome game jams to join!" 
                : "Complete profile & get approval first"}
            </p>
            {!canParticipate && (
              <div className="mt-3 text-xs font-bold text-red-600">
                🔒 Locked
              </div>
            )}
          </div>

          {/* My Teams Card */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200 transition-all ${
            canParticipate 
              ? 'hover:scale-105 hover:shadow-pink-300 hover:shadow-2xl cursor-pointer group' 
              : 'opacity-50 cursor-not-allowed'
          }`}>
            <div className={`text-6xl mb-4 ${canParticipate ? 'group-hover:animate-bounce' : ''}`}>
              👥
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">My Teams</h3>
            <p className="text-gray-600 font-medium">
              {canParticipate 
                ? "Check out your awesome teams!" 
                : "Complete profile & get approval first"}
            </p>
            {!canParticipate && (
              <div className="mt-3 text-xs font-bold text-red-600">
                🔒 Locked
              </div>
            )}
          </div>

          {/* Submissions Card */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-200 transition-all ${
            canParticipate 
              ? 'hover:scale-105 hover:shadow-blue-300 hover:shadow-2xl cursor-pointer group' 
              : 'opacity-50 cursor-not-allowed'
          }`}>
            <div className={`text-6xl mb-4 ${canParticipate ? 'group-hover:animate-bounce' : ''}`}>
              🎮
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Submissions</h3>
            <p className="text-gray-600 font-medium">
              {canParticipate 
                ? "View your epic game creations!" 
                : "Complete profile & get approval first"}
            </p>
            {!canParticipate && (
              <div className="mt-3 text-xs font-bold text-red-600">
                🔒 Locked
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}