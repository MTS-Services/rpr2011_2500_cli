"use client";

import PortalShell from "@/components/portal/PortalShell";
import { Download, Search, ChevronDown } from "lucide-react";

const items = [
  { property: "Apt 22 Parkside Plaza", issue: "Shower broken", age: "1 day ago", priority: "Medium", status: "In Progress" },
  { property: "Apt 104 Elmwood Grove", issue: "Heating issue", age: "2 hours ago", priority: "High", status: "New" },
  { property: "Apt 65 Southern Cross", issue: "Missing three light bulbs", age: "6 days ago", priority: "Low", status: "Awaiting Materials" },
  { property: "Apt 32 Aberdeen Street", issue: "Leaky kitchen sink pipe", age: "8 days ago", priority: "Medium", status: "Scheduled (30 Apr 2024)" },
  { property: "Adam Walsh", issue: "Toilet constantly running", age: "3 days ago", priority: "High", status: "Needs Contractor" },
];

const priorityColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

export default function MaintenancePage() {
  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Maintenance</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {["All Properties", "All Statuses", "All Priority"].map((f) => (
          <button key={f} className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition">
            {f} <ChevronDown size={14} />
          </button>
        ))}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 bg-white/90 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 font-medium bg-slate-50/70 border-b border-slate-100">
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-4 py-3">Issue</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">{item.property}</p>
                    <p className="text-xs text-slate-400">{item.age}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{item.issue}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {item.status === "Awaiting Materials" ? (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                        {item.status}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-600">{item.status}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            Rows per page:
            <select className="ml-1 border border-slate-200 rounded px-2 py-1 text-xs bg-white focus:outline-none">
              <option>10</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>1–5 of 8</span>
            <div className="flex gap-1">
              {["⏮","◀","▶"].map((a, k) => (
                <button key={k} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 text-xs">{a}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
