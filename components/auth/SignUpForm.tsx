"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CountrySelect from "@/components/auth/CountrySelect";
import { Country } from "@/lib/types/countries";

type AuthMethod = "email" | "whatsapp";
type Step = "method" | "basic-info" | "otp";

export default function SignUpForm() {
  const router = useRouter();
  const {
    sendEmailRegisterOTP,
    verifyEmailRegisterOTP,
    sendWhatsAppRegisterOTP,
    verifyWhatsAppRegisterOTP,
    loading,
    error,
    clearAuthError,
  } = useAuth();

  const [step, setStep] = useState<Step>("method");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");

  // Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneKey, setPhoneKey] = useState("+971");
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    key: "AE",
    label: "United Arab Emirates",
    arLabel: "الإمارات",
    callingCode: "+971",
    flag: "AE",
  });

  // OTP
  const [otp, setOtp] = useState("");

  const [localError, setLocalError] = useState("");

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setPhoneKey(country.callingCode);
  };

  const handleMethodSelect = (method: AuthMethod) => {
    setAuthMethod(method);
    setStep("basic-info");
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    if (!name.trim()) {
      setLocalError("Name is required");
      return;
    }

    let success = false;

    if (authMethod === "email") {
      if (!email.trim()) {
        setLocalError("Email is required");
        return;
      }
      success = await sendEmailRegisterOTP(name, email);
    } else {
      if (!phone.trim()) {
        setLocalError("Phone number is required");
        return;
      }
      success = await sendWhatsAppRegisterOTP(name, phone, phoneKey);
    }

    if (success) {
      setStep("otp");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    if (!otp.trim() || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit code");
      return;
    }

    let success = false;

    if (authMethod === "email") {
      success = await verifyEmailRegisterOTP(email, otp);
    } else {
      success = await verifyWhatsAppRegisterOTP(`${phoneKey}${phone}`, otp);
    }

    if (success) {
      router.push("/profile/complete");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Method Selection */}
      {step === "method" && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-3xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Join the Game!
            </h2>
            <p className="text-gray-600 text-lg">Choose how you want to sign up</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleMethodSelect("email")}
              className="w-full p-6 rounded-2xl border-4 border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">📧</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-blue-600">Email</h3>
                  <p className="text-sm text-gray-600">Use your email address</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMethodSelect("whatsapp")}
              className="w-full p-6 rounded-2xl border-4 border-green-200 bg-linear-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">💬</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-green-600">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Use your WhatsApp number</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Basic Info */}
      {step === "basic-info" && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👤</div>
            <h2 className="text-2xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tell us about yourself!
            </h2>
          </div>

          <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
            <Input
              label="What's your name? ✨"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              icon={<span>👋</span>}
            />

            {authMethod === "email" ? (
              <Input
                label="Your Email 📧"
                type="email"
                value={email.toLowerCase()}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="you@example.com"
                icon={<span>✉️</span>}
              />
            ) : (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your WhatsApp Number 💬
                </label>
                <div className="flex gap-2">
                  <CountrySelect
                    value={selectedCountry.key}
                    onChange={handleCountryChange}
                  />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="501234567"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {(localError || error) && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 font-medium">{localError || error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("method")}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button type="submit" isLoading={loading} className="flex-1">
                Continue →
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* OTP Verification */}
      {step === "otp" && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className="text-2xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Check your {authMethod === "email" ? "email" : "WhatsApp"}!
            </h2>
            <p className="text-gray-600">
              We sent a code to{" "}
              <span className="font-bold text-purple-600">
                {authMethod === "email" ? email : `${phoneKey} ${phone}`}
              </span>
            </p>
          </div>

          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <Input
              label="Enter the 6-digit code 🎯"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="text-center text-3xl tracking-widest font-mono"
            />

            {(localError || error) && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 font-medium">{localError || error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep("basic-info");
                  setOtp("");
                }}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                disabled={otp.length !== 6}
                className="flex-1"
              >
                Verify →
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}