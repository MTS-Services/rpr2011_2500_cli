"use client";

import PortalShell from "@/components/portal/PortalShell";
import { Download, AlertTriangle, Search, ChevronDown } from "lucide-react";

const tenants = [
  { name: "Ellis Davis", property: "Apt 4 Willow Court", start: "Aug 1, 2023", pps: "1234567SA", status: "Occupied", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Stephen Blake", property: "Apt 306 Fairview Rd", start: "May 19, 2023", pps: "8765432TA", status: "Occupied", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Kevin Madden", property: "Apt 5B Rosewood Close", start: "Oct 10, 2022", pps: "—", status: "On Notice", statusColor: "bg-amber-100 text-amber-700", late: "Rent 5 Days Late" },
  { name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Aug 3, 2023", pps: "9876543L", status: "Occupied", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Jul 15, 2021", pps: "9876543L", status: "Ended", statusColor: "bg-slate-100 text-slate-500" },
];

export default function TenantsPage() {
  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tenants</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition">
          All Statuses <ChevronDown size={14} />
        </button>
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name..."
            className="w-full pl-9 pr-4 py-2 bg-white/90 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 font-medium bg-slate-50/70 border-b border-slate-100">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-4 py-3">Property Address</th>
                <th className="text-left px-4 py-3">Tenancy Start</th>
                <th className="text-left px-4 py-3">P.P.S. Number</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tenants.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-700">{t.name}</td>
                  <td className="px-4 py-4 text-slate-600">{t.property}</td>
                  <td className="px-4 py-4 text-slate-600">{t.start}</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600">{t.pps}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.statusColor}`}>
                      {t.status}
                    </span>
                    {t.late && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={10} /> {t.late}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                      <Download size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            Rows per page:
            <select className="ml-1 border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 bg-white focus:outline-none">
              <option>10</option>
              <option>25</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>1–5 of 5</span>
            <div className="flex items-center gap-1">
              {["⏮", "◀", "▶"].map((a, k) => (
                <button key={k} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 transition text-xs">{a}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
