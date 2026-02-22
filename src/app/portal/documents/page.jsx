"use client";

import PortalShell from "@/components/portal/PortalShell";
import { Download, Search, ChevronDown, FileText, File } from "lucide-react";

const docs = [
  { property: "Apt 5B Rosewood Close", name: "Lease Agreement 2022.pdf", type: "Lease", date: "Oct 10, 2022", size: "248 KB" },
  { property: "Apt 306 Fairview Rd", name: "RTB Registration Cert.pdf", type: "RTB Registration", date: "May 19, 2023", size: "134 KB" },
  { property: "Apt 104 Elmwood Grove", name: "March 2024 Rent Statement.pdf", type: "Statement", date: "Apr 1, 2024", size: "89 KB" },
  { property: "Apt 22 Parkside Plaza", name: "Annual Inspection Report.pdf", type: "Inspection", date: "Jan 15, 2024", size: "320 KB" },
  { property: "Apt 5B Rosewood Close", name: "Plumbing Invoice #0042.pdf", type: "Invoice", date: "Feb 28, 2024", size: "72 KB" },
  { property: "Apt 104 Elmwood Grove", name: "Lease Agreement 2023.pdf", type: "Lease", date: "Aug 3, 2023", size: "261 KB" },
];

const typeColors = {
  Lease: "bg-blue-50 text-blue-700",
  "RTB Registration": "bg-purple-50 text-purple-700",
  Statement: "bg-teal-50 text-teal-700",
  Inspection: "bg-amber-50 text-amber-700",
  Invoice: "bg-rose-50 text-rose-700",
};

export default function DocumentsPage() {
  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {["All Properties", "All Document Types"].map((f) => (
          <button key={f} className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition">
            {f} <ChevronDown size={14} />
          </button>
        ))}
        <div className="relative flex-1 min-w-[220px]">
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
                <th className="text-left px-5 py-3">Document</th>
                <th className="text-left px-4 py-3">Property</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Size</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {docs.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-slate-500" />
                      </div>
                      <span className="font-medium text-slate-700 truncate max-w-[200px]">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{d.property}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[d.type] || "bg-slate-100 text-slate-600"}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{d.date}</td>
                  <td className="px-4 py-4 text-slate-400">{d.size}</td>
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
          <span>1–6 of 6</span>
        </div>
      </div>
    </PortalShell>
  );
}
