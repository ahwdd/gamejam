"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CountrySelect from "@/components/auth/CountrySelect";
import { Country } from "@/lib/types/countries";

type AuthMethod = "email" | "whatsapp";
type Step = "method" | "basic-info" | "otp" | "student-details" | "guardian-info";

interface StudentDetails {
  dateOfBirth: string;
  school: string;
  grade: string;
  address: string;
  city: string;
  country: string;
}

interface GuardianInfo {
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianPhoneKey: string;
  relationshipToStudent: string;
}

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

  const [otp, setOtp] = useState("");

  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    dateOfBirth: "",
    school: "",
    grade: "",
    address: "",
    city: "",
    country: "AE",
  });

  const [needsGuardian, setNeedsGuardian] = useState(false);
  const [guardianInfo, setGuardianInfo] = useState<GuardianInfo>({
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianPhoneKey: "+971",
    relationshipToStudent: "",
  });
  const [guardianCountry, setGuardianCountry] = useState<Country>({
    key: "AE",
    label: "United Arab Emirates",
    arLabel: "الإمارات",
    callingCode: "+971",
    flag: "AE",
  });

  const [localError, setLocalError] = useState("");

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setPhoneKey(country.callingCode);
  };

  const handleGuardianCountryChange = (country: Country) => {
    setGuardianCountry(country);
    setGuardianInfo({ ...guardianInfo, guardianPhoneKey: country.callingCode });
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
      setStep("student-details");
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleStudentDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!studentDetails.dateOfBirth) {
      setLocalError("Date of birth is required");
      return;
    }

    const age = calculateAge(studentDetails.dateOfBirth);
    if (age < 7 || age > 18) {
      setLocalError("You must be between 7 and 18 years old to participate");
      return;
    }

    if (!studentDetails.school || !studentDetails.grade) {
      setLocalError("School and grade are required");
      return;
    }

    if (!studentDetails.address || !studentDetails.city) {
      setLocalError("Complete address is required");
      return;
    }

    // Check if guardian is needed (under 18)
    if (age < 18) {
      setNeedsGuardian(true);
      setStep("guardian-info");
    } else {
      // Complete registration for 18 year olds
      handleCompleteRegistration();
    }
  };

  const handleGuardianInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!guardianInfo.guardianName || !guardianInfo.guardianEmail || !guardianInfo.guardianPhone) {
      setLocalError("All guardian information is required");
      return;
    }

    if (!guardianInfo.relationshipToStudent) {
      setLocalError("Relationship to student is required");
      return;
    }

    // TODO: Send guardian consent link via WhatsApp/Email
    await handleCompleteRegistration();
  };

  const handleCompleteRegistration = async () => {
    // TODO: Update user profile with additional details
    // For now, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {["Method", "Info", "Verify", "Details", needsGuardian ? "Guardian" : null]
            .filter(Boolean)
            .map((label, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    index <= ["method", "basic-info", "otp", "student-details", "guardian-info"].indexOf(step)
                      ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-gray-200 text-gray-500"}`}>
                  {index + 1}
                </div>
                {index < (needsGuardian ? 4 : 3) && (
                  <div className={`w-12 h-1 ${
                      index < ["method", "basic-info", "otp", "student-details", "guardian-info"].indexOf(step)
                        ? "bg-linear-to-r from-purple-500 to-pink-500"
                        : "bg-gray-200"}`}/>
                )}
              </div>
            ))}
        </div>
      </div>

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
            <button onClick={() => handleMethodSelect("email")}
              className="w-full p-6 rounded-2xl border-4 border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 
              hover:from-blue-100 hover:to-cyan-100 transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📧</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-blue-600">Email</h3>
                  <p className="text-sm text-gray-600">Use your email address</p>
                </div>
              </div>
            </button>

            <button onClick={() => handleMethodSelect("whatsapp")}
              className="w-full p-6 rounded-2xl border-4 border-green-200 bg-linear-to-r from-green-50 to-emerald-50 
              hover:from-green-100 hover:to-emerald-100 transition-all hover:scale-105 hover:shadow-xl">
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
            <Input label="What's your name? ✨" type="text"
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              icon={<span>👋</span>}/>

            {authMethod === "email" ? (
              <Input label="Your Email 📧" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<span>✉️</span>}/>
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
                  <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="501234567" className="flex-1"/>
                </div>
              </div>
            )}

            {(localError || error) && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 font-medium">{localError || error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline"
                onClick={() => setStep("method")}
                className="flex-1">
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
            <Input label="Enter the 6-digit code 🎯" type="text"
              value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000" maxLength={6}
              className="text-center text-3xl tracking-widest font-mono"/>

            {(localError || error) && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 font-medium">{localError || error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline"
                onClick={() => {
                  setStep("basic-info");
                  setOtp("");
                }}
                className="flex-1">
                ← Back
              </Button>
              <Button type="submit" isLoading={loading} disabled={otp.length !== 6}
                className="flex-1">
                Verify →
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Student Details */}
      {step === "student-details" && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎓</div>
            <h2 className="text-2xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              More about you!
            </h2>
          </div>

          <form onSubmit={handleStudentDetailsSubmit} className="space-y-4">
            <Input label="When's your birthday? 🎂" type="date"
              value={studentDetails.dateOfBirth}
              onChange={(e) =>
                setStudentDetails({ ...studentDetails, dateOfBirth: e.target.value }) }
              max={new Date().toISOString().split("T")[0]}/>

            <Input label="Your School 🏫" type="text"
              value={studentDetails.school}
              onChange={(e) =>
                setStudentDetails({ ...studentDetails, school: e.target.value }) }
              placeholder="Enter your school name"/>

            <Input label="Your Grade 📚" type="text"
              value={studentDetails.grade}
              onChange={(e) =>
                setStudentDetails({ ...studentDetails, grade: e.target.value }) }
              placeholder="e.g., Grade 7"/>

            <Input label="Your Address 🏠" type="text"
              value={studentDetails.address}
              onChange={(e) =>
                setStudentDetails({ ...studentDetails, address: e.target.value }) }
              placeholder="Street address"/>

            <Input label="City 🏙️" type="text"
              value={studentDetails.city}
              onChange={(e) =>
                setStudentDetails({ ...studentDetails, city: e.target.value }) }
              placeholder="Your city"/>

            {localError && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 font-medium">{localError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              Continue →
            </Button>
          </form>
        </div>
      )}

      {/* Guardian Info */}
      {step === "guardian-info" && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👨‍👩‍👧‍👦</div>
            <h2 className="text-2xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Parent/Guardian Info
            </h2>
            <p className="text-gray-600">We need permission from your parent or guardian</p>
          </div>

          <form onSubmit={handleGuardianInfoSubmit} className="space-y-4">
            <Input label="Parent/Guardian Name 👤" type="text"
              value={guardianInfo.guardianName}
              onChange={(e) =>
                setGuardianInfo({ ...guardianInfo, guardianName: e.target.value }) }
              placeholder="Full name" />

            <Input label="Parent/Guardian Email 📧" type="email"
              value={guardianInfo.guardianEmail}
              onChange={(e) =>
                setGuardianInfo({ ...guardianInfo, guardianEmail: e.target.value }) }
              placeholder="parent@example.com"/>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Parent/Guardian WhatsApp 💬
              </label>
              <div className="flex gap-2">
                <CountrySelect
                  value={guardianCountry.key}
                  onChange={handleGuardianCountryChange}
                />
                <Input type="tel"
                  value={guardianInfo.guardianPhone}
                  onChange={(e) =>
                    setGuardianInfo({ ...guardianInfo, guardianPhone: e.target.value }) }
                  placeholder="501234567"
                  className="flex-1"/>
              </div>
            </div>

            <Input label="Relationship 👨‍👩‍👧" type="text"
              value={guardianInfo.relationshipToStudent}
              onChange={(e) =>
                setGuardianInfo({
                  ...guardianInfo,
                  relationshipToStudent: e.target.value,
                }) }
              placeholder="e.g., Mother, Father, Guardian"/>

            <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
              <p className="text-sm text-blue-800">
                📱 We'll send a consent form to your parent/guardian's WhatsApp. They need
                to fill it out and approve before you can join!
              </p>
            </div>

            {localError && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 font-medium">{localError}</p>
              </div>
            )}

            <Button type="submit" isLoading={loading} className="w-full" size="lg">
              Send Consent Form 🚀
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}