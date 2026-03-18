"use client";

import { useEffect, useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { authenticatedFetch } from "@/utils/authFetch";
import Link from "next/link";
import {
  Home,
  CreditCard,
  Wrench,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Key,
  ArrowRight,
  Clock,
  Calendar,
} from "lucide-react";

const kpis = [
  {
    label: "Monthly Rent",
    value: "€1,750",
    Icon: CreditCard,
    color: "bg-teal-50 text-teal-600 border-teal-100",
    sub: "Due 1st of month",
  },
  {
    label: "Next Payment",
    value: "Mar 1",
    Icon: Calendar,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    sub: "6 days away",
  },
  {
    label: "Open Requests",
    value: "1",
    Icon: Wrench,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    sub: "Maintenance",
  },
  {
    label: "Documents",
    value: "4",
    Icon: FileText,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    sub: "Available",
  },
];

const alerts = [
  {
    type: "warning",
    text: "Rent payment 5 days overdue",
    meta: "€1,750 due Feb 1, 2025",
    badge: "Overdue",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    type: "info",
    text: "Maintenance request in progress — Boiler issue",
    meta: "Submitted 3 days ago",
    badge: "In Progress",
    badgeColor: "bg-teal-100 text-teal-700",
  },
];

// Helper function to map payment status to display color
const getPaymentStatusColor = (status) => {
  switch (status) {
    case "PAID":
      return "bg-teal-100 text-teal-700";
    case "PENDING":
      return "bg-orange-100 text-orange-700";
    case "OVERDUE":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

// Helper function to map payment status to display text
const mapPaymentStatus = (status) => {
  switch (status) {
    case "PAID":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "OVERDUE":
      return "Overdue";
    default:
      return status;
  }
};

const maintenance = [
  { title: "Boiler not heating", date: "Feb 20, 2025", status: "In Progress", statusColor: "bg-blue-100 text-blue-700" },
  { title: "Leaking tap in kitchen", date: "Jan 10, 2025", status: "Resolved",    statusColor: "bg-teal-100 text-teal-700" },
];

const messages = [
  { from: "McCann & Curran Reality Agency", text: "Your rent review is scheduled for May 2025.", time: "2 days ago" },
  { from: "McCann & Curran Reality Agency", text: "A maintenance engineer will visit on Feb 24th between 10am–1pm.", time: "3 days ago" },
];

export default function TenantDashboardPage() {
  const [tenancies, setTenancies] = useState([]);
  const [loadingTenancies, setLoadingTenancies] = useState(true);
  const [tenanciesError, setTenanciesError] = useState(null);
  const [rentPayments, setRentPayments] = useState([]);
  const [loadingRentPayments, setLoadingRentPayments] = useState(true);
  const [rentPaymentsError, setRentPaymentsError] = useState(null);

  useEffect(() => {
    const fetchTenancies = async () => {
      try {
        setLoadingTenancies(true);
        setTenanciesError(null);
        const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/my`);
        if (!res.ok) throw new Error(`Failed to load tenancies: ${res.statusText}`);
        const body = await res.json();
        if (body.success && Array.isArray(body.data)) setTenancies(body.data);
        else setTenancies([]);
      } catch (err) {
        console.error("Error fetching tenancies:", err);
        setTenanciesError(err.message || "Failed to load tenancies");
        setTenancies([]);
      } finally {
        setLoadingTenancies(false);
      }
    };
    fetchTenancies();
  }, []);

  useEffect(() => {
    const fetchRentPayments = async () => {
      try {
        setLoadingRentPayments(true);
        setRentPaymentsError(null);
        const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/tenant`);
        if (!res.ok) throw new Error(`Failed to load rent payments: ${res.statusText}`);
        const body = await res.json();
        if (body.success && Array.isArray(body.data)) setRentPayments(body.data);
        else setRentPayments([]);
      } catch (err) {
        console.error("Error fetching rent payments:", err);
        setRentPaymentsError(err.message || "Failed to load rent payments");
        setRentPayments([]);
      } finally {
        setLoadingRentPayments(false);
      }
    };
    fetchRentPayments();
  }, []);

  const tenancy = tenancies && tenancies.length > 0 ? tenancies[0] : null;

  return (
    <TenantShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 xl:mb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{tenancy?.tenant?.name ? `Welcome Back, ${tenancy.tenant.name}` : 'Welcome Back'}</h1>
          <p className="text-slate-500 mt-1 text-sm">{tenancy?.property?.name ? `${tenancy.property.name} · Tenancy since ${tenancy.startDate ? new Date(tenancy.startDate).toLocaleDateString() : '—'}` : '—'}</p>
        </div>
        <Link
          href="/tenant/maintenance"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Wrench size={15} /> Report Issue
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 xl:gap-3 mb-3 xl:mb-5">
        <div className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}>
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">Monthly Rent</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600`}>
              <CreditCard size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{tenancy ? `€${tenancy.rent}` : '€1,750'}</p>
          <p className="text-xs text-slate-400">{tenancy?.rentDueDay ? `Due ${tenancy.rentDueDay}` : 'Due 1st of month'}</p>
        </div>

        <div className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}>
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">Next Payment</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600`}>
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{tenancy && tenancy.startDate ? new Date(tenancy.startDate).toLocaleDateString('en-US',{month:'short', day:'numeric'}) : '—'}</p>
          <p className="text-xs text-slate-400">{tenancy?.rentReviewDate ? `Rent review ${new Date(tenancy.rentReviewDate).toLocaleDateString()}` : '—'}</p>
        </div>

        <div className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}>
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">Open Requests</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600`}>
              <Wrench size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{maintenance.length}</p>
          <p className="text-xs text-slate-400">Maintenance</p>
        </div>

        <div className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}>
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">Documents</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600`}>
              <FileText size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">4</p>
          <p className="text-xs text-slate-400">Available</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Alerts + Rent History */}
        <div className="lg:col-span-2 space-y-3 xl:space-y-4">

          {/* Alerts removed per request */}

          {/* Rent Payment History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Rent Payments</h3>
              <Link
                href="/tenant/rent"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {/* Table (lg+) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-6 py-3.5">Month</th>
                    <th className="text-left px-4 py-3.5">Date</th>
                    <th className="text-left px-4 py-3.5">Status</th>
                    <th className="text-right px-6 py-3.5">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rentPayments.length > 0 ? (
                    rentPayments.slice(0, 4).map((p, i) => {
                      const monthDate = new Date(p.month + "-01");
                      const monthLabel = monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                      const dateDisplay = p.paidDate 
                        ? new Date(p.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 text-base font-semibold text-slate-700">{monthLabel}</td>
                          <td className="px-4 py-4 text-sm text-slate-500">{dateDisplay}</td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPaymentStatusColor(p.status)}`}>
                              {mapPaymentStatus(p.status)}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right text-base font-bold text-slate-800">€{p.amount}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-5 py-4 text-center text-slate-500">
                        {loadingRentPayments ? 'Loading payments...' : 'No payments found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards (smaller than lg) */}
            <div className="lg:hidden space-y-4 p-4">
              {rentPayments.length > 0 ? (
                rentPayments.slice(0, 4).map((p, i) => {
                  const monthDate = new Date(p.month + "-01");
                  const monthLabel = monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                  const dateDisplay = p.paidDate 
                    ? new Date(p.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 ">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-700">{monthLabel}</div>
                          <div className="text-xs text-slate-400 mt-1">{dateDisplay}</div>
                          <div className="mt-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPaymentStatusColor(p.status)}`}>{mapPaymentStatus(p.status)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-slate-800">€{p.amount}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-slate-500">
                  {loadingRentPayments ? 'Loading payments...' : 'No payments found'}
                </div>
              )}
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Maintenance Requests</h3>
              <Link
                href="/tenant/maintenance"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {maintenance.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <Wrench size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-700">{m.title}</p>
                      <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} /> {m.date}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ml-4 ${m.statusColor}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Property Info + Messages */}
        <div className="space-y-3 xl:space-y-4">
          {/* My Property */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">My Property</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center">
                <Home size={48} className="text-teal-300" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">{tenancy?.property?.name || '—'}</p>
                <p className="text-sm text-slate-500 mt-0.5">{tenancy?.property?.address || tenancy?.property?.county || '—'}</p>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Rent",         value: tenancy ? `€${tenancy.rent} / month` : '—' },
                  { label: "Lease Start",  value: tenancy?.startDate ? new Date(tenancy.startDate).toLocaleDateString() : '—' },
                  { label: "Lease End",    value: tenancy?.endDate ? new Date(tenancy.endDate).toLocaleDateString() : '—' },
                  { label: "RTB",          value: tenancy?.rtbRegistration || (tenancy?.rtbNumber ? 'Registered' : '—') },
                  { label: "MPRN",         value: tenancy?.property?.mprn || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/tenant/property"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-50 transition"
              >
                View Full Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* RTB Registration and Messages removed as requested */}
        </div>
      </div>
    </TenantShell>
  );
}
