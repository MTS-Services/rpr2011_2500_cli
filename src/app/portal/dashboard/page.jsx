"use client";

import PortalShell from "@/components/portal/PortalShell";
import { AlertTriangle, Home, Users, Wrench, FileText, FolderOpen, ArrowRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";

const kpis = [
  { label: "My Properties", value: "4", Icon: Home, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { label: "Active Tenancies", value: "3", Icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { label: "Open Maintenance", value: "2", Icon: Wrench, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { label: "New Documents", value: "2", Icon: FileText, color: "bg-rose-50 text-rose-600 border-rose-100" },
  { label: "My Documents", value: "1", Icon: FolderOpen, color: "bg-teal-50 text-teal-600 border-teal-100" },
];

const alerts = [
  { type: "warning", text: "Rent review due for Apt 5B Rosewood Close", meta: "Due 12 May 2024", badge: "12 May 2024", badgeColor: "bg-amber-100 text-amber-700" },
  { type: "info", text: "Broken shower reported in Apt 22 Parkside Plaza", meta: "€2 days ago", badge: "In Progress", badgeColor: "bg-teal-100 text-teal-700" },
];

const properties = [
  { status: "On Notice", address: "Apt 5B Rosewood Close", sub: "Rent review in 11 days", tenant: "Kevin", tenantSub: "5 days ago", rent: "€1,750", rentSub: "# 123C1678", statusColor: "bg-red-100 text-red-700" },
  { status: "Occupied", address: "Apt 306 Fairview Rd", sub: "1days 390", tenant: "Stephen Blake", tenantSub: "15 tys 400", rent: "€1,850", rentSub: "4 Jan 2025", statusColor: "bg-teal-100 text-teal-700" },
  { status: "Notice Received", address: "Apt 22 Parkside Plaza", sub: "a Erecrne Jodes ago", tenant: "Reginald Spencer", tenantSub: "3 days ago", rent: "€1,500", rentSub: "# 0 Dec 2024", statusColor: "bg-amber-100 text-amber-700" },
  { status: "Occupied", address: "Apt 104 Elmwood Grove", sub: "# d8ek on 13 Aug 2025", tenant: "Adam Walsh", tenantSub: "17 days ago", rent: "€1,600", rentSub: "# 12 Aug 2025", statusColor: "bg-teal-100 text-teal-700" },
];

const activity = [
  { name: "Edward Martin", action: "reported a sole issue in", property: "Apt 104 Elmwood Grove", time: "2 hours ago", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
  { name: "Kevin Madden", action: "rent payment", property: "Apt 65 Southern Cross", time: "1 day ago", avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
  { name: "Sarah Quinn", action: 'uploaded "Lease Agreement"', property: "Apt 306 Fairview Rd", time: "15 days ago", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Steven Keane", action: "finalized RTB registration,", property: "Apt 70 Square B-64", time: "17 days ago", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
];

export default function DashboardPage() {
  return (
    <PortalShell>
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Welcome Back, Joe</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {kpis.map(({ label, value, Icon, color }) => (
          <div key={label} className={`bg-white rounded-xl border p-4 flex flex-col gap-2 ${color.split(" ")[2]}`}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-slate-500 leading-tight">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.split(" ").slice(0, 2).join(" ")}`}>
                <Icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Alerts + Properties */}
        <div className="lg:col-span-2 space-y-4">
          {/* Alerts */}
          <div className="bg-white/90 rounded-xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <AlertTriangle size={16} className="text-amber-500" />
                Alerts
              </div>
              <a href="#" className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                View All <ArrowRight size={12} />
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    {a.type === "warning" ? (
                      <AlertCircle size={15} className="text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-teal-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-slate-700">{a.text}</p>
                      <p className="text-xs text-slate-400">{a.meta}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3 ${a.badgeColor}`}>
                    {a.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My Properties */}
          <div className="bg-white/90 rounded-xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-700">My Properties</h3>
              <a href="/portal/properties" className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                View All Properties <ArrowRight size={12} />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 font-medium bg-slate-50/60">
                    <th className="text-left px-5 py-2.5">Status</th>
                    <th className="text-left px-3 py-2.5">Property Address</th>
                    <th className="text-left px-3 py-2.5">Tenant</th>
                    <th className="text-right px-5 py-2.5">Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-700">{p.address}</p>
                        <p className="text-xs text-slate-400">{p.sub}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-slate-700">{p.tenant}</p>
                        <p className="text-xs text-slate-400">{p.tenantSub}</p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className="font-semibold text-slate-700">{p.rent}</p>
                        <p className="text-xs text-slate-400">{p.rentSub}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 text-center">
              <a href="/portal/properties" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center gap-1">
                View All Properties <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="bg-white/90 rounded-xl border border-slate-100 overflow-hidden h-fit">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-3 px-4 py-3.5">
                <Image
                  src={a.avatar}
                  alt={a.name}
                  width={34}
                  height={34}
                  className="rounded-full object-cover w-[34px] h-[34px] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">
                    <span className="font-semibold">{a.name}</span>{" "}
                    {a.action}
                  </p>
                  <p className="text-xs text-teal-600">{a.property}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 text-center">
            <a href="/portal/properties" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All Properties
            </a>
          </div>
          {/* Action Buttons */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-2 pt-2">
            {["View Property", "View Property", "View Property"].slice(0, 2).map((btn, i) => (
              <button key={i} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition justify-center">
                <FolderOpen size={12} /> {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
