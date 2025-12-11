"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { uploadGuardianDocument } from "@/utils/uploadGuardianDocs";
import { generateConsentFormPDF, ConsentFormData } from "@/utils/generateConsentPDF";

export default function GuardianConsentPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [guardian, setGuardian] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);

  // Step tracking
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<'download' | 'upload'>('download');

  // Form fields
  const [nationalID, setNationalID] = useState("");
  const [willAttend, setWillAttend] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  // File uploads
  const [consentDoc, setConsentDoc] = useState<File | null>(null);
  const [nationalIDImage, setNationalIDImage] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    fetchConsentForm();
  }, [token]);

  const fetchConsentForm = async () => {
    if (!token) {
      setError("Invalid consent link (missing token).");
      setLoading(false);
      return;
    }

    console.log("[client] fetching consent form for token:", token);

    try {
      const encoded = encodeURIComponent(token);
      const response = await fetch(`/api/guardian/consent/${encoded}`, {
        headers: { Accept: "application/json" },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const serverMsg = data?.error || data?.message || response.statusText;
        throw new Error(serverMsg || "Invalid consent link");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Invalid or expired consent link");
      }

      setGuardian(data.guardian);
      setStudent(data.student);
    } catch (err) {
      console.error("[client] fetchConsentForm error:", err);
      setError(err instanceof Error ? err.message : "Failed to load consent form");
    } finally {
      setLoading(false);
    }
  };

  // Download PDF consent form
  const handleDownloadPDF = () => {
    if (!guardian || !student) return;

    const formData: ConsentFormData = {
      guardianName: `${guardian.firstName} ${guardian.lastName}`,
      studentName: `${student.firstName} ${student.lastName}`,
      studentSchool: student.school || "N/A",
      studentGrade: student.grade || "N/A",
      guardianEmail: guardian.email,
      guardianPhone: `${guardian.phoneKey} ${guardian.phoneNumber}`,
      relationshipToStudent: guardian.relationshipToStudent,
    };

    generateConsentFormPDF(formData);
    
    // Mark as downloaded and move to next step
    setPdfDownloaded(true);
    setTimeout(() => {
      setCurrentStep('upload');
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!consentGiven) {
      setError("You must give consent to proceed");
      return;
    }

    if (!consentDoc) {
      setError("Please upload the signed consent form");
      return;
    }

    setSubmitting(true);
    setUploadingFiles(true);

    try {
      let consentDocUrl = "";
      let nationalIDImageUrl = "";

      // Upload consent document
      if (consentDoc) {
        const result = await uploadGuardianDocument(consentDoc, guardian.id, 'consent');
        if (result.error) {
          throw new Error(`Failed to upload consent document: ${result.error}`);
        }
        consentDocUrl = result.secure_url;
      }

      // Upload national ID image (optional)
      if (nationalIDImage) {
        const result = await uploadGuardianDocument(nationalIDImage, guardian.id, 'nationalID');
        if (result.error) {
          throw new Error(`Failed to upload ID image: ${result.error}`);
        }
        nationalIDImageUrl = result.secure_url;
      }

      setUploadingFiles(false);

      // Submit to backend
      const encoded = encodeURIComponent(token);
      const response = await fetch(`/api/guardian/consent/${encoded}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nationalID,
          willAttendEvent: willAttend,
          consentGiven,
          signature: consentDocUrl, // Use consent doc URL as signature proof
          consentDocumentURL: consentDocUrl,
          nationalIDImageURL: nationalIDImageUrl,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const serverMsg = data?.error || data?.message || response.statusText;
        throw new Error(serverMsg || "Failed to submit consent");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to submit consent");
      }

      setSuccess(true);
    } catch (err) {
      console.error("[client] handleSubmit error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit consent");
    } finally {
      setSubmitting(false);
      setUploadingFiles(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-100 via-pink-100 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-700 font-bold">Loading consent form...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 via-blue-100 to-purple-100 px-4">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your consent has been submitted successfully. Our admin team will review it shortly.
          </p>
          <p className="text-gray-600">
            You and your child will receive an email/WhatsApp notification once the review is complete.
          </p>
        </div>
      </div>
    );
  }

  if (error && !guardian) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-100 via-pink-100 to-purple-100 px-4">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-red-200 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-lg text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (guardian?.approvalStatus === "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 via-blue-100 to-purple-100 px-4">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-200 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Already Approved</h1>
          <p className="text-lg text-gray-700">
            This consent has already been approved by our admin team.
          </p>
        </div>
      </div>
    );
  }

  if (guardian?.approvalStatus === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-100 via-yellow-100 to-red-100 px-4">
        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-orange-200 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Consent Rejected</h1>
          {guardian.rejectionReason && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-left">
              <p className="font-bold text-red-900 mb-2">Admin Feedback:</p>
              <p className="text-red-800">{guardian.rejectionReason}</p>
            </div>
          )}
          <p className="text-lg text-gray-700">
            Please contact the student to re-submit the guardian information with the required corrections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-100 to-blue-100 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📝 Guardian Consent Form
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Student Hub Game Jam Participation
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${currentStep === 'download' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              pdfDownloaded ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'
            }`}>
              {pdfDownloaded ? '✓' : '1'}
            </div>
            <span className="font-bold text-gray-700">Download</span>
          </div>
          
          <div className="w-12 h-1 bg-gray-300 rounded"></div>
          
          <div className={`flex items-center gap-2 ${currentStep === 'upload' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep === 'upload' ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <span className="font-bold text-gray-700">Upload</span>
          </div>
        </div>

        {/* Student Info */}
        {student && (
          <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
            <h2 className="text-xl font-black text-gray-900 mb-4">Student Information:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-bold">Name:</span> {student.firstName} {student.lastName}
              </div>
              <div>
                <span className="font-bold">School:</span> {student.school}
              </div>
              <div>
                <span className="font-bold">Grade:</span> {student.grade}
              </div>
              <div>
                <span className="font-bold">City:</span> {student.city}, {student.country}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Download PDF */}
        {currentStep === 'download' && (
          <div className="mb-6 bg-yellow-50 rounded-2xl shadow-xl p-6 border-4 border-yellow-300">
            <div className="flex items-start gap-4">
              <span className="text-4xl">📄</span>
              <div className="flex-1">
                <h3 className="font-black text-yellow-900 mb-2">Step 1: Download & Sign Consent Form</h3>
                <p className="text-yellow-800 text-sm mb-4">
                  Download the consent form, print it, and sign it physically. Then proceed to the next step to upload it.
                </p>
                <Button 
                  onClick={handleDownloadPDF} 
                  variant="secondary" 
                  size="lg"
                  disabled={pdfDownloaded}
                >
                  {pdfDownloaded ? '✓ Downloaded' : '📥 Download Consent Form PDF'}
                </Button>
                
                {pdfDownloaded && (
                  <div className="mt-4 p-3 bg-green-100 border-2 border-green-400 rounded-lg">
                    <p className="text-green-800 font-bold text-sm">
                      ✓ Form downloaded! Please print, sign it, and proceed to Step 2.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload Form */}
        {currentStep === 'upload' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">
              Step 2: Upload Signed Consent Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Consent Statement */}
              <div className="p-6 rounded-2xl bg-purple-50 border-2 border-purple-200">
                <h3 className="font-black text-purple-900 mb-3">Parental Consent Statement</h3>
                <p className="text-purple-800 text-sm leading-relaxed">
                  I, {guardian?.firstName} {guardian?.lastName}, give permission for my child,{" "}
                  {student?.firstName} {student?.lastName}, to participate in the Student Hub Game Jam event.
                </p>
              </div>

              {/* National ID */}
              <Input
                label="National ID Number (Optional)"
                type="text"
                value={nationalID}
                onChange={(e) => setNationalID(e.target.value)}
                placeholder="Enter national ID"
              />

              {/* File Uploads */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Upload Signed Consent Form * (Required)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setConsentDoc(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PDF or Image of the signed consent form (max 5MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Upload National ID Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => setNationalIDImage(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Image only (max 5MB)</p>
                </div>
              </div>

              {/* Will Attend */}
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={willAttend}
                  onChange={(e) => setWillAttend(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I plan to attend the event with my child
                </span>
              </label>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-purple-300 bg-purple-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1"
                  required
                />
                <span className="text-sm font-bold text-purple-900">
                  I consent to my child's participation in the Student Hub Game Jam event *
                </span>
              </label>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              {uploadingFiles && (
                <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                  <p className="text-blue-800 font-medium">📤 Uploading documents...</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('download')}
                  className="flex-1"
                  disabled={uploadingFiles || submitting}
                >
                  ← Back to Download
                </Button>
                <Button 
                  type="submit" 
                  isLoading={submitting} 
                  className="flex-1" 
                  size="lg"
                  disabled={uploadingFiles}
                >
                  {uploadingFiles ? "Uploading..." : "Submit Consent Form"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}