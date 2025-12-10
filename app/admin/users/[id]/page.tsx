"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || "Failed to load user");
      }
    } catch (err) {
      setError("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        alert("User deactivated successfully");
        fetchUser();
      } else {
        alert(data.error || "Failed to deactivate user");
      }
    } catch (err) {
      alert("Failed to deactivate user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-black text-white mb-2">User Not Found</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link
          href="/admin/users"
          className="text-violet-400 hover:text-violet-300 font-bold"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/users"
            className="text-violet-400 hover:text-violet-300 font-bold text-sm mb-2 inline-block"
          >
            ← Back to Users
          </Link>
          <h1 className="text-4xl font-black text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-slate-400">User ID: {user.id}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/users/${userId}/edit`)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            ✏️ Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeactivate}
            className="border-red-500 text-red-400 hover:bg-red-500/20"
            disabled={!user.isActive}
          >
            🚫 Deactivate
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Profile Status</div>
          <div
            className={`text-xl font-black ${
              user.profileComplete ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {user.profileComplete ? "✅ Complete" : "⏳ Incomplete"}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Account Type</div>
          <div
            className={`text-xl font-black ${
              user.isMinor ? "text-blue-400" : "text-green-400"
            }`}
          >
            {user.isMinor ? "👨‍👩‍👧 Minor" : "🎓 Adult"}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Account Status</div>
          <div
            className={`text-xl font-black ${
              user.isActive ? "text-green-400" : "text-red-400"
            }`}
          >
            {user.isActive ? "✅ Active" : "❌ Inactive"}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-400">
              First Name
            </label>
            <p className="text-white font-bold mt-1">{user.firstName}</p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">
              Last Name
            </label>
            <p className="text-white font-bold mt-1">{user.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Email</label>
            <p className="text-white font-bold mt-1">
              {user.email || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Phone</label>
            <p className="text-white font-bold mt-1">
              {user.phoneNumber
                ? `${user.phoneKey} ${user.phoneNumber}`
                : "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">
              Date of Birth
            </label>
            <p className="text-white font-bold mt-1">
              {user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Language</label>
            <p className="text-white font-bold mt-1">
              {user.preferredLanguage === "en" ? "English" : "Arabic"}
            </p>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">
          School Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-400">School</label>
            <p className="text-white font-bold mt-1">
              {user.school || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Grade</label>
            <p className="text-white font-bold mt-1">
              {user.grade || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">
          Address Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-400">Address</label>
            <p className="text-white font-bold mt-1">
              {user.address || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">City</label>
            <p className="text-white font-bold mt-1">
              {user.city || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">Country</label>
            <p className="text-white font-bold mt-1">
              {user.country || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Guardian Information */}
      {user.guardian && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-violet-500/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">
              Guardian Information
            </h2>
            <Link
              href={`/admin/guardians/${user.guardian.id}`}
              className="text-violet-400 hover:text-violet-300 font-bold text-sm"
            >
              View Guardian Details →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-400">Name</label>
              <p className="text-white font-bold mt-1">
                {user.guardian.firstName} {user.guardian.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400">Email</label>
              <p className="text-white font-bold mt-1">
                {user.guardian.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400">Phone</label>
              <p className="text-white font-bold mt-1">
                {user.guardian.phoneKey} {user.guardian.phoneNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400">Status</label>
              <p className="mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                    user.guardian.approvalStatus === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : user.guardian.approvalStatus === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  {user.guardian.approvalStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Information */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-6">
          Activity Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-400">
              Registered
            </label>
            <p className="text-white font-bold mt-1">
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400">
              Last Updated
            </label>
            <p className="text-white font-bold mt-1">
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}