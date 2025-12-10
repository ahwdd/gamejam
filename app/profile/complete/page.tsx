"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CountrySelect from "@/components/auth/CountrySelect";
import GuardianForm from "@/components/auth/GuardianForm";
import { Country } from "@/lib/types/countries";
import { calculateAge } from "@/lib/utils/age";

export default function ProfileCompletePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"profile" | "guardian">("profile");

  // Profile data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState<Country>({
    key: "AE",
    label: "United Arab Emirates",
    arLabel: "الإمارات",
    callingCode: "+971",
    flag: "AE",
  });

  useEffect(() => {
    if (user && !authLoading) {
      // Pre-fill existing data
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setDateOfBirth(user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "");
      setSchool(user.school || "");
      setGrade(user.grade || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      
      // Check if user needs to complete guardian info
      if (user.profileComplete && user.isMinor && !user.guardianApprovalStatus) {
        setStep("guardian");
      } else if (user.profileComplete && user.isMinor && user.guardianApprovalStatus === "rejected") {
        setStep("guardian");
      } else if (user.profileComplete && (!user.isMinor || user.guardianApprovalStatus === "approved")) {
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  const handleCountryChange = (newCountry: Country) => {
    setCountry(newCountry);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !dateOfBirth || !school || !grade || !address || !city) {
      setError("All fields are required");
      return;
    }

    // Validate age
    const age = calculateAge(dateOfBirth);
    if (age < 7 || age > 18) {
      setError("You must be between 7 and 18 years old to participate");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/me/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          school,
          grade,
          address,
          city,
          country: country.key,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      await refreshUser();

      // Check if minor
      if (data.user.isMinor) {
        setStep("guardian");
      } else {
        // Adult - redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardianSuccess = (consentLink?: string) => {
    refreshUser();
    router.push("/dashboard");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-100 via-pink-100 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-700 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

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
            {step === "profile" ? "🎮 Complete Your Profile" : "👨‍👩‍👧 Guardian Information"}
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            {step === "profile"
              ? "Tell us about yourself to get started!"
              : "We need your parent/guardian's information"}
          </p>
        </div>

        {/* Profile Form */}
        {step === "profile" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name 👤"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last Name 👤"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>

              <Input
                label="Date of Birth 🎂"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />

              <Input
                label="School Name 🏫"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Your school name"
                required
              />

              <Input
                label="Grade/Class 📚"
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g., Grade 7"
                required
              />

              <Input
                label="Address 🏠"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City 🏙️"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dubai"
                  required
                />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Country 🌍
                  </label>
                  <CountrySelect
                    value={country.key}
                    onChange={handleCountryChange}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              <Button type="submit" isLoading={loading} className="w-full" size="lg">
                Continue →
              </Button>
            </form>
          </div>
        )}

        {/* Guardian Form */}
        {step === "guardian" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
            <GuardianForm
              onSuccess={handleGuardianSuccess}
              onCancel={() => setStep("profile")}
              showCancelButton={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}