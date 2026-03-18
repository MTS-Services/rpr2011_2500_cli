"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, Home, FileText, ClipboardList,
  MapPin, Phone, Mail, CalendarDays, Shield, Plus,
  Edit, Download, BadgeCheck, Key, AlertTriangle, CheckCircle2, TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { PROPERTY_FINANCES } from "@/data/finances";

/* ─── Mock data (replace with Supabase query) ─── */
const landlord = {
  id: "2",
  name: "Joan Doyle",
  initials: "JD",
  color: "bg-teal-500",
  dob: "14 Mar 1972",
  pps: "3276513B",
  email: "joan.doyle@email.com",
  mobile: "085-323-8927",
  address: "28 Perkside Plaza, Dublin 4",
};

const properties = [
  { id: "1", address: "Apt 5B Rosewood Close", status: "Notice", statusColor: "bg-orange-100 text-orange-600", tenant: "Kevin Madden", rent: "€1,750", rtb: "Registered" },
  { id: "2", address: "Apt 306 Fairview Rd", status: "Let", statusColor: "bg-teal-100 text-teal-700", tenant: "Stephen Blake", rent: "€1,850", rtb: "Registered" },
  { id: "3", address: "Apt 22 Parkside Plaza", status: "Vacant", statusColor: "bg-slate-100 text-slate-500", tenant: "–", rent: "€1,500", rtb: "Pending" },
];

const documents = [
  { name: "Landlord Agreement 2022.pdf", type: "Agreement", date: "Oct 10, 2022", size: "248 KB" },
  { name: "PPS Verification.pdf", type: "ID", date: "Sep 1, 2021", size: "90 KB" },
];

const auditLog = [
  { ts: "2024-03-01 09:14:22", adminId: "SQ01", user: "Sarah Quinn", action: "Updated Landlord Email", entity: "Landlord", ip: "192.168.1.45" },
  { ts: "2024-01-10 14:20:00", adminId: "JM01", user: "John McCann", action: "Added Landlord", entity: "Landlord", ip: "192.168.1.40" },
];

const TABS = [
  { key: "overview",   label: "Overview",          Icon: User },
  { key: "properties", label: "Properties",         Icon: Home },
  { key: "finances",   label: "Finances",           Icon: TrendingUp },
  { key: "rtb",        label: "RTB Registration",   Icon: Key },
  { key: "documents",  label: "Documents",          Icon: FileText },
  { key: "audit",      label: "Audit",              Icon: ClipboardList },
];

const LANDLORD_FINANCE_MAP = {
  "2": "landlord-1",
};

const PROPERTY_VALUATIONS = {
  "1": 420000,
  "2": 485000,
  "3": 390000,
  "4": 430000,
};

const rtbRegistrations = [
  { id: "1", property: "Apt 5B Rosewood Close", rtbNumber: "RTB-2022-10-456782", status: "Registered", regDate: "5 Nov 2022", expiryDate: "4 Nov 2026", tenant: "Kevin Madden", daysToExpiry: 238 },
  { id: "2", property: "Apt 306 Fairview Rd",   rtbNumber: "RTB-2021-06-334411", status: "Registered", regDate: "12 Jun 2021", expiryDate: "11 Jun 2025", tenant: "Stephen Blake", daysToExpiry: -274 },
  { id: "3", property: "Apt 22 Parkside Plaza", rtbNumber: "—",                  status: "Pending",    regDate: "—",          expiryDate: "—",           tenant: "—",             daysToExpiry: null },
];

const docTypeColors = {
  Agreement: "bg-blue-50 text-blue-700",
  ID: "bg-purple-50 text-purple-700",
};

function InfoRow({ label, value, mono = false, masked = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      {children ?? (
        <p className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}>
          {masked ? "••••••••" : value}
        </p>
      )}
    </div>
  );
}

