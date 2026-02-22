"use client";

import { useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <PortalShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {["All Properties", "All Document Types"].map((f) => (
          <button key={f} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition shadow-sm">
            {f} <ChevronDown size={15} />
          </button>
        ))}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-6 py-4">Document</th>
                <th className="text-left px-5 py-4">Property</th>
                <th className="text-left px-5 py-4">Type</th>
                <th className="text-left px-5 py-4">Date</th>
                <th className="text-left px-5 py-4">Size</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-slate-500" />
                      </div>
                      <span className="text-base font-semibold text-slate-700 truncate max-w-[240px]">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-base text-slate-600">{d.property}</td>
                  <td className="px-5 py-5">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${typeColors[d.type] || "bg-slate-100 text-slate-600"}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-base text-slate-500">{d.date}</td>
                  <td className="px-5 py-5 text-base text-slate-400">{d.size}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          total={docs.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>
    </PortalShell>
  );
}
