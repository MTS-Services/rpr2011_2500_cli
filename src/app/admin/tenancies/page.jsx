"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, CheckCircle2, Clock, CreditCard
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import AddTenancyModal from "./components/AddTenancyModal";
import { addTenancyToDirectory, loadDirectoryData, saveDirectoryData } from "@/utils/mockDirectoryStore";

const RENT_STYLE = {
  Paid: { badge: "bg-teal-100 text-teal-700", label: "Paid" },
  Overdue: { badge: "bg-red-100 text-red-700", label: "Overdue" },
  Pending: { badge: "bg-amber-100 text-amber-700", label: "Pending" },
};

const STATUS_LET = {
  Let: "bg-teal-500 text-white",
  Notice: "bg-orange-100 text-orange-600 border border-orange-300",
};
const BADGE = {
  Notice: "bg-orange-400 text-white",
  Active: "bg-teal-500 text-white",
};
const RTB_STATUS = {
  Active: "bg-teal-600 text-white",
  Notice: "bg-orange-400 text-white",
};

function AdminTenanciesInner() {
  const [selected, setSelected] = useState([]);
  const [addTenancyModalOpen, setAddTenancyModalOpen] = useState(false);
  const [tenancies, setTenancies] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [countyFilter, setCountyFilter] = useState("All County/City");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  // Local override map: { [tenancy.id]: "Paid" | "Overdue" | "Pending" }
  // In production this would write to Supabase
  const [rentOverrides, setRentOverrides] = useState({});
  const getRentStatus = (t) => rentOverrides[t.id] ?? t.rentStatus;
  const markPaid = (id) => setRentOverrides((prev) => ({ ...prev, [id]: "Paid" }));
  // Local status override: { [tenancy.id]: string }
  const [statusOverrides, setStatusOverrides] = useState({});
  const getStatus = (t) => statusOverrides[t.id] ?? t.statusLet;
  const setStatus = (id, value) => setStatusOverrides((prev) => ({ ...prev, [id]: value }));

  useEffect(() => {
    const state = loadDirectoryData();
    setTenancies(state.tenancies || []);
    setTenants(state.tenants || []);
  }, []);

  // Build status options from source data so we stay in sync
  const STATUS_OPTIONS = Array.from(new Set(tenancies.map((x) => x.statusLet).filter(Boolean)));
  const STATUS_VALUES = STATUS_OPTIONS.length > 0 ? STATUS_OPTIONS : ["Let", "Notice", "Active"];
  const uniqueCounties = Array.from(new Set(tenancies.map((t) => t.county).filter(Boolean))).slice(0, 50);
  const uniqueProperties = Array.from(new Set(tenancies.map((t) => t.property).filter(Boolean))).slice(0, 50);

  const handleAddTenancy = (formData) => {
    const tenancy = addTenancyToDirectory(formData);
    const state = loadDirectoryData();
    setTenancies([tenancy, ...state.tenancies.filter((entry) => entry.id !== tenancy.id)]);
    setTenants(state.tenants);
    setAddTenancyModalOpen(false);
    alert("Tenancy created");
  };

  const searchParams = useSearchParams();
  const filterParam = searchParams?.get("filter");

  const today = new Date();
  const in30 = new Date(); in30.setDate(today.getDate() + 30);

  const filtered = tenancies.filter((t) => {
    const matchSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.landlord.toLowerCase().includes(search.toLowerCase()) ||
      t.property.toLowerCase().includes(search.toLowerCase());
    const matchCounty = countyFilter === "All County/City" || t.county === countyFilter;
    const matchProperty = propertyFilter === "All Properties" || t.property === propertyFilter;
    const matchStatus = statusFilter === "All Statuses" || t.statusLet === statusFilter;
    
    if (filterParam === "rtb-missing") return !t.rtb || t.rtb === "N/A";
    if (filterParam === "rent-reviews") {
      if (!t.rentReviewDate) return false;
      const d = new Date(t.rentReviewDate);
      return d >= today && d <= in30;
    }
    
    return matchSearch && matchCounty && matchProperty && matchStatus;
  });

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Tenancies</h1>
        <button onClick={() => setAddTenancyModalOpen(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> <span className="hidden sm:inline">New Tenancy</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenancies…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            aria-label="Search tenancies by tenant, landlord, or property"
          />
        </div>

        <select value={countyFilter} onChange={(e) => setCountyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer" aria-label="Filter by county or city">
          <option>All County/City</option>
          {uniqueCounties.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer" aria-label="Filter by property">
          <option>All Properties</option>
          {uniqueProperties.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer" aria-label="Filter by status">
          <option>All Statuses</option>
          {STATUS_VALUES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="lg:hidden space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {t.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm truncate">{t.name}</p>
                <p className="text-xs text-slate-400 truncate">{t.sub}</p>
              </div>
              <div className="flex-shrink-0">
                <select
                  value={getStatus(t)}
                  onChange={(e) => {
                    const nextStatus = e.target.value;
                    setStatus(t.id, nextStatus);
                    const nextTenancies = tenancies.map((entry) => (
                      entry.id === t.id ? { ...entry, statusLet: nextStatus } : entry
                    ));
                    setTenancies(nextTenancies);
                    const state = loadDirectoryData();
                    saveDirectoryData({ ...state, tenancies: nextTenancies });
                  }}
                  className="text-xs rounded-full px-2 py-1 border border-slate-200 bg-white"
                >
                  {STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Landlord</p>
                <p className="font-medium text-slate-700 truncate">{t.landlord}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Rent</p>
                <p className="font-semibold text-slate-800">{t.rent}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">County/City</p>
                <p className="font-medium text-slate-700">{t.county}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">RTB #</p>
                <p className="font-medium text-slate-700">{t.rtb}</p>
              </div>
            </div>
            {/* Rent status row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full">
                <select
                  value={getRentStatus(t)}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "mark-paid") {
                      markPaid(t.id);
                    } else {
                      setRentOverrides((prev) => ({ ...prev, [t.id]: v }));
                    }
                  }}
                  className="w-full max-w-xs rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                  <option value="mark-paid">Mark Paid</option>
                </select>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100">
              <button className={`w-full py-1.5 text-white text-xs font-semibold rounded-md transition ${t.rtbStatus === "Notice" ? "bg-orange-400 hover:bg-orange-500" : "bg-teal-600 hover:bg-teal-700"
                }`}>{t.rtbStatus}</button>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={filtered.length} />
        </div>
      </div>

      {/* Table — visible lg+ */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Tenant <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Status <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">County/City <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Landlord <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Rent</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Rent Status</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB #</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB Date</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <tr key={t.id} className={`hover:bg-slate-50/60 transition ${selected.includes(t.id) ? "bg-teal-50/40" : ""}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleRow(t.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-base">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={getStatus(t)}
                      onChange={(e) => {
                        const nextStatus = e.target.value;
                        setStatus(t.id, nextStatus);
                        const nextTenancies = tenancies.map((entry) => (
                          entry.id === t.id ? { ...entry, statusLet: nextStatus } : entry
                        ));
                        setTenancies(nextTenancies);
                        const state = loadDirectoryData();
                        saveDirectoryData({ ...state, tenancies: nextTenancies });
                      }}
                      className="rounded-md border border-slate-200 px-2 py-1 text-sm bg-white"
                    >
                      {STATUS_VALUES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-600 text-sm">{t.county}</td>
                <td className="px-3 py-3">
                  <p className="text-slate-800 font-medium text-sm">{t.landlord}</p>
                  <p className="text-sm text-slate-400">{t.landlordSub}</p>
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800 text-sm">{t.rent}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={getRentStatus(t)}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "mark-paid") {
                          markPaid(t.id);
                        } else {
                          setRentOverrides((prev) => ({ ...prev, [t.id]: v }));
                        }
                      }}
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-sm bg-white"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                      <option value="mark-paid">Mark Paid</option>
                    </select>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <p className="text-slate-600 text-sm">{t.rtb}</p>
                  {t.rtbReg && (
                    <p className="text-sm text-teal-600 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                      {t.rtbReg}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3 text-slate-500 text-sm font-mono">
                  {t.rtbDate ?? <span className="text-slate-300">—</span>}
                </td>
                <td className="px-3 py-3">
                  <button className={`px-3 py-1.5 text-white text-sm font-semibold rounded-md transition ${t.rtbStatus === "Notice"
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-teal-600 hover:bg-teal-700"
                    }`}>
                    {t.rtbStatus}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} />
      </div>

      <AddTenancyModal
        isOpen={addTenancyModalOpen}
        onClose={() => setAddTenancyModalOpen(false)}
        onSubmit={handleAddTenancy}
        tenants={tenants}
        properties={Array.from(new Set(tenants.map((tenant) => tenant.property).filter(Boolean)))}
      />
    </div>
  );
}

export default function AdminTenanciesPage() {
  return (
    <Suspense fallback={null}>
      <AdminTenanciesInner />
    </Suspense>
  );
}

// using shared Pagination component from components/portal/Pagination
