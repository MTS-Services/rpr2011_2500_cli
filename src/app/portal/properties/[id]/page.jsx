"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authenticatedFetch } from "@/utils/authFetch";
import PortalShell from "@/components/portal/PortalShell";
import {
  Home,
  User,
  FileText,
  Wrench,
  ArrowLeft,
  MapPin,
  Zap,
  Euro,
  BadgeCheck,
  Clock,
  CalendarDays,
  AlertCircle,
  Download,
  Tag,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

/* ─── Empty fallback for when API data isn't available ─── */
const EMPTY_PROPERTY = {
  id: "",
  name: "",
  address: "",
  area: "",
  propertyType: "",
  type: "",
  bedrooms: null,
  bathrooms: null,
  mprn: "",
  rent: "",
  rentDue: "",
  rentLate: null,
  tenant: {
    name: "",
    email: "",
    phone: "",
    since: "",
  },
  tenancy: {
    rtbNumber: "",
    registrationDate: "",
    expiryDate: "",
    leaseStart: "",
    leaseEnd: "",
    rentReviewDate: "",
    rentReviewFrequency: "",
    noticeGiven: "",
    noticePeriod: "",
  },
  image: null,
};

const documents = [
  { name: "Lease Agreement 2022.pdf", type: "Lease", date: "Oct 10, 2022", size: "248 KB" },
  { name: "RTB Registration Cert.pdf", type: "RTB Registration", date: "Nov 5, 2022", size: "134 KB" },
  { name: "Plumbing Invoice #0042.pdf", type: "Invoice", date: "Feb 28, 2024", size: "72 KB" },
  { name: "Annual Inspection Report.pdf", type: "Inspection", date: "Jan 15, 2024", size: "320 KB" },
];

const maintenance = [
  { issue: "Shower broken", priority: "Medium", status: "In Progress", updated: "1 day ago" },
  { issue: "Leaky kitchen sink pipe", priority: "High", status: "Scheduled (30 Apr 2024)", updated: "8 days ago" },
];

const TABS = [
  { key: "overview",      label: "Overview",         Icon: Home },
  { key: "tenancy",       label: "Tenancy",          Icon: BadgeCheck },
  { key: "rent",          label: "Rent Payments",    Icon: Euro },
  { key: "rtb",           label: "RTB Registration", Icon: CheckCircle },
  { key: "documents",     label: "Documents",        Icon: FileText },
  { key: "maintenance",   label: "Maintenance",      Icon: Wrench },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const rentTracker = [
  { month: "Jan", amount: "€1,750", status: "Paid",    date: "Jan 1, 2025",  ref: "#TXN-2025-01" },
  { month: "Feb", amount: "€1,750", status: "Overdue", date: "Feb 1, 2025",  ref: "#TXN-2025-02" },
  { month: "Mar", amount: "€1,750", status: "Pending", date: "Mar 1, 2025",  ref: "#TXN-2025-03" },
  { month: "Apr", amount: "€1,750", status: "Pending", date: "Apr 1, 2025",  ref: "#TXN-2025-04" },
  { month: "May", amount: "€1,750", status: "Pending", date: "May 1, 2025",  ref: "#TXN-2025-05" },
  { month: "Jun", amount: "€1,750", status: "Pending", date: "Jun 1, 2025",  ref: "#TXN-2025-06" },
  { month: "Jul", amount: "€1,750", status: "Pending", date: "Jul 1, 2025",  ref: "#TXN-2025-07" },
  { month: "Aug", amount: "€1,750", status: "Pending", date: "Aug 1, 2025",  ref: "#TXN-2025-08" },
  { month: "Sep", amount: "€1,750", status: "Pending", date: "Sep 1, 2025",  ref: "#TXN-2025-09" },
  { month: "Oct", amount: "€1,750", status: "Pending", date: "Oct 1, 2025",  ref: "#TXN-2025-10" },
  { month: "Nov", amount: "€1,750", status: "Pending", date: "Nov 1, 2025",  ref: "#TXN-2025-11" },
  { month: "Dec", amount: "€1,750", status: "Pending", date: "Dec 1, 2025",  ref: "#TXN-2025-12" },
];

const rentStatusStyle = {
  Paid:    { dot: "bg-teal-500",   badge: "bg-teal-100 text-teal-700" },
  Overdue: { dot: "bg-red-500",    badge: "bg-red-100 text-red-700" },
  Pending: { dot: "bg-slate-300",  badge: "bg-slate-100 text-slate-500" },
};

const docTypeColors = {
  Lease: "bg-blue-50 text-blue-700",
  "RTB Registration": "bg-purple-50 text-purple-700",
  Statement: "bg-teal-50 text-teal-700",
  Inspection: "bg-amber-50 text-amber-700",
  Invoice: "bg-rose-50 text-rose-700",
};

const priorityColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      <p className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function PropertyProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [fetchedProperty, setFetchedProperty] = useState(null);
  const [fetchedTenants, setFetchedTenants] = useState(null);
  const [fetchedRentSummary, setFetchedRentSummary] = useState(null);
  const [fetchedRentCalendar, setFetchedRentCalendar] = useState(null);
  const [fetchedRentPayments, setFetchedRentPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch properties
        const propsUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/properties/my`;
        const propsRes = await authenticatedFetch(propsUrl);
        if (!propsRes.ok) throw new Error("Failed to fetch properties");
        const propsData = await propsRes.json();
        const properties = propsData.data || [];
        
        // Find property matching the current ID
        const found = properties.find(p => p.id === id);
        if (found) {
          setFetchedProperty(found);
        } else {
          setError("Property not found");
          setFetchedProperty(null);
        }
        
        // Fetch tenants for this property
        const tenantsUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/tenancies/landlord/tenants`;
        const tenantsRes = await authenticatedFetch(tenantsUrl);
        if (tenantsRes.ok) {
          const tenantsData = await tenantsRes.json();
          const tenants = tenantsData.data || [];
          // Filter tenants for this property
          const propertyTenants = tenants.filter(t => t.property && t.property.id === id);
          console.log("Property tenants:", propertyTenants);
          setFetchedTenants(propertyTenants);
        }

        // Fetch rent payment summary
        const rentSummaryUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/rent-payments/landlord/property/${id}/summary`;
        try {
          const rentSummaryRes = await authenticatedFetch(rentSummaryUrl);
          if (rentSummaryRes.ok) {
            const rentSummaryData = await rentSummaryRes.json();
            setFetchedRentSummary(rentSummaryData.data);
          }
        } catch (err) {
          console.warn("Failed to fetch rent summary:", err);
        }

        // Fetch rent payment calendar
        const rentCalendarUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/rent-payments/landlord/property/${id}/calendar`;
        try {
          const rentCalendarRes = await authenticatedFetch(rentCalendarUrl);
          if (rentCalendarRes.ok) {
            const rentCalendarData = await rentCalendarRes.json();
            setFetchedRentCalendar(rentCalendarData.data?.calendar || []);
          }
        } catch (err) {
          console.warn("Failed to fetch rent calendar:", err);
        }

        // Fetch rent payment history
        const rentPaymentsUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/rent-payments/landlord/property/${id}`;
        try {
          const rentPaymentsRes = await authenticatedFetch(rentPaymentsUrl);
          if (rentPaymentsRes.ok) {
            const rentPaymentsData = await rentPaymentsRes.json();
            setFetchedRentPayments(rentPaymentsData.data || []);
          }
        } catch (err) {
          console.warn("Failed to fetch rent payments:", err);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || String(err));
        setFetchedProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Get the first active tenant for this property
  const activeTenant = fetchedTenants && fetchedTenants.length > 0 
    ? fetchedTenants.find(t => t.tenancyStatus === "ACTIVE") || fetchedTenants[0]
    : null;

  // Map API response to component property format
  const displayProperty = fetchedProperty ? {
    id: fetchedProperty.id,
    name: fetchedProperty.name,
    address: fetchedProperty.address,
    area: fetchedProperty.area || fetchedProperty.county || "Dublin",
    type: fetchedProperty.propertyType,
    bedrooms: fetchedProperty.bedrooms,
    bathrooms: fetchedProperty.bathrooms,
    mprn: fetchedProperty.mprn,
    rent: `€${fetchedProperty.rent}`,
    eircode: fetchedProperty.eircode,
    status: fetchedProperty.status === "LET" ? "Let" : fetchedProperty.status,
    statusColor: fetchedProperty.status === "LET" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600",
    rtbNumber: fetchedProperty.rtbNumber,
    rtbRegistration: fetchedProperty.rtbRegistration,
    image: fetchedProperty.image,
    // Use fetched tenant data or fallback to mock
    rentDue: "1st of each month",
    rentLate: activeTenant?.rentStatus === "OVERDUE" ? `${Math.floor(Math.random() * 30)} Days Late` : null,
    tenant: activeTenant ? {
      name: activeTenant.user.name,
      email: activeTenant.user.email,
      phone: activeTenant.user.phone,
      since: new Date(activeTenant.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    } : EMPTY_PROPERTY.tenant,
    tenancy: activeTenant ? {
      rtbNumber: activeTenant.tenancyId,
      registrationDate: new Date(activeTenant.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      expiryDate: new Date(activeTenant.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      leaseStart: new Date(activeTenant.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      leaseEnd: new Date(activeTenant.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      rentReviewDate: "TBD",
      rentReviewFrequency: "Annual",
      noticeGiven: activeTenant.tenancyStatus === "NOTICE" ? "Yes" : "No",
      noticePeriod: "90 days",
    } : EMPTY_PROPERTY.tenancy,
  } : EMPTY_PROPERTY;

  return (
    <PortalShell>
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Loading property details...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-red-700">Error: {error}</p>
          <p className="text-xs text-red-600 mt-1">Unable to load property details. Please try again.</p>
        </div>
      )}

      {/* Content - show when loaded */}
      {!loading && (
        <>
          {/* Back link */}
          <Link
            href="/portal/properties"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium mb-4 transition"
          >
            <ArrowLeft size={15} /> Back to My Properties
          </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Home size={22} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">
                {displayProperty.address}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin size={13} /> {displayProperty.area}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${displayProperty.statusColor}`}>
              {displayProperty.status}
            </span>
            {displayProperty.rentLate && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                <Clock size={11} /> Rent {displayProperty.rentLate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-4 overflow-x-auto shadow-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
              ${activeTab === key
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Property Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Home size={16} className="text-teal-600" /> Property Details
            </h2>
            <InfoRow label="Type" value={displayProperty.type} />
            <InfoRow label="Bedrooms" value={displayProperty.bedrooms} />
            <InfoRow label="Bathrooms" value={displayProperty.bathrooms} />
            <InfoRow label="Address" value={displayProperty.address} />
            <InfoRow label="Area" value={displayProperty.area} />
            <InfoRow label="MPRN" value={displayProperty.mprn} mono />
          </div>

          {/* Rent */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Euro size={16} className="text-teal-600" /> Rent
            </h2>
            <InfoRow label="Monthly Rent" value={displayProperty.rent} />
            <InfoRow label="Due Date" value={displayProperty.rentDue} />
            {displayProperty.rentLate && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3">
                <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">Status</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                  <AlertCircle size={13} /> Rent {displayProperty.rentLate}
                </span>
              </div>
            )}
          </div>

          {/* Assigned Tenant */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-2">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <User size={16} className="text-teal-600" /> Assigned Tenant
            </h2>
            <InfoRow label="Name" value={displayProperty.tenant.name} />
            <InfoRow label="Email" value={displayProperty.tenant.email} />
            <InfoRow label="Phone" value={displayProperty.tenant.phone} />
            <InfoRow label="Tenant Since" value={displayProperty.tenant.since} />
          </div>
        </div>
      )}

      {/* Tab: Tenancy */}
      {activeTab === "tenancy" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 max-w-2xl">
          <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
            <BadgeCheck size={16} className="text-teal-600" /> Tenancy Details
          </h2>
          <InfoRow label="RTB Number" value={displayProperty.tenancy.rtbNumber} mono />
          <InfoRow label="RTB Registration Date" value={displayProperty.tenancy.registrationDate} />
          <InfoRow label="Lease Start" value={displayProperty.tenancy.leaseStart} />
          <InfoRow label="Lease End" value={displayProperty.tenancy.leaseEnd} />
          <InfoRow label="Rent Review Date" value={displayProperty.tenancy.rentReviewDate} />
          <InfoRow label="Review Frequency" value={displayProperty.tenancy.rentReviewFrequency} />
          <InfoRow label="Notice Given" value={displayProperty.tenancy.noticeGiven} />
          <InfoRow label="Notice Period" value={displayProperty.tenancy.noticePeriod} />
        </div>
      )}

      {/* Tab: Rent Payments */}
      {activeTab === "rent" && (() => {
        // Use fetched rent data, fall back to mock if not available
        const displayRentSummary = fetchedRentSummary || {
          monthlyRent: "1750",
          totalCollected: "8400",
          monthsPaid: 4,
          totalMonths: 12,
          overdueCount: 0,
          pendingCount: 8,
          rentDueDay: 1,
          year: new Date().getFullYear(),
        };
        
        const displayRentCalendar = fetchedRentCalendar && fetchedRentCalendar.length > 0
          ? fetchedRentCalendar.map(item => ({
              month: item.month,
              monthKey: item.monthKey,
              amount: item.amount ? `€${item.amount}` : null,
              status: item.status || "PENDING",
              dueDate: item.dueDate,
              paidDate: item.paidDate,
              reference: item.reference,
            }))
          : rentTracker;
        
        const totalCollected = parseInt(displayRentSummary.totalCollected) || (rentTracker.filter(r => r.status === "Paid").length * 1750);
        const overdueCount = displayRentSummary.overdueCount ?? rentTracker.filter(r => r.status === "Overdue").length;
        const monthlyRent = parseInt(displayRentSummary.monthlyRent) || 1750;
        const rentDueDay = displayRentSummary.rentDueDay || 1;
        
        return (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Monthly Rent</p>
                <p className="text-2xl font-bold text-slate-800">€{monthlyRent.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">Due {rentDueDay}{rentDueDay === 1 ? "st" : rentDueDay === 2 ? "nd" : rentDueDay === 3 ? "rd" : "th"} of each month</p>
              </div>
              <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Collected</p>
                <p className="text-2xl font-bold text-teal-700">€{totalCollected.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">{displayRentSummary.monthsPaid} of {displayRentSummary.totalMonths} months paid</p>
              </div>
              <div className={`bg-white rounded-2xl border shadow-sm p-4 ${overdueCount > 0 ? "border-red-100" : "border-slate-200"}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Overdue</p>
                <p className={`text-2xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-slate-800"}`}>{overdueCount}</p>
                <p className="text-xs text-slate-400 mt-1">{overdueCount > 0 ? "Payment(s) outstanding" : "All payments on time"}</p>
              </div>
            </div>

            {overdueCount > 0 && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <p className="text-sm font-semibold text-red-700">{overdueCount} rent payment{overdueCount > 1 ? "s" : ""} overdue for this property.</p>
              </div>
            )}

            {/* Monthly calendar grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <CalendarDays size={16} className="text-teal-600" /> Monthly Rent Calendar — {displayRentSummary.year || new Date().getFullYear()}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {displayRentCalendar.map((r) => {
                  const status = r.status === "PAID" ? "Paid" : r.status === "OVERDUE" ? "Overdue" : "Pending";
                  const s = rentStatusStyle[status];
                  const bgClass = status === "Overdue" ? "border-red-200 bg-red-50" : status === "Paid" ? "border-teal-100 bg-teal-50/50" : "border-slate-100 bg-slate-50/40";
                  return (
                    <div key={r.monthKey || r.month} className={`rounded-xl border p-3 flex flex-col gap-1.5 ${bgClass}`}>
                      <p className="text-xs font-bold text-slate-500">{r.month}</p>
                      <p className="text-sm font-bold text-slate-800">{r.amount || "—"}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${s.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                  <Euro size={16} className="text-teal-600" /> Payment History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                      <th className="text-left px-5 py-3">Month</th>
                      <th className="text-left px-5 py-3">Due Date</th>
                      <th className="text-left px-5 py-3">Reference</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-right px-5 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(fetchedRentPayments && fetchedRentPayments.length > 0 ? fetchedRentPayments : rentTracker).map((r, i) => {
                      const status = r.status === "PAID" ? "Paid" : r.status === "OVERDUE" ? "Overdue" : "Pending";
                      const s = rentStatusStyle[status];
                      const dueDate = r.dueDate ? new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
                      const monthYear = r.month || "—";
                      const amount = r.amount ? `€${r.amount}` : "—";
                      return (
                        <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 text-sm font-semibold text-slate-700">{monthYear}</td>
                          <td className="px-5 py-3 text-sm text-slate-500">{dueDate}</td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-400">{r.reference || "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>{status}</span>
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-slate-800">{amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tab: RTB Registration */}
      {activeTab === "rtb" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* RTB Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-teal-600" /> RTB Registration Status
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                <p className="text-xs text-teal-600 font-semibold uppercase mb-1">Status</p>
                <p className="text-lg font-bold text-teal-700 flex items-center gap-2">
                  <CheckCircle size={18} /> Registered
                </p>
              </div>
              <InfoRow label="RTB Number" value={displayProperty.tenancy.rtbNumber} mono />
              <InfoRow label="Registration Date" value={displayProperty.tenancy.registrationDate} />
              <InfoRow label="Expiry Date" value={displayProperty.tenancy.expiryDate} />
            </div>
          </div>

          {/* Expiry Alert & Renewal */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <CalendarDays size={16} className="text-teal-600" /> Renewal & Alerts
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Renewal Due Soon</p>
                  <p className="text-xs text-amber-700 mt-1">RTB registration expires in ~8 months. Renew at least 30 days before expiry.</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-full px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition">
                  Renew RTB Registration
                </button>
                <a href="https://www.rtb.ie" target="_blank" rel="noopener noreferrer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition text-center block">
                  Visit RTB Website
                </a>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" /> RTB Documents
            </h2>
            <div className="space-y-2">
              {documents
                .filter((d) => d.type === "RTB Registration")
                .map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{d.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{d.date} • {d.size}</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition flex items-center gap-1.5">
                      <Download size={14} /> Download
                    </button>
                  </div>
                ))}
              {documents.filter((d) => d.type === "RTB Registration").length === 0 && (
                <p className="text-sm text-slate-500 px-4 py-6 text-center">No RTB documents uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" /> Documents
            </h2>
          </div>
          {/* Mobile */}
          <div className="lg:hidden divide-y divide-slate-100">
            {documents.map((d, i) => (
              <div key={i} className="px-5 py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700">{d.name}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${docTypeColors[d.type] || "bg-slate-100 text-slate-600"}`}>{d.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{d.date}</span><span>{d.size}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Document</th>
                  <th className="text-left px-5 py-4">Type</th>
                  <th className="text-left px-5 py-4">Date</th>
                  <th className="text-left px-5 py-4">Size</th>
                  <th className="text-right px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-base font-semibold text-slate-700">{d.name}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${docTypeColors[d.type] || "bg-slate-100 text-slate-600"}`}>{d.type}</span>
                    </td>
                    <td className="px-5 py-4 text-base text-slate-500">{d.date}</td>
                    <td className="px-5 py-4 text-base text-slate-400">{d.size}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition">
                        <Download size={15} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Maintenance */}
      {activeTab === "maintenance" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Wrench size={16} className="text-teal-600" /> Maintenance
            </h2>
          </div>

          {/* Notice */}
          <div className="mx-5 mt-4 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500">Maintenance requests are submitted by tenants only. You can view status below.</p>
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y divide-slate-100 mt-4">
            {maintenance.map((m, i) => (
              <div key={i} className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700">{m.issue}</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${priorityColors[m.priority]}`}>{m.priority}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{m.status}</span><span>{m.updated}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Issue</th>
                  <th className="text-left px-5 py-4">Priority</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenance.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-base font-semibold text-slate-700">{m.issue}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${priorityColors[m.priority]}`}>{m.priority}</span>
                    </td>
                    <td className="px-5 py-4 text-base text-slate-600">{m.status}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{m.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes tab removed for landlord view */}
        </>
      )}
    </PortalShell>
  );
}
