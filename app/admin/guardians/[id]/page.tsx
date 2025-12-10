"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function GuardianDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const guardianId = params.id as string;

  const [guardian, setGuardian] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Approval form
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");

  // Rejection form
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

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
      } else {
        setError(data.error || "Failed to load guardian");
      }
    } catch (err) {
      setError("Failed to load guardian");
    } finally {
      setLoading(false);
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
        alert("Guardian approved successfully!");
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
        alert("Guardian rejected. User will be notified.");
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
            Approve Guardian
          </h3>
          <div className="space-y-4">
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
                This message will be shown to the user. Be clear and helpful.
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

      {/* Student Information */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">
            Student Information
          </h2>
          <Link
            href={`/admin/users/${guardian.user.id}`}
            className="text-violet-400 hover:text-violet-300 font-bold text-sm"
          >
            View User Profile →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-400">Name</label>
            <p className="text-white font-bold mt-1">
              {guardian.user.firstName} {guardian.user.lastName}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">School</label>
            <p className="text-white font-bold mt-1">
              {guardian.user.school || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Grade</label>
            <p className="text-white font-bold mt-1">
              {guardian.user.grade || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">
              Date of Birth
            </label>
            <p className="text-white font-bold mt-1">
              {guardian.user.dateOfBirth
                ? new Date(guardian.user.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
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

      {/* Consent Information */}
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

        {/* Documents */}
        {(guardian.consentDocumentURL || guardian.nationalIDImageURL || guardian.signatureURL) && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-black text-white mb-4">
              Uploaded Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {guardian.consentDocumentURL && (
                <a
                  href={guardian.consentDocumentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-900 border border-slate-600 hover:border-violet-500 transition-colors"
                >
                  <div className="text-3xl mb-2">📄</div>
                  <div className="text-sm font-bold text-white">
                    Consent Document
                  </div>
                  <div className="text-xs text-violet-400 mt-1">
                    View →
                  </div>
                </a>
              )}
              {guardian.nationalIDImageURL && (
                <a
                  href={guardian.nationalIDImageURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-900 border border-slate-600 hover:border-violet-500 transition-colors"
                >
                  <div className="text-3xl mb-2">🪪</div>
                  <div className="text-sm font-bold text-white">
                    National ID
                  </div>
                  <div className="text-xs text-violet-400 mt-1">
                    View →
                  </div>
                </a>
              )}
              {guardian.signatureURL && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-600">
                  <div className="text-3xl mb-2">✍️</div>
                  <div className="text-sm font-bold text-white mb-2">
                    Digital Signature
                  </div>
                  <img
                    src={guardian.signatureURL}
                    alt="Guardian signature"
                    className="w-full h-16 object-contain bg-white rounded"
                  />
                </div>
              )}
            </div>
          </div>
        )}
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