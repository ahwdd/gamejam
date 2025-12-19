// /admin/guardians/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function GuardianDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const guardianId = params.id as string;

  const [guardian, setGuardian] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Approval form
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");

  // Rejection form
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Document viewer
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  useEffect(() => {
    fetchGuardian();
  }, [guardianId]);

  const fetchGuardian = async () => {
    try {
      const response = await fetch(`/api/admin/guardians/${guardianId}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setGuardian(data.guardian);
        
        // Fetch all students associated with this guardian
        if (data.guardian.additionalStudents && data.guardian.additionalStudents.length > 0) {
          const studentIds = [data.guardian.userId, ...data.guardian.additionalStudents];
          const studentsData = await fetchStudents(studentIds);
          setStudents(studentsData);
        } else {
          // Only one student
          setStudents([data.guardian.user]);
        }
      } else {
        setError(data.error || "Failed to load guardian");
      }
    } catch (err) {
      setError("Failed to load guardian");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (studentIds: string[]) => {
    try {
      const responses = await Promise.all(
        studentIds.map(id => 
          fetch(`/api/admin/users/${id}`, { credentials: "include" })
            .then(res => res.json())
        )
      );
      return responses.filter(r => r.success).map(r => r.user);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      return [];
    }
  };

  const handleApprove = async () => {
    if (!approvalNote.trim()) {
      alert("Please add an approval note");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/guardians/${guardianId}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ note: approvalNote }),
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("Guardian approved successfully! All associated students can now participate.");
        fetchGuardian();
        setShowApproveForm(false);
        setApprovalNote("");
      } else {
        alert(data.error || "Failed to approve guardian");
      }
    } catch (err) {
      alert("Failed to approve guardian");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      alert("Please provide a detailed rejection reason (at least 10 characters)");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/guardians/${guardianId}/reject`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("Guardian rejected. All associated students will be notified.");
        fetchGuardian();
        setShowRejectForm(false);
        setRejectionReason("");
      } else {
        alert(data.error || "Failed to reject guardian");
      }
    } catch (err) {
      alert("Failed to reject guardian");
    } finally {
      setActionLoading(false);
    }
  };

  const openDocument = (url: string) => {
    // For Cloudinary URLs, ensure we're using the correct format
    // Remove any duplicate paths and ensure proper access
    const cleanUrl = url.replace(/\/guardian-documents\/[^/]+\/guardian-documents/, '/guardian-documents');
    setViewingDoc(cleanUrl);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !guardian) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-black text-white mb-2">
          Guardian Not Found
        </h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link
          href="/admin/guardians"
          className="text-violet-400 hover:text-violet-300 font-bold"
        >
          ← Back to Guardians
        </Link>
      </div>
    );
  }

  const isPending = guardian.approvalStatus === "pending";
  const isApproved = guardian.approvalStatus === "approved";
  const isRejected = guardian.approvalStatus === "rejected";

  return (
    <div className="space-y-6">
      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-xl font-black text-white">Document Viewer</h3>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {viewingDoc.endsWith('.pdf') ? (
                <iframe
                  src={viewingDoc}
                  className="w-full h-[70vh] rounded-lg"
                  title="Document Viewer"
                />
              ) : (
                <Image src={viewingDoc} alt="Document"
                  className="w-full h-auto rounded-lg"/>
              )}
            </div>
            <div className="p-4 border-t border-slate-700 flex justify-between items-center">
              <div className="flex gap-3">
                <a
                  href={viewingDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 font-bold"
                >
                  🔗 Open in New Tab
                </a>
                <a
                  href={viewingDoc}
                  download
                  className="text-green-400 hover:text-green-300 font-bold"
                >
                  💾 Download
                </a>
              </div>
              <Button onClick={() => setViewingDoc(null)} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/guardians"
            className="text-violet-400 hover:text-violet-300 font-bold text-sm mb-2 inline-block"
          >
            ← Back to Guardians
          </Link>
          <h1 className="text-4xl font-black text-white">
            {guardian.firstName} {guardian.lastName}
          </h1>
          <p className="text-slate-400">Guardian ID: {guardian.id}</p>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-2xl p-6 border-2 ${
          isPending
            ? "bg-orange-500/10 border-orange-500"
            : isApproved
            ? "bg-green-500/10 border-green-500"
            : "bg-red-500/10 border-red-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl mb-2">
              {isPending ? "⏳" : isApproved ? "✅" : "❌"}
            </div>
            <h3 className="text-2xl font-black text-white mb-1">
              Status: {guardian.approvalStatus.toUpperCase()}
            </h3>
            {isRejected && guardian.rejectionReason && (
              <p className="text-red-400 mt-2">
                <strong>Reason:</strong> {guardian.rejectionReason}
              </p>
            )}
            {isApproved && guardian.approvedAt && (
              <p className="text-green-400 mt-2">
                Approved on {new Date(guardian.approvedAt).toLocaleString()}
              </p>
            )}
          </div>

          {isPending && (
            <div className="flex gap-2">
              <Button
                onClick={() => setShowApproveForm(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                ✅ Approve
              </Button>
              <Button
                onClick={() => setShowRejectForm(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                ❌ Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Approval Form */}
      {showApproveForm && (
        <div className="bg-green-500/10 rounded-2xl p-6 border-2 border-green-500">
          <h3 className="text-xl font-black text-white mb-4">
            Approve Guardian for {students.length} Student{students.length > 1 ? 's' : ''}
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-300 text-sm mb-2">This will approve consent for:</p>
              <ul className="list-disc list-inside text-white">
                {students.map(student => (
                  <li key={student.id}>
                    {student.firstName} {student.lastName} ({student.school || 'N/A'})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Approval Note (Optional)
              </label>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Add any notes about the approval..."
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                isLoading={actionLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                Confirm Approval
              </Button>
              <Button
                onClick={() => setShowApproveForm(false)}
                variant="outline"
                className="border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Form */}
      {showRejectForm && (
        <div className="bg-red-500/10 rounded-2xl p-6 border-2 border-red-500">
          <h3 className="text-xl font-black text-white mb-4">
            Reject Guardian
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Rejection Reason (Required - Min 10 characters) *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why the guardian consent is being rejected..."
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                rows={4}
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                This message will be shown to all associated students. Be clear and helpful.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleReject}
                isLoading={actionLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                Confirm Rejection
              </Button>
              <Button
                onClick={() => setShowRejectForm(false)}
                variant="outline"
                className="border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Associated Students */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">
          Associated Students ({students.length})
        </h2>
        <div className="space-y-4">
          {students.map((student, index) => (
            <div key={student.id} className="bg-slate-900 rounded-xl p-4 border border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-black text-white">
                    {index + 1}. {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-slate-400">ID: {student.id}</p>
                </div>
                <Link
                  href={`/admin/users/${student.id}`}
                  className="text-violet-400 hover:text-violet-300 font-bold text-sm"
                >
                  View Profile →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">School:</span>
                  <p className="text-white font-bold">{student.school || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-400">Grade:</span>
                  <p className="text-white font-bold">{student.grade || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-400">DOB:</span>
                  <p className="text-white font-bold">
                    {student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <p className={`font-bold ${
                    student.guardianApprovalStatus === 'approved' 
                      ? 'text-green-400' 
                      : student.guardianApprovalStatus === 'rejected'
                      ? 'text-red-400'
                      : 'text-orange-400'
                  }`}>
                    {student.guardianApprovalStatus || 'pending'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardian Information */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">
          Guardian Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-400">
              Full Name
            </label>
            <p className="text-white font-bold mt-1">
              {guardian.firstName} {guardian.lastName}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">
              Relationship
            </label>
            <p className="text-white font-bold mt-1">
              {guardian.relationshipToStudent}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Email</label>
            <p className="text-white font-bold mt-1">{guardian.email}</p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Phone</label>
            <p className="text-white font-bold mt-1">
              {guardian.phoneKey} {guardian.phoneNumber}
            </p>
          </div>
          {guardian.nationalID && (
            <div>
              <label className="text-sm font-bold text-slate-400">
                National ID
              </label>
              <p className="text-white font-bold mt-1">
                {guardian.nationalID}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents */}
      {(guardian.consentDocumentURL || guardian.nationalIDImageURL || guardian.signatureURL) && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-black text-white mb-6">
            Uploaded Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guardian.consentDocumentURL && (
              <button
                onClick={() => openDocument(guardian.consentDocumentURL)}
                className="p-6 rounded-xl bg-slate-900 border-2 border-slate-600 hover:border-violet-500 transition-all cursor-pointer text-left"
              >
                <div className="text-4xl mb-3">📄</div>
                <div className="text-sm font-black text-white mb-1">
                  Signed Consent Document
                </div>
                <div className="text-xs text-violet-400">
                  Click to view/download →
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Contains physical signature
                </div>
              </button>
            )}
            {guardian.nationalIDImageURL && (
              <button
                onClick={() => openDocument(guardian.nationalIDImageURL)}
                className="p-6 rounded-xl bg-slate-900 border-2 border-slate-600 hover:border-violet-500 transition-all cursor-pointer text-left"
              >
                <div className="text-4xl mb-3">🪪</div>
                <div className="text-sm font-black text-white mb-1">
                  National ID
                </div>
                <div className="text-xs text-violet-400">
                  Click to view →
                </div>
              </button>
            )}
            {guardian.signatureURL && guardian.signatureURL !== guardian.consentDocumentURL && (
              <button
                onClick={() => openDocument(guardian.signatureURL)}
                className="p-6 rounded-xl bg-slate-900 border-2 border-slate-600 hover:border-violet-500 transition-all cursor-pointer text-left"
              >
                <div className="text-4xl mb-3">✍️</div>
                <div className="text-sm font-black text-white mb-1">
                  Additional Document
                </div>
                <div className="text-xs text-violet-400">
                  Click to view →
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Consent Details */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">
          Consent Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-400">
              Consent Given
            </label>
            <p className="text-white font-bold mt-1">
              {guardian.consentGiven ? "✅ Yes" : "❌ No"}
            </p>
          </div>
          {guardian.consentDate && (
            <div>
              <label className="text-sm font-bold text-slate-400">
                Consent Date
              </label>
              <p className="text-white font-bold mt-1">
                {new Date(guardian.consentDate).toLocaleString()}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm font-bold text-slate-400">
              Will Attend Event
            </label>
            <p className="text-white font-bold mt-1">
              {guardian.willAttendEvent ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="text-2xl">📝</div>
            <div>
              <div className="text-sm font-bold text-white">
                Guardian Info Submitted
              </div>
              <div className="text-xs text-slate-400">
                {new Date(guardian.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          {guardian.consentDate && (
            <div className="flex items-start gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <div className="text-sm font-bold text-white">
                  Consent Form Completed
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(guardian.consentDate).toLocaleString()}
                </div>
              </div>
            </div>
          )}
          {guardian.approvedAt && (
            <div className="flex items-start gap-4">
              <div className="text-2xl">
                {isApproved ? "✅" : "❌"}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {isApproved ? "Approved by Admin" : "Rejected by Admin"}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(guardian.approvedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}