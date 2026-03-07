"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, Home, FileText, ClipboardList,
  MapPin, Phone, Mail, CalendarDays, Shield, Plus,
  Edit, Download
} from "lucide-react";

/* Mock tenant data */
const tenantMock = {
  id: "1",
  name: "Sarah Kelly",
  initials: "SK",
  color: "bg-teal-500",
  dob: "14 Mar 1990",
  pps: "•••••••567A",
  email: "sarah.kelly@email.com",
  mobile: "087-965-6692",
  address: "Apt 12 Grand Canal Dock",
  property: "Apt 39 Grand Canal Dock",
  moveIn: "01 Feb 2022",
  status: "Active",
};

const documents = [
  { name: "Lease Agreement.pdf", type: "Lease", date: "01 Feb 2022", size: "120 KB" },
  { name: "ID Verified.pdf", type: "ID", date: "12 Jan 2020", size: "80 KB" },
];

const audit = [
  { ts: "2024-03-01 09:14", user: "Admin", action: "Updated Tenant Email" },
];

const TABS = [
  { key: "overview", label: "Overview", Icon: User },
  { key: "lease", label: "Lease", Icon: Home },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "audit", label: "Audit", Icon: ClipboardList },
];

function InfoRow({ label, value, mono = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      {children ?? (
        <p className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}>
          {value}
        </p>
      )}
    </div>
  );
}

export default function TenantDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("overview");
  const [showPps, setShowPps] = useState(false);

  const tenant = { ...tenantMock, id };

  return (
    <div className="space-y-4">
      <Link href="/admin/tenants" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition">
        <ArrowLeft size={15} /> Back to Tenants
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${tenant.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
              {tenant.initials}
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800">{tenant.name}</h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5"><MapPin size={13} />{tenant.address}</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
            <Edit size={14} /> Edit Tenant
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${tab === key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><User size={16} className="text-teal-600" />Personal Details</h2>
            <InfoRow label="Full Name" value={tenant.name} />
            <InfoRow label="Date of Birth" value={tenant.dob} />
            <InfoRow label="PPS Number">
              <div className="flex items-center gap-2">
                <p className="text-base font-mono font-semibold text-slate-700">{showPps ? tenant.pps : "••••••••"}</p>
                <button onClick={() => setShowPps(!showPps)} className="text-xs text-teal-600 hover:text-teal-700 font-semibold border border-teal-200 px-2 py-0.5 rounded-md">{showPps ? "Hide" : "Reveal"}</button>
              </div>
            </InfoRow>
            <InfoRow label="Address" value={tenant.address} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><Mail size={16} className="text-teal-600" />Contact</h2>
            <InfoRow label="Email" value={tenant.email} />
            <InfoRow label="Mobile" value={tenant.mobile} />
            <div className="mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <Shield size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Personal data is masked in the UI. Reveal only for authorised staff.</p>
            </div>
          </div>
        </div>
      )}

      {tab === "lease" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Home size={16} className="text-teal-600" />Lease</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400">Property</div>
                <div className="font-semibold text-slate-700">{tenant.property}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Move-in Date</div>
                <div className="font-semibold text-slate-700">{tenant.moveIn}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Status</div>
                <div className="font-semibold text-slate-700">{tenant.status}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><FileText size={16} className="text-teal-600" />Documents</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition"><Plus size={14} />Upload</button>
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
                    <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600`}>{d.type}</span></td>
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

      {tab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><ClipboardList size={16} className="text-teal-600" />Audit Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Timestamp</th>
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {audit.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-slate-600">{a.ts}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{a.user}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{a.action}</td>
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
