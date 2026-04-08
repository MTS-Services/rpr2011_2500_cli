"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpDown, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const DEFAULT_ITEMS_PER_PAGE = 10;

const PAYMENT_STATUS_STYLES = {
  PAID: "bg-teal-100 text-teal-700",
  PENDING: "bg-amber-100 text-amber-700",
  OVERDUE: "bg-red-100 text-red-700",
  LATE: "bg-orange-100 text-orange-700",
  UNKNOWN: "bg-slate-100 text-slate-700",
};

function formatDate(value) {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString();
}

function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "EUR 0.00";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function getStatusBadgeClass(status) {
  return PAYMENT_STATUS_STYLES[String(status || "UNKNOWN").toUpperCase()] || PAYMENT_STATUS_STYLES.UNKNOWN;
}

export default function AdminTenancyRentPaymentsPage() {
  const router = useRouter();
  const params = useParams();
  const tenancyId = String(params?.tenancyId || "");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 1,
  });
  const [markedPaidIds, setMarkedPaidIds] = useState(new Set());

  const handleMarkAsPaid = async (paymentId) => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/${paymentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PAID" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark payment as paid");
      }

      setMarkedPaidIds((prev) => new Set(prev).add(paymentId));
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: "PAID" } : p))
      );

      await Swal.fire({
        icon: "success",
        title: "Marked as Paid!",
        text: "Rent payment has been marked as paid.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error marking payment as paid:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to mark payment as paid.",
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchRentPayments = async () => {
      if (!tenancyId) {
        setLoading(false);
        setError("Missing tenancy ID.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams();
        query.append("tenancyId", tenancyId);
        query.append("page", String(currentPage));
        query.append("limit", String(itemsPerPage));

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments?${query.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch rent payments: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result?.success || !Array.isArray(result?.data)) {
          throw new Error(result?.message || "Failed to load rent payments");
        }

        const serverPagination = result.meta?.pagination || {};
        const totalItems = Number(serverPagination.totalItems ?? result.data.length);
        const resolvedItemsPerPage = Number(serverPagination.itemsPerPage ?? itemsPerPage);
        const totalPages = Number(
          serverPagination.totalPages ??
          Math.max(1, Math.ceil(totalItems / Math.max(1, resolvedItemsPerPage)))
        );

        setPayments(result.data);
        setPagination({
          currentPage: Number(serverPagination.currentPage ?? currentPage),
          itemsPerPage: resolvedItemsPerPage,
          totalItems,
          totalPages,
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load rent payments");
        setPayments([]);
        setPagination({
          currentPage: 1,
          itemsPerPage,
          totalItems: 0,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRentPayments();
    return () => controller.abort();
  }, [tenancyId, currentPage, itemsPerPage]);

  const summary = useMemo(() => {
    const first = payments[0] || {};
    const tenant = first.tenant || {};
    const property = first.tenancy?.property || {};

    return {
      tenantName: tenant.name || "Unknown Tenant",
      tenantEmail: tenant.email || "N/A",
      propertyName: property.name || "Unknown Property",
      propertyLocation: [property.address, property.county].filter(Boolean).join(" - ") || "N/A",
    };
  }, [payments]);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => router.push("/admin/tenancies")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={16} /> Back to Tenancies
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Rent Payments</h1>
        <p className="mt-1 text-sm text-slate-500 break-all">Tenancy ID: {tenancyId}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Tenant</p>
            <p className="font-semibold text-slate-800 mt-1">{summary.tenantName}</p>
            <p className="text-slate-500">{summary.tenantEmail}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Property</p>
            <p className="font-semibold text-slate-800 mt-1">{summary.propertyName}</p>
            <p className="text-slate-500">{summary.propertyLocation}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading rent payments...
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          No rent payments found for this tenancy.
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <>
          <div className="lg:hidden space-y-3">
            {payments.map((payment) => {
              const normalizedStatus = String(payment.status || "UNKNOWN").toUpperCase();
              const statusClass = getStatusBadgeClass(normalizedStatus);

              return (
                <article key={payment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">{payment.month || "N/A"}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                      {normalizedStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Maintenance</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(payment.maintenanceCost)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Due Date</p>
                      <p className="font-medium text-slate-700">{formatDate(payment.dueDate)}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-sm">
                    <p className="text-xs text-slate-400 mb-2">Action</p>
                    <button
                      onClick={() => handleMarkAsPaid(payment.id)}
                      disabled={normalizedStatus === "PAID"}
                      className="w-full inline-flex items-center justify-center gap-1 rounded-md bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed px-3 py-2 text-xs text-white font-semibold transition"
                    >
                      <CheckCircle2 size={14} /> Mark Paid
                    </button>
                  </div>
                </article>
              );
            })}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Pagination
                total={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                showItemsPerPage
              />
            </div>
          </div>

          <div className="hidden lg:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">
                    <span className="inline-flex items-center gap-1">Month <ArrowUpDown size={12} className="text-slate-400" /></span>
                  </th>
                  <th className="px-4 py-3 font-semibold">Tenant</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Maintenance</th>
                  <th className="px-4 py-3 font-semibold">Due Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => {
                  const normalizedStatus = String(payment.status || "UNKNOWN").toUpperCase();
                  const statusClass = getStatusBadgeClass(normalizedStatus);

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-medium text-slate-800">{payment.month || "N/A"}</td>
                      <td className="px-4 py-3 text-slate-700">{payment.tenant?.name || "Unknown Tenant"}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(payment.maintenanceCost)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatDate(payment.dueDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                          {normalizedStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleMarkAsPaid(payment.id)}
                          disabled={normalizedStatus === "PAID"}
                          className="inline-flex items-center gap-1 rounded-md bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed px-3 py-1.5 text-xs text-white font-semibold transition"
                        >
                          <CheckCircle2 size={14} /> Mark Paid
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              total={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPage
            />
          </div>
        </>
      )}
    </div>
  );
}
