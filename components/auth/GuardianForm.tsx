"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CountrySelect from "@/components/auth/CountrySelect";
import { Country } from "@/lib/types/countries";
import Select from "../ui/Select";

interface GuardianFormProps {
  onSuccess?: (consentLink?: string) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  initialData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    phoneKey?: string;
    relationshipToStudent?: string;
  };
}

export default function GuardianForm({
  onSuccess,
  onCancel,
  showCancelButton = false,
  initialData,
}: GuardianFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consentLink, setConsentLink] = useState("");
  const [showingConsentLink, setShowingConsentLink] = useState(false);
  const [copied, setCopied] = useState(false);

  const [guardianFirstName, setGuardianFirstName] = useState(initialData?.firstName || "");
  const [guardianLastName, setGuardianLastName] = useState(initialData?.lastName || "");
  const [guardianEmail, setGuardianEmail] = useState(initialData?.email || "");
  const [guardianPhone, setGuardianPhone] = useState(initialData?.phoneNumber || "");
  const [guardianPhoneKey, setGuardianPhoneKey] = useState(initialData?.phoneKey || "+971");
  const [guardianCountry, setGuardianCountry] = useState<Country>({
    key: "AE",
    label: "United Arab Emirates",
    arLabel: "الإمارات",
    callingCode: initialData?.phoneKey || "+971",
    flag: "AE",
  });
  const [relationshipToStudent, setRelationshipToStudent] = useState(
    initialData?.relationshipToStudent || ""
  );

  const handleGuardianCountryChange = (newCountry: Country) => {
    setGuardianCountry(newCountry);
    setGuardianPhoneKey(newCountry.callingCode);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !guardianFirstName ||
      !guardianLastName ||
      !guardianEmail ||
      !guardianPhone ||
      !relationshipToStudent
    ) {
      setError("All guardian fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/me/guardian-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: guardianFirstName,
          lastName: guardianLastName,
          email: guardianEmail,
          phoneNumber: guardianPhone,
          phoneKey: guardianPhoneKey,
          relationshipToStudent,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to submit guardian information");
      }

      // Store consent link if available
      if (data.data?.consentLink) {
        setConsentLink(data.data.consentLink);
        setShowingConsentLink(true);

        // Call onSuccess after a delay
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(data.data.consentLink);
          }
        }, 5000); // 5 second delay
      } else {
        // Call onSuccess immediately if no link
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit guardian information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
        <p className="text-blue-800 font-medium">
          📝 We need your parent or guardian's information to proceed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Guardian First Name 👨‍👩‍👧"
          type="text"
          value={guardianFirstName}
          onChange={(e) => setGuardianFirstName(e.target.value)}
          placeholder="Jane"
          required
        />
        <Input
          label="Guardian Last Name 👨‍👩‍👧"
          type="text"
          value={guardianLastName}
          onChange={(e) => setGuardianLastName(e.target.value)}
          placeholder="Doe"
          required
        />
      </div>

      <Input
        label="Guardian Email 📧"
        type="email"
        value={guardianEmail}
        onChange={(e) => setGuardianEmail(e.target.value)}
        placeholder="parent@example.com"
        required
      />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Guardian WhatsApp Number 💬
        </label>
        <div className="flex gap-2">
          <CountrySelect
            value={guardianCountry.key}
            onChange={handleGuardianCountryChange}
          />
          <Input
            type="tel"
            value={guardianPhone}
            onChange={(e) => setGuardianPhone(e.target.value)}
            placeholder="501234567"
            className="flex-1"
            required
          />
        </div>
      </div>

      <Select
        label="Relationship to You 👨‍👩‍👧"
        value={relationshipToStudent}
        onChange={(e) => setRelationshipToStudent(e.target.value)}
        placeholder="Select relationship"
        required
        options={[
          { value: "mother", label: "Mother" },
          { value: "father", label: "Father" },
          { value: "guardian", label: "Guardian" },
          { value: "other", label: "Other" },
        ]}
      />


      <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
        <p className="text-yellow-800 text-sm font-medium">
          ⚡ We'll send a consent form to your parent/guardian via WhatsApp and email.
          They'll need to fill it out before you can participate in events!
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {consentLink && (
        <div className="p-6 rounded-xl bg-green-50 border-4 border-green-400 shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-4xl">✅</span>
            <div className="flex-1">
              <p className="text-green-800 font-black text-xl mb-1">
                Guardian Info Submitted!
              </p>
              <p className="text-green-700 text-sm font-medium">
                {showingConsentLink
                  ? "Redirecting in 5 seconds... Copy the link below for testing:"
                  : "Consent link generated successfully!"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-green-300">
            <p className="text-green-700 text-xs font-bold mb-2">
              🔗 Consent Link (Dev Mode):
            </p>
            <div className="flex gap-2 items-start">
              <p className="text-green-600 text-xs break-all flex-1 font-mono bg-green-50 p-2 rounded">
                {consentLink}
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => copyToClipboard(consentLink)}
                className="shrink-0"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </Button>
            </div>
          </div>

          {showingConsentLink && onSuccess && (
            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSuccess(consentLink)}
              >
                Skip Wait →
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {showCancelButton && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={showingConsentLink}
          >
            ← Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={loading}
          className={showCancelButton ? "flex-1" : "w-full"}
          size="lg"
          disabled={showingConsentLink}
        >
          {showingConsentLink ? "✓ Submitted" : "Submit Guardian Info →"}
        </Button>
      </div>
    </form>
  );
}