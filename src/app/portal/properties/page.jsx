"use client";

import PortalShell from "@/components/portal/PortalShell";
import { Download, AlertTriangle, CheckCircle2, Clock, ChevronDown } from "lucide-react";

const properties = [
  { status: "On Notice", statusColor: "bg-red-100 text-red-700", address: "Apt 5B Rosewood Close", tenant: "Kevin Madden", rent: "€1,750", rentBadge: "Rent 5 Days Late", rtb: "Registered", mprn: "10623847501" },
  { status: "Occupied", statusColor: "bg-teal-100 text-teal-700", address: "Apt 306 Fairview Rd", tenant: "Stephen Blake", rent: "€1,850", rentBadge: null, rtb: "Registered", mprn: "10234762819" },
  { status: "Notice Received", statusColor: "bg-amber-100 text-amber-700", address: "Apt 22 Parkside Plaza", tenant: "Reginald Spencer", rent: "€1,500", rentBadge: null, rtb: "Pending", mprn: "10987654321" },
  { status: "Occupied", statusColor: "bg-teal-100 text-teal-700", address: "Apt 104 Elmwood Grove", tenant: "Adam Walsh", rent: "€1,600", rentBadge: null, rtb: "Registered", mprn: "10543218765" },
];

export default function PropertiesPage() {
  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Properties</h1>
      </div>

      <div className="bg-white/90 rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 font-medium bg-slate-50/70 border-b border-slate-100">
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-4 py-3">Property Address</th>
                <th className="text-left px-4 py-3">Tenant</th>
                <th className="text-left px-4 py-3">Rent</th>
                <th className="text-left px-4 py-3">RTB Status</th>
                <th className="text-left px-4 py-3">MPRN</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {properties.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-700">{p.address}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{p.tenant}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-700">{p.rent}</p>
                    {p.rentBadge && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[0.68rem] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={10} /> {p.rentBadge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.rtb === "Registered" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
                      {p.rtb}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 font-mono text-xs">{p.mprn}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                      <Download size={12} /> View Property
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}
