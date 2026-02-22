"use client";

import { useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import { Download, AlertTriangle, Search, ChevronDown } from "lucide-react";

const tenants = [
  { name: "Ellis Davis", property: "Apt 4 Willow Court", start: "Aug 1, 2023", pps: "1234567SA", status: "Occupied", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Stephen Blake", property: "Apt 306 Fairview Rd", start: "May 19, 2023", pps: "8765432TA", status: "Occupied", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Kevin Madden", property: "Apt 5B Rosewood Close", start: "Oct 10, 2022", pps: "—", status: "On Notice", statusColor: "bg-amber-100 text-amber-700", late: "Rent 5 Days Late" },
  { name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Aug 3, 2023", pps: "9876543L", status: "Occupied", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Jul 15, 2021", pps: "9876543L", status: "Ended", statusColor: "bg-slate-100 text-slate-500" },
];

export default function TenantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <PortalShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Tenants</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition shadow-sm">
          All Statuses <ChevronDown size={15} />
        </button>
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-5 py-4">Property Address</th>
                <th className="text-left px-5 py-4">Tenancy Start</th>
                <th className="text-left px-5 py-4">P.P.S. Number</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-5 text-base font-semibold text-slate-700">{t.name}</td>
                  <td className="px-5 py-5 text-base text-slate-600">{t.property}</td>
                  <td className="px-5 py-5 text-base text-slate-600">{t.start}</td>
                  <td className="px-5 py-5 font-mono text-sm text-slate-600">{t.pps}</td>
                  <td className="px-5 py-5">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${t.statusColor}`}>
                      {t.status}
                    </span>
                    {t.late && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle size={12} /> {t.late}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                      <Download size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          total={tenants.length}
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
