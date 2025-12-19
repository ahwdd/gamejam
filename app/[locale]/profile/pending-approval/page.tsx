"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

export default function PendingApprovalPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      // If not a minor or already approved, redirect
      if (!user.isMinor || user.guardianApprovalStatus === "approved") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  const handleRefresh = async () => {
    await refreshUser();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-100 via-pink-100 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-700 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  const isRejected = user?.guardianApprovalStatus === "rejected";

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-100 to-blue-100 px-4 py-12">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {isRejected ? "⚠️ Action Required" : "⏳ Approval Pending"}
          </h1>
        </div>

        {/* Status Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          {isRejected ? (
            <>
              {/* Rejection Notice */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Guardian Consent Not Approved
                </h2>
                <p className="text-gray-600 font-medium">
                  Our admin team reviewed your guardian's submission and requires some changes.
                </p>
              </div>

              {/* Rejection Reason */}
              {user?.guardian?.rejectionReason && (
                <div className="mb-6 p-6 rounded-2xl bg-red-50 border-2 border-red-200">
                  <h3 className="font-bold text-red-900 mb-2">Admin Message:</h3>
                  <p className="text-red-800">{user.guardian.rejectionReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-4">
                <p className="text-center text-gray-700 font-medium">
                  Please review the feedback and re-submit your guardian information with the required changes.
                </p>

                <Button
                  onClick={() => router.push("/profile/complete")}
                  className="w-full"
                  size="lg"
                >
                  Re-Submit Guardian Info
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Pending Notice */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⏳</div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Waiting for Guardian Approval
                </h2>
                <p className="text-gray-600 font-medium">
                  Your guardian needs to complete the consent form before you can participate in events.
                </p>
              </div>

              {/* Guardian Info */}
              {user?.guardian && (
                <div className="mb-6 p-6 rounded-2xl bg-blue-50 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3">Guardian Information:</h3>
                  <div className="space-y-2 text-blue-800">
                    <p>
                      <span className="font-medium">Name:</span> {user.guardian.firstName}{" "}
                      {user.guardian.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.guardian.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {user.guardian.phoneKey}{" "}
                      {user.guardian.phoneNumber}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {user.guardian.consentGiven ? (
                        <span className="text-green-600 font-bold">✓ Consent Submitted</span>
                      ) : (
                        <span className="text-orange-600 font-bold">
                          ⏳ Waiting for Consent
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mb-6 p-6 rounded-2xl bg-yellow-50 border-2 border-yellow-200">
                <h3 className="font-bold text-yellow-900 mb-2">What happens next?</h3>
                <ol className="list-decimal list-inside space-y-2 text-yellow-800 text-sm">
                  <li>Your parent/guardian receives a consent link via WhatsApp/Email</li>
                  <li>They fill out the consent form and upload required documents</li>
                  <li>Our admin team reviews the submission</li>
                  <li>Once approved, you'll get full access to the platform! 🎉</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Button onClick={handleRefresh} variant="secondary" className="w-full" size="lg">
                  🔄 Check Status
                </Button>

                <p className="text-center text-sm text-gray-600">
                  This usually takes 1-2 business days
                </p>
              </div>
            </>
          )}

          {/* Sign Out */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={() => {
                fetch("/api/auth/logout", { method: "POST" }).then(() => {
                  router.push("/");
                });
              }}
              variant="ghost"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}