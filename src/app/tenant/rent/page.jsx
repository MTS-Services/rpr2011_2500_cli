"use client";

import { useEffect, useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";
import Link from "next/link";
import { AlertTriangle, CreditCard, Calendar, AlertCircle } from "lucide-react";

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

export default function TenantRentPage() {
  const [rentPayments, setRentPayments] = useState([]);
  const [tenancy, setTenancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch rent payments
        const paymentsRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/tenant`);
        if (!paymentsRes.ok) throw new Error(`Failed to load rent payments: ${paymentsRes.statusText}`);
        const paymentsBody = await paymentsRes.json();
        
        if (paymentsBody.success && Array.isArray(paymentsBody.data)) {
          setRentPayments(paymentsBody.data);
          // Extract tenancy info from first payment
          if (paymentsBody.data.length > 0) {
            setTenancy(paymentsBody.data[0].tenancy);
          }
        } else {
          setRentPayments([]);
        }
      } catch (err) {
        console.error("Error fetching rent payments:", err);
        setError(err.message || "Failed to load rent payments");
        setRentPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find first overdue payment for banner
  const firstOverdue = rentPayments.find(p => p.status === "OVERDUE");
  const monthlyRent = tenancy?.property?.rent || "—";
  const nextPaymentDate = rentPayments.length > 0 
    ? new Date(rentPayments[0].dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : "—";
  const currentBalance = firstOverdue ? "Overdue" : rentPayments.some(p => p.status === "PENDING") ? "Pending" : "Current";
  const balanceDate = firstOverdue 
    ? new Date(firstOverdue.month + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : "—";

  // Pagination logic
  const totalPages = Math.ceil(rentPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = rentPayments.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Rent Payments</h1>
        <p className="text-slate-500 mt-1 text-sm">Full payment history for your tenancy at {tenancy?.property?.name || 'your property'}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3 mb-3 xl:mb-5">
        {[
          { label: "Monthly Rent",    value: `€${monthlyRent}`,  sub: "Due 1st of month",   Icon: CreditCard,  color: "bg-teal-50 text-teal-600",   border: "border-teal-100" },
          { label: "Next Payment",    value: nextPaymentDate,   sub: "Next due date",        Icon: Calendar,    color: "bg-blue-50 text-blue-600",    border: "border-blue-100" },
          { label: "Current Balance", value: currentBalance,    sub: balanceDate,           Icon: AlertCircle, color: currentBalance === "Overdue" ? "bg-red-50 text-red-600" : currentBalance === "Pending" ? "bg-orange-50 text-orange-600" : "bg-teal-50 text-teal-600", border: currentBalance === "Overdue" ? "border-red-100" : currentBalance === "Pending" ? "border-orange-100" : "border-teal-100" },
        ].map(({ label, value, sub, Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm ${border}`}>
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-slate-500 leading-tight">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Overdue banner */}
      {firstOverdue && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
          <AlertTriangle size={20} className="text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              {new Date(firstOverdue.month + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} rent is overdue
            </p>
            <p className="text-xs text-red-400 mt-0.5">Please contact your letting agent if you have any issues.</p>
          </div>
          <Link
            href="/tenant/messages"
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Message Agent
          </Link>
        </div>
      )}

      {/* Table (lg+) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Month</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Reference</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((p, i) => {
                  const monthDate = new Date(p.month + "-01");
                  const monthLabel = monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                  const dateDisplay = p.paidDate 
                    ? new Date(p.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 text-base font-semibold text-slate-700">{monthLabel}</td>
                      <td className="px-4 py-4 text-sm text-slate-500">{dateDisplay}</td>
                      <td className="px-4 py-4 font-mono text-sm text-slate-400">#{p.reference}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPaymentStatusColor(p.status)}`}>
                          {mapPaymentStatus(p.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-base font-bold text-slate-800">€{p.amount}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-4 text-center text-slate-500">
                    {loading ? 'Loading payments...' : 'No payments found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards (smaller than lg) */}
      <div className="lg:hidden space-y-2">
        {paginatedPayments.length > 0 ? (
          paginatedPayments.map((p, i) => {
            const monthDate = new Date(p.month + "-01");
            const monthLabel = monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            const dateDisplay = p.paidDate 
              ? new Date(p.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{monthLabel}</div>
                    <div className="text-xs text-slate-400 mt-1">{dateDisplay} · <span className="font-mono">#{p.reference}</span></div>
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
            {loading ? 'Loading payments...' : 'No payments found'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {rentPayments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-3">
          <Pagination
            total={rentPayments.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </TenantShell>
  );
}
