"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [profileFilter, setProfileFilter] = useState<string>("all");
  const [minorFilter, setMinorFilter] = useState<string>("all");
  const [guardianFilter, setGuardianFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [search, profileFilter, minorFilter, guardianFilter, pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append("search", search);
      if (profileFilter !== "all")
        params.append("profileComplete", profileFilter);
      if (minorFilter !== "all") params.append("isMinor", minorFilter);
      if (guardianFilter !== "all")
        params.append("guardianStatus", guardianFilter);

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setPagination((prev) => ({ ...prev, ...data.data.pagination }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Users Management</h1>
        <p className="text-slate-400">View and manage all user accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Name, email, phone..."
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Profile Status
            </label>
            <select
              value={profileFilter}
              onChange={(e) => setProfileFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
            >
              <option value="all">All</option>
              <option value="true">Complete</option>
              <option value="false">Incomplete</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Account Type
            </label>
            <select
              value={minorFilter}
              onChange={(e) => setMinorFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
            >
              <option value="all">All</option>
              <option value="true">Minors</option>
              <option value="false">Adults</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Guardian Status
            </label>
            <select
              value={guardianFilter}
              onChange={(e) => setGuardianFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>
            Showing {users.length} of {pagination.total} users
          </span>
          <button
            onClick={fetchUsers}
            className="text-violet-400 hover:text-violet-300 font-bold"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    School
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                    Type
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-slate-400">
                        ID: {user.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        {user.email || "No email"}
                      </div>
                      <div className="text-sm text-slate-400">
                        {user.phoneNumber
                          ? `${user.phoneKey} ${user.phoneNumber}`
                          : "No phone"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        {user.school || "N/A"}
                      </div>
                      <div className="text-sm text-slate-400">
                        {user.grade || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                          user.isMinor
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {user.isMinor ? "Minor" : "Adult"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            user.profileComplete
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {user.profileComplete ? "Complete" : "Incomplete"}
                        </span>
                        {user.isMinor && user.guardianApprovalStatus && (
                          <div>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                user.guardianApprovalStatus === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : user.guardianApprovalStatus === "rejected"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-orange-500/20 text-orange-400"
                              }`}
                            >
                              G: {user.guardianApprovalStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-violet-400 hover:text-violet-300 font-bold text-sm"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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