export default function AdminLandlordProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPps, setShowPps] = useState(false);

  const landlordFinanceId = LANDLORD_FINANCE_MAP[id] || "landlord-1";
  const financeProperties = Object.values(PROPERTY_FINANCES).filter((p) => p.landlordId === landlordFinanceId);
  const monthOptions = Array.from(new Set(financeProperties.flatMap((p) => p.months.map((m) => m.month))));
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0] || "March 2026");

  const monthlyTrend = monthOptions
    .map((month) => {
      const totals = financeProperties.reduce(
        (acc, prop) => {
          const row = prop.months.find((m) => m.month === month);
          if (row) {
            acc.rent += row.rentCollected;
            acc.deductions += row.deductionTotal;
            acc.net += row.netAmount;
          }
          return acc;
        },
        { rent: 0, deductions: 0, net: 0 }
      );
      return { month, ...totals };
    })
    .reverse();

  const selectedMonthRows = financeProperties
    .map((prop) => {
      const row = prop.months.find((m) => m.month === selectedMonth);
      return row
        ? {
            propertyId: prop.propertyId,
            propertyName: prop.propertyName,
            rentCollected: row.rentCollected,
            deductionTotal: row.deductionTotal,
            netAmount: row.netAmount,
            status: row.status,
            maintenanceCost: row.deductions
              .filter((d) => d.type.toLowerCase() === "maintenance")
              .reduce((sum, d) => sum + d.amount, 0),
          }
        : null;
    })
    .filter(Boolean);

  const totals = selectedMonthRows.reduce(
    (acc, row) => {
      acc.rent += row.rentCollected;
      acc.deductions += row.deductionTotal;
      acc.net += row.netAmount;
      acc.maintenance += row.maintenanceCost;
      return acc;
    },
    { rent: 0, deductions: 0, net: 0, maintenance: 0 }
  );

  const portfolioValuation = selectedMonthRows.reduce(
    (sum, row) => sum + (PROPERTY_VALUATIONS[row.propertyId] || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link href="/admin/landlords" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition">
        <ArrowLeft size={15} /> Back to Landlords
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${landlord.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
              {landlord.initials}
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800">{landlord.name}</h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5"><MapPin size={13} />{landlord.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/admin/messages?compose=1&to=landlord:${landlord.id}&name=${encodeURIComponent(landlord.name)}&email=${encodeURIComponent(landlord.email)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              <Mail size={14} className="text-teal-600" /> Contact
            </a>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
              <Edit size={14} /> Edit Landlord
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
              ${activeTab === key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><User size={16} className="text-teal-600" />Personal Details</h2>
            <InfoRow label="Full Name" value={landlord.name} />
            <InfoRow label="Date of Birth" value={landlord.dob} />
            <InfoRow label="PPS Number">
              <div className="flex items-center gap-2">
                <p className="text-base font-mono font-semibold text-slate-700">
                  {showPps ? landlord.pps : "••••••••"}
                </p>
                <button
                  onClick={() => setShowPps(!showPps)}
                  className="text-xs text-teal-600 hover:text-teal-700 font-semibold border border-teal-200 px-2 py-0.5 rounded-md"
                >
                  {showPps ? "Hide" : "Reveal"}
                </button>
              </div>
            </InfoRow>
            <InfoRow label="Address" value={landlord.address} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><Mail size={16} className="text-teal-600" />Contact</h2>
            <InfoRow label="Email" value={landlord.email} />
            <InfoRow label="Mobile" value={landlord.mobile} />
            <div className="mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <Shield size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">PPS and DOB are encrypted at database level. Only Admin/Staff can reveal these fields.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Properties ── */}
      {activeTab === "properties" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Home size={16} className="text-teal-600" />Properties</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Address</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Current Tenant</th>
                  <th className="text-left px-5 py-3">Rent</th>
                  <th className="text-left px-5 py-3">RTB</th>
                  <th className="text-right px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-700">{p.address}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.statusColor}`}>{p.status}</span></td>
                    <td className="px-5 py-4 text-slate-600 text-sm">{p.tenant}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{p.rent}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{p.rtb}</td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/properties/${p.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition">
                        <BadgeCheck size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Finances ── */}
      {activeTab === "finances" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                <TrendingUp size={16} className="text-teal-600" /> Landlord Finances
              </h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-500 uppercase">Rent Collected</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">EUR {totals.rent.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-rose-100 p-4 bg-rose-50/40">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Deductions</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">-EUR {totals.deductions.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-teal-100 p-4 bg-teal-50/40">
                <p className="text-xs font-semibold text-slate-500 uppercase">Net Paid Out</p>
                <p className="text-2xl font-bold text-teal-700 mt-1">EUR {totals.net.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-amber-100 p-4 bg-amber-50/40">
                <p className="text-xs font-semibold text-slate-500 uppercase">Portfolio Value</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">EUR {portfolioValuation.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">All units combined</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Monthly Trend (Rent vs Net)</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => [`EUR ${value.toLocaleString()}`, ""]} />
                  <Bar dataKey="rent" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="net" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-700">Per-Property Breakdown ({selectedMonth})</h3>
              <p className="text-sm text-slate-500">Maintenance: EUR {totals.maintenance.toLocaleString()}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-5 py-3">Property</th>
                    <th className="text-right px-5 py-3">Rent</th>
                    <th className="text-right px-5 py-3">Deductions</th>
                    <th className="text-right px-5 py-3">Maintenance</th>
                    <th className="text-right px-5 py-3">Net</th>
                    <th className="text-center px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedMonthRows.map((row) => (
                    <tr key={row.propertyId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{row.propertyName}</td>
                      <td className="px-5 py-4 text-right text-slate-700">EUR {row.rentCollected.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right text-rose-600">-EUR {row.deductionTotal.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right text-amber-700">EUR {row.maintenanceCost.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right text-teal-700 font-semibold">EUR {row.netAmount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${row.status === "Paid" ? "bg-teal-100 text-teal-700" : "bg-amber-100 text-amber-700"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/properties/${row.propertyId}/finances`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"
                        >
                          <BadgeCheck size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── RTB Registration ── */}
      {activeTab === "rtb" && (
        <div className="space-y-4">
          {/* Summary banner */}
          {rtbRegistrations.some((r) => r.daysToExpiry !== null && r.daysToExpiry <= 30 && r.daysToExpiry >= 0) && (
            <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 font-medium">One or more RTB registrations expire within 30 days. Please renew promptly to avoid compliance issues.</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Key size={16} className="text-teal-600" />RTB Registrations per Property</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-5 py-3">Property</th>
                    <th className="text-left px-5 py-3">RTB Number</th>
                    <th className="text-left px-5 py-3">Current Tenant</th>
                    <th className="text-left px-5 py-3">Reg. Date</th>
                    <th className="text-left px-5 py-3">Expiry Date</th>
                    <th className="text-left px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rtbRegistrations.map((r) => {
                    const expiring = r.daysToExpiry !== null && r.daysToExpiry <= 30 && r.daysToExpiry >= 0;
                    const expired  = r.daysToExpiry !== null && r.daysToExpiry < 0;
                    return (
                      <tr key={r.id} className={`hover:bg-slate-50/60 transition-colors ${expiring ? "bg-amber-50/40" : ""}`}>
                        <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{r.property}</td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-600">{r.rtbNumber}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{r.tenant}</td>
                        <td className="px-5 py-4 text-sm text-slate-500">{r.regDate}</td>
                        <td className="px-5 py-4 text-sm">
                          <span className={expired ? "text-red-600 font-semibold" : expiring ? "text-amber-600 font-semibold" : "text-slate-500"}>
                            {r.expiryDate}
                          </span>
                          {expiring && <span className="ml-2 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Expires soon</span>}
                          {expired  && <span className="ml-2 text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Expired</span>}
                        </td>
                        <td className="px-5 py-4">
                          {r.status === "Registered" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
                              <CheckCircle2 size={12} /> Registered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><FileText size={16} className="text-teal-600" />Documents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Document</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Size</th>
                  <th className="text-right px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{d.name}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${docTypeColors[d.type] || "bg-slate-100 text-slate-600"}`}>{d.type}</span></td>
                    <td className="px-5 py-4 text-sm text-slate-500">{d.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{d.size}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"><Download size={13} />Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Audit ── */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><ClipboardList size={16} className="text-teal-600" />Audit Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Timestamp</th>
                  <th className="text-left px-5 py-3">Staff ID</th>
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Action</th>
                  <th className="text-left px-5 py-3">Entity</th>
                  <th className="text-left px-5 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLog.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-slate-600">{l.ts}</td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-500">{l.adminId}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{l.user}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{l.action}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{l.entity}</td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-400">{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
