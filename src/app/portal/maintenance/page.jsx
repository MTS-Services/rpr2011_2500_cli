"use client";

import { useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <PortalShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Maintenance</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {["All Properties", "All Statuses", "All Priority"].map((f) => (
          <button key={f} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition shadow-sm">
            {f} <ChevronDown size={15} />
          </button>
        ))}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search maintenance..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-6 py-4">Property</th>
                <th className="text-left px-5 py-4">Issue</th>
                <th className="text-left px-5 py-4">Priority</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-base font-semibold text-slate-700">{item.property}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{item.age}</p>
                  </td>
                  <td className="px-5 py-5 text-base text-slate-600">{item.issue}</td>
                  <td className="px-5 py-5">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    {item.status === "Awaiting Materials" ? (
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                        {item.status}
                      </span>
                    ) : (
                      <span className="text-base text-slate-600">{item.status}</span>
                    )}
                  </td>
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
          total={items.length}
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
