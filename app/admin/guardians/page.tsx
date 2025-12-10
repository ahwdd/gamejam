"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchGuardians();
  }, [search, statusFilter, pagination.page]);

  const fetchGuardians = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append("search", search);
      if (statusFilter !== "all")
        params.append("approvalStatus", statusFilter);

      const response = await fetch(`/api/admin/guardians?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setGuardians(data.data.guardians);
        setPagination((prev) => ({ ...prev, ...data.data.pagination }));
      }
    } catch (error) {
      console.error("Failed to fetch guardians:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      approved: "bg-green-500/20 text-green-400 border-green-500/50",
      rejected: "bg-red-500/20 text-red-400 border-red-500/50",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusEmoji = (status: string) => {
    const emojis = {
      pending: "⏳",
      approved: "✅",
      rejected: "❌",
    };
    return emojis[status as keyof typeof emojis] || "⏳";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">
          Guardian Management
        </h1>
        <p className="text-slate-400">
          Review and approve guardian consent forms
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Guardian or student name..."
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Approval Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-end">
            <div className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600">
              <div className="text-xs text-slate-400">Total Results</div>
              <div className="text-2xl font-black text-white">
                {pagination.total}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={fetchGuardians}
            className="text-violet-400 hover:text-violet-300 font-bold text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setStatusFilter("pending")}
          className="bg-slate-800 rounded-xl p-4 border border-orange-500/50 hover:bg-slate-700 transition-colors text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⏳</span>
            <span className="text-2xl font-black text-orange-400">
              {
                guardians.filter((g) => g.approvalStatus === "pending")
                  .length
              }
            </span>
          </div>
          <div className="text-sm font-bold text-slate-300">
            Pending Review
          </div>
        </button>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">✅</span>
            <span className="text-2xl font-black text-green-400">
              {
                guardians.filter((g) => g.approvalStatus === "approved")
                  .length
              }
            </span>
          </div>
          <div className="text-sm font-bold text-slate-300">Approved</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">❌</span>
            <span className="text-2xl font-black text-red-400">
              {
                guardians.filter((g) => g.approvalStatus === "rejected")
                  .length
              }
            </span>
          </div>
          <div className="text-sm font-bold text-slate-300">Rejected</div>
        </div>
      </div>

      {/* Guardians Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
          </div>
        ) : guardians.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍👩‍👧</div>
            <p className="text-slate-500 font-medium">No guardians found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Guardian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {guardians.map((guardian) => (
                  <tr
                    key={guardian.id}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">
                        {guardian.firstName} {guardian.lastName}
                      </div>
                      <div className="text-sm text-slate-400">
                        {guardian.relationshipToStudent}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">
                        {guardian.user.firstName} {guardian.user.lastName}
                      </div>
                      <div className="text-sm text-slate-400">
                        {guardian.user.school || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        {guardian.email}
                      </div>
                      <div className="text-sm text-slate-400">
                        {guardian.phoneKey} {guardian.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        {new Date(guardian.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {guardian.consentGiven ? "✅ Consent" : "⏳ Pending"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(
                          guardian.approvalStatus
                        )}`}
                      >
                        {getStatusEmoji(guardian.approvalStatus)}{" "}
                        {guardian.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/guardians/${guardian.id}`}
                        className={`font-bold text-sm ${
                          guardian.approvalStatus === "pending"
                            ? "text-orange-400 hover:text-orange-300"
                            : "text-violet-400 hover:text-violet-300"
                        }`}
                      >
                        {guardian.approvalStatus === "pending"
                          ? "Review →"
                          : "View Details →"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            ← Previous
          </button>
          <span className="text-slate-300 font-bold">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}