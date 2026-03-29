"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/utils/authFetch";
import {
  Building2,
  Users,
  Wrench,
  FolderOpen,
  Wallet,
  CreditCard,
  DollarSign,
  Loader2,
  Plus,
  FileText,
  Upload,
} from "lucide-react";

/* ─── Sub-components ──────────────────────────── */
function KpiCard({ label, value, Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-slate-500 leading-tight">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "EUR0";
  }
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/dashboard`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch admin dashboard");
        }

        const json = await response.json();
        setDashboardData(json?.data || null);
      } catch (err) {
        console.error("Error fetching admin dashboard:", err);
        setError(err?.message || "Failed to load admin dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const profile = dashboardData?.profile || {};
  const summary = dashboardData?.summary || {};
  const systemOverview = dashboardData?.systemOverview || {};

  const kpis = useMemo(
    () => [
      {
        label: "Properties Under Management",
        value: summary?.propertiesUnderManagement ?? 0,
        Icon: Building2,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
      {
        label: "Active Tenancies",
        value: summary?.activeTenancies ?? 0,
        Icon: Users,
        iconBg: "bg-sky-50",
        iconColor: "text-sky-500",
      },
      {
        label: "Open Maintenance",
        value: summary?.openMaintenance ?? 0,
        Icon: Wrench,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
      },
      {
        label: "Documents Uploaded (30 days)",
        value: summary?.documentsUploaded30Days ?? 0,
        Icon: FolderOpen,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
    ],
    [summary]
  );

  if (isLoading) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome, {profile?.name || "Admin"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/admin/documents')} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition">
            <Upload size={15} className="text-slate-500" />
            <span className="hidden xl:inline">Upload Document</span>
          </button>
          <button onClick={() => router.push('/admin/tenancies')} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition">
            <FileText size={15} className="text-slate-500" />
            <span className="hidden xl:inline">Add Tenancy</span>
          </button>
          <button onClick={() => router.push('/admin/properties')} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            <Plus size={16} />
            <span className="hidden xl:inline">Add Property</span>
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* RTB Registration Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-teal-600" />
            RTB Registration Summary
          </h2>
          <button 
            onClick={() => router.push('/admin/rtb')}
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition"
          >
            Manage RTB →
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Registered", value: summary?.rtbStatus?.REGISTERED ?? 0, color: "text-teal-600", bg: "bg-teal-50" },
              { label: "Pending", value: summary?.rtbStatus?.PENDING ?? 0, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Missing", value: summary?.rtbStatus?.MISSING ?? 0, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Unknown", value: summary?.rtbStatus?.UNKNOWN ?? 0, color: "text-slate-600", bg: "bg-slate-50" },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-4 rounded-xl border border-slate-100 shadow-sm transition hover:shadow-md cursor-pointer hover:-translate-y-1 duration-300 flex flex-col justify-center`} onClick={() => router.push('/admin/rtb')}>
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-tight sm:tracking-wider leading-none mb-2">{stat.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">System Overview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 lg:p-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Users</h3>
              <Users size={16} className="text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{systemOverview?.users?.total ?? 0}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
              <span>Landlords: {systemOverview?.users?.landlords ?? 0}</span>
              <span>Tenants: {systemOverview?.users?.tenants ?? 0}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Payments</h3>
              <CreditCard size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{systemOverview?.payments?.total ?? 0}</p>
            <p className="mt-3 text-sm text-slate-600">
              Overdue: <span className="font-semibold">{systemOverview?.payments?.overdue ?? 0}</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Monthly Revenue</h3>
              <DollarSign size={16} className="text-amber-600" />
            </div>
            <p className="text-sm text-slate-500 mb-2">{systemOverview?.monthlyRevenue?.period || "Current Period"}</p>
            <div className="space-y-1.5 text-sm text-slate-700">
              <p>Expected: <span className="font-semibold">{formatCurrency(systemOverview?.monthlyRevenue?.totalExpected)}</span></p>
              <p>Paid: <span className="font-semibold">{formatCurrency(systemOverview?.monthlyRevenue?.totalPaid)}</span></p>
              <p>Payments Count: <span className="font-semibold">{systemOverview?.monthlyRevenue?.paymentsCount?.id ?? 0}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-slate-800">Admin Profile</h2>
          <Wallet size={18} className="text-slate-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <p className="text-slate-600">
            Name: <span className="font-semibold text-slate-800">{profile?.name || "-"}</span>
          </p>
          <p className="text-slate-600">
            Role: <span className="font-semibold text-slate-800">{profile?.role || "-"}</span>
          </p>
          <p className="text-slate-600">
            Email: <span className="font-semibold text-slate-800">{profile?.email || "-"}</span>
          </p>
          <p className="text-slate-600">
            Phone: <span className="font-semibold text-slate-800">{profile?.phone || "-"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
