"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

  // Form fields
  const [nationalID, setNationalID] = useState("");
  const [willAttend, setWillAttend] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  // File uploads
  const [consentDoc, setConsentDoc] = useState<File | null>(null);
  const [nationalIDImage, setNationalIDImage] = useState<File | null>(null);

  // Signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState("");

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

    // parse JSON even if response not ok to get server message
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


  // Signature canvas functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData("");
    }
  };

  const handleFileUpload = async (file: File, fileType: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("guardianId", guardian.id);
      formData.append("fileType", fileType);

      const response = await fetch("/api/guardian/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.fileUrl;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!consentGiven) {
      setError("You must give consent to proceed");
      return;
    }

    if (!signatureData) {
      setError("Please provide your signature");
      return;
    }

    setSubmitting(true);

    try {
      let consentDocUrl = "";
      let nationalIDImageUrl = "";

      if (consentDoc) {
        consentDocUrl = await handleFileUpload(consentDoc, "consent");
      }

      if (nationalIDImage) {
        nationalIDImageUrl = await handleFileUpload(nationalIDImage, "nationalID");
      }

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
          signature: signatureData,
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

        {/* Student Info */}
        {student && (
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
            <h2 className="text-xl font-black text-gray-900 mb-4">Student Information:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-bold">Name:</span> {student.firstName} {student.lastName}
              </div>
              <div>
                <span className="font-bold">Email:</span> {student.email || "N/A"}
              </div>
              <div>
                <span className="font-bold">Phone:</span>{" "}
                {student.phoneKey} {student.phoneNumber || "N/A"}
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

        {/* Consent Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Consent Statement */}
            <div className="p-6 rounded-2xl bg-purple-50 border-2 border-purple-200">
              <h3 className="font-black text-purple-900 mb-3">Parental Consent Statement</h3>
              <p className="text-purple-800 text-sm leading-relaxed">
                I, {guardian?.firstName} {guardian?.lastName}, give permission for my child,{" "}
                {student?.firstName} {student?.lastName}, to participate in the Student Hub Game Jam event.
                I understand that this event involves game development activities and may include
                working in teams, using computers, and presenting projects.
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
                  Upload Consent Document (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setConsentDoc(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">PDF or Image (max 5MB)</p>
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

            {/* Signature */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Digital Signature *
              </label>
              <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full cursor-crosshair bg-white"
                  style={{ touchAction: "none" }}
                />
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Clear Signature
              </button>
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

            <Button type="submit" isLoading={submitting} className="w-full" size="lg">
              Submit Consent Form
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}