"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingGuardians: 0,
    minors: 0,
    adults: 0,
    activeUsers: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingGuardians, setPendingGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch("/api/admin/users?limit=5", {
        credentials: "include",
      });
      const usersData = await usersResponse.json();

      if (usersData.success) {
        setRecentUsers(usersData.data.users);
      }

      // Fetch all users for stats
      const allUsersResponse = await fetch("/api/admin/users?limit=1000", {
        credentials: "include",
      });
      const allUsersData = await allUsersResponse.json();

      if (allUsersData.success) {
        const users = allUsersData.data.users;
        setStats({
          totalUsers: users.length,
          minors: users.filter((u: any) => u.isMinor).length,
          adults: users.filter((u: any) => !u.isMinor).length,
          activeUsers: users.filter((u: any) => u.isActive).length,
          pendingGuardians: 0, // Will update below
        });
      }

      // Fetch pending guardians
      const guardiansResponse = await fetch(
        "/api/admin/guardians?approvalStatus=pending&limit=5",
        { credentials: "include" }
      );
      const guardiansData = await guardiansResponse.json();

      if (guardiansData.success) {
        setPendingGuardians(guardiansData.data.guardians);
        setStats((prev) => ({
          ...prev,
          pendingGuardians: guardiansData.data.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-slate-400 font-bold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-400">Welcome to the admin control panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">👥</div>
            <div className="text-3xl font-black text-white">
              {stats.totalUsers}
            </div>
          </div>
          <h3 className="text-slate-400 font-bold text-sm">Total Users</h3>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-orange-500/50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">⏳</div>
            <div className="text-3xl font-black text-orange-400">
              {stats.pendingGuardians}
            </div>
          </div>
          <h3 className="text-slate-400 font-bold text-sm">
            Pending Guardians
          </h3>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">👨‍👩‍👧</div>
            <div className="text-3xl font-black text-blue-400">
              {stats.minors}
            </div>
          </div>
          <h3 className="text-slate-400 font-bold text-sm">Minor Accounts</h3>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🎓</div>
            <div className="text-3xl font-black text-green-400">
              {stats.adults}
            </div>
          </div>
          <h3 className="text-slate-400 font-bold text-sm">Adult Accounts</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">Recent Users</h2>
            <Link href="/admin/users"
              className="text-violet-400 hover:text-violet-300 text-sm font-bold">
              View All →
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No users yet
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <Link key={user.id} href={`/admin/users/${user.id}`}
                  className="block p-4 rounded-xl bg-slate-900 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-violet-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-slate-400">
                        {user.email || user.phoneNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                          user.profileComplete
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {user.profileComplete ? "Complete" : "Incomplete"}
                      </span>
                      {user.isMinor && (
                        <div className="mt-1 text-xs text-blue-400">Minor</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">
              Pending Approvals
            </h2>
            <Link href="/admin/guardians"
              className="text-violet-400 hover:text-violet-300 text-sm font-bold">
              View All →
            </Link>
          </div>

          {pendingGuardians.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No pending guardians
            </div>
          ) : (
            <div className="space-y-3">
              {pendingGuardians.map((guardian) => (
                <Link key={guardian.id} href={`/admin/guardians/${guardian.id}`}
                  className="block p-4 rounded-xl bg-slate-900 hover:bg-slate-700 transition-colors border border-orange-500/50 hover:border-orange-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">
                        {guardian.firstName} {guardian.lastName}
                      </p>
                      <p className="text-sm text-slate-400">
                        Student: {guardian.user.firstName}{" "}
                        {guardian.user.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold">
                        Review
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-linear-to-r from-violet-500/10 to-pink-500/10 rounded-2xl p-6 border border-violet-500/50">
        <h2 className="text-2xl font-black text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/users"
            className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-violet-500">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-white mb-1">Manage Users</h3>
            <p className="text-sm text-slate-400">View and edit user accounts</p>
          </Link>

          <Link href="/admin/guardians"
            className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-violet-500">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-bold text-white mb-1">Approve Guardians</h3>
            <p className="text-sm text-slate-400">Review pending approvals</p>
          </Link>

          <button
            onClick={fetchData}
            className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-violet-500 text-left"
          >
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="font-bold text-white mb-1">Refresh Data</h3>
            <p className="text-sm text-slate-400">Update dashboard stats</p>
          </button>
        </div>
      </div>
    </div>
  );
}