"use client";
import { useState, useEffect } from "react";
import {
  Plus, ChevronDown, Search, ArrowUpDown, Eye, Edit
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import Swal from "sweetalert2";

const REQUESTS = [
  // Open
  { id: 1,  col: "Open",        title: "Leaking tap",             priority: "Low",    assignee: { initials: "HQ", color: "bg-teal-500" },    name: "Holly Quigley",    property: "Apt 28 Parkside Plaza",   age: "4 days ago" },
  { id: 2,  col: "Open",        title: "Smoke detector faulty",   priority: "Medium", assignee: { initials: "AW", color: "bg-orange-500" },  name: "Adam Walsh",       property: "Apt 65 Southern Cross",   age: "5 days ago" },
  { id: 3,  col: "Open",        title: "Smoke alarm replacement", priority: "High",   assignee: { initials: "KD", color: "bg-rose-500" },    name: "Kevin Doples",     property: "Apt 22 Parkside Plaza",   age: "1 week ago" },
  { id: 4,  col: "Open",        title: "Leaking tap",             priority: "High",   assignee: { initials: "SK", color: "bg-emerald-600" }, name: "Steven Keane",     property: "Apt 5 City Square",       age: "1 week ago" },
  // In Progress
  { id: 5,  col: "In Progress",  title: "Broken window",           priority: "Medium", assignee: { initials: "KM", color: "bg-indigo-500" },  name: "Kevin Madden",     property: "Apt 5B Rosewood Close",   age: "4 days ago" },
  { id: 6,  col: "In Progress",  title: "Heating not working",     priority: "High",   assignee: { initials: "RS", color: "bg-sky-600" },     name: "Reginald Spencer", property: "Apt 21C Harbour View",    age: "1 week ago" },
  { id: 7,  col: "In Progress",  title: "Shower not draining",     priority: "Medium", assignee: { initials: "RS", color: "bg-sky-600" },     name: "Reginald Spencer", property: "Apt 21C Harbour View",    age: "1 week ago" },
  { id: 8,  col: "In Progress",  title: "Loose door handle",       priority: "Low",    assignee: { initials: "SK", color: "bg-teal-500" },    name: "Sarah Kelly",      property: "Apt 12 Grand Canal Dock", age: "2 weeks ago" },
  // Closed
  { id: 9,  col: "Closed",       title: "Bed replacement",         priority: "Medium", assignee: { initials: "EC", color: "bg-pink-500" },    name: "Emma Curran",      property: "Apt 7D Hanover Quay",     age: "4 days ago" },
  { id: 10, col: "Closed",       title: "Broken skirting board",   priority: "Low",    assignee: { initials: "PH", color: "bg-amber-600" },   name: "Peter Hughes",     property: "Apt 306 Fairview Road",   age: "2 weeks ago" },
  { id: 11, col: "Closed",       title: "Faulty light fitting",    priority: "Low",    assignee: { initials: "DB", color: "bg-violet-500" },  name: "Donal Byrne",      property: "Apt 104 Elmwood Grove",   age: "2 weeks ago" },
  { id: 12, col: "Closed",       title: "Damp patch on ceiling",   priority: "High",   assignee: { initials: "LB", color: "bg-cyan-600" },    name: "Leanne Byrne",     property: "Apt 104 Elmwood Grove",   age: "3 weeks ago" },
];

const STATUS_STYLE = {
  "Open":        "bg-slate-100 text-slate-600",
  "In Progress": "bg-amber-100 text-amber-700",
  "Closed":      "bg-teal-100 text-teal-700",
};

const PRIORITY_STYLE = {
  High:   "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low:    "bg-green-100 text-green-700",
};

export default function AdminMaintenancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requests, setRequests] = useState(REQUESTS);
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [costAmount, setCostAmount] = useState("");
  const [costVendor, setCostVendor] = useState("");
  const [costDate, setCostDate] = useState("");
  const [costs, setCosts] = useState({});

  // Load costs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("maintenanceCosts");
    if (stored) setCosts(JSON.parse(stored));
  }, []);

  // Save costs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("maintenanceCosts", JSON.stringify(costs));
  }, [costs]);

  const openCostModal = (requestId) => {
    setSelectedRequestId(requestId);
    const existing = costs[requestId];
    if (existing) {
      setCostAmount(existing.amount || "");
      setCostVendor(existing.vendor || "");
      setCostDate(existing.date || "");
    } else {
      setCostAmount("");
      setCostVendor("");
      setCostDate("");
    }
    setCostModalOpen(true);
  };

  const closeCostModal = () => {
    setCostModalOpen(false);
    setSelectedRequestId(null);
    setCostAmount("");
    setCostVendor("");
    setCostDate("");
  };

  const handleSaveCost = async (e) => {
    e.preventDefault();
    if (!costAmount || !costDate) {
      Swal.fire("Error", "Amount and Date are required", "error");
      return;
    }
    try {
      const newCosts = {
        ...costs,
        [selectedRequestId]: {
          amount: parseFloat(costAmount),
          vendor: costVendor,
          date: costDate,
          savedAt: new Date().toISOString(),
        },
      };
      setCosts(newCosts);
      Swal.fire({ icon: "success", title: "Cost saved!", timer: 2000, showConfirmButton: false });
      closeCostModal();
    } catch (err) {
      Swal.fire("Error", "Failed to save cost", "error");
    }
  };

  const getCostForRequest = (requestId) => costs[requestId];

  const uniqueProperties = Array.from(new Set(REQUESTS.map((r) => r.property))).slice(0, 50);

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.property.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.col === statusFilter;
    const matchProperty = propertyFilter === "All Properties" || r.property === propertyFilter;
    const matchPriority = priorityFilter === "All" || r.priority === priorityFilter;
    return matchSearch && matchStatus && matchProperty && matchPriority;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Maintenance</h1>
      </div>

      {/* New Request button and modal removed */}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[180px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tenant, issue or property…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
          <option>All Properties</option>
          {uniqueProperties.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
          <option value="All">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {/* three-dots removed per request */}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-800 text-sm">{r.title}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${PRIORITY_STYLE[r.priority]}`}>
                {r.priority}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full ${r.assignee.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {r.assignee.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                <p className="text-xs text-slate-400">{r.property}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <select value={r.col} onChange={(e) => setRequests(requests.map(req => req.id === r.id ? {...req, col: e.target.value} : req))} className="text-xs font-semibold px-2.5 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer" style={{backgroundColor: STATUS_STYLE[r.col].split(' ')[0], color: STATUS_STYLE[r.col].split(' ')[1]}}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <button onClick={() => openCostModal(r.id)} className="p-1.5 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md transition" title="Record cost">
                <Edit size={13} />
              </button>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={filtered.length} />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1"># <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">
                <span className="flex items-center gap-1">Issue </span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Tenant</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Property</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Reported</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Cost</th>
              <th className="px-4 py-3 text-right font-semibold text-base text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition">
                <td className="px-4 py-3 text-slate-400 font-mono text-sm">{String(r.id).padStart(3, "0")}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-base text-slate-800">{r.title}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${r.assignee.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {r.assignee.initials}
                    </div>
                    <span className="font-medium text-slate-700">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.property}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLE[r.priority]}`}>
                    {r.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select value={r.col} onChange={(e) => setRequests(requests.map(req => req.id === r.id ? {...req, col: e.target.value} : req))} className="text-xs font-semibold px-2.5 py-1 rounded-full border-0 focus:outline-none ring-1 ring-teal-400 cursor-pointer" style={{backgroundColor: STATUS_STYLE[r.col].split(' ')[0], color: STATUS_STYLE[r.col].split(' ')[1]}}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400">{r.age}</td>
                <td className="px-4 py-3">
                  {getCostForRequest(r.id) ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign size={13} className="text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-green-700">€{getCostForRequest(r.id).amount.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">No cost</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openCostModal(r.id)} className="w-9 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-300 hover:text-gray-800 text-teal-700 rounded-md transition" title="Record cost">
                    <Edit size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} />
      </div>

      {/* Record Cost Modal */}
      {costModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeCostModal} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 z-50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Record Maintenance Cost</h3>
                <p className="text-sm text-slate-500 mt-1">Add cost details for this maintenance request.</p>
              </div>
              <button aria-label="Close" onClick={closeCostModal} className="text-slate-500 hover:text-slate-700 text-lg">✕</button>
            </div>
            <form onSubmit={handleSaveCost} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costAmount}
                  onChange={(e) => setCostAmount(e.target.value)}
                  placeholder="e.g., 150.00"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vendor / Contractor</label>
                <input
                  type="text"
                  value={costVendor}
                  onChange={(e) => setCostVendor(e.target.value)}
                  placeholder="e.g., Local Plumber Ltd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={costDate}
                  onChange={(e) => setCostDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>
              <div className="flex items-center gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeCostModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Save Cost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
