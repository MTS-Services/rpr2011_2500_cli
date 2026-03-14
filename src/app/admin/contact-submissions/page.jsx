"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Search, Eye, Trash2, MessageSquare } from "lucide-react";

const INITIAL_SUBMISSIONS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "+353 87 456 7890",
    type: "landlord",
    message: "Hi, I'm interested in property management services for my 3-bed apartment in Dublin 6. Can you provide more information about your fees and tenant screening process?",
    date: "Mar 14, 2025 · 2:30 PM",
    read: false,
    responded: false,
  },
  {
    id: 2,
    name: "James O'Connor",
    email: "james.oconnor@email.com",
    phone: "+353 86 234 5678",
    type: "tenant",
    message: "I'm looking for a rental property in South Dublin, ideally a 2-bed with parking. I have good references and am ready to move in immediately.",
    date: "Mar 14, 2025 · 12:15 PM",
    read: true,
    responded: true,
  },
  {
    id: 3,
    name: "Emma Gallagher",
    email: "emma.gall@email.com",
    phone: "+353 85 123 4567",
    type: "valuation",
    message: "Would like a free property valuation for my house in Sandyford. It's a 4-bed detached, built in 1998. When could you arrange a viewing?",
    date: "Mar 13, 2025 · 4:45 PM",
    read: true,
    responded: false,
  },
  {
    id: 4,
    name: "Michael Brien",
    email: "m.brien@email.com",
    phone: "+353 87 654 3210",
    type: "landlord",
    message: "Looking to rent out my studio apartment. Need help with tenant screening and lease preparation. What's your turnaround time?",
    date: "Mar 13, 2025 · 11:20 AM",
    read: true,
    responded: true,
  },
  {
    id: 5,
    name: "Lisa Chen",
    email: "lisa.chen@email.com",
    phone: "+353 86 789 0123",
    type: "other",
    message: "General inquiry about your services. I'm new to Ireland and would like to understand the rental market better.",
    date: "Mar 12, 2025 · 3:00 PM",
    read: false,
    responded: false,
  },
];

const TYPE_COLORS = {
  landlord: "bg-purple-100 text-purple-700",
  tenant: "bg-teal-100 text-teal-700",
  valuation: "bg-blue-100 text-blue-700",
  other: "bg-slate-100 text-slate-600",
};

const TYPE_LABELS = {
  landlord: "Landlord Inquiry",
  tenant: "Tenant Inquiry",
  valuation: "Property Valuation",
  other: "Other",
};

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const selected = submissions.find((s) => s.id === selectedId);
  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.message.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  function markAsRead(id) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: true } : s))
    );
  }

  function markAsResponded(id) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, responded: !s.responded } : s))
    );
  }

  function deleteSubmission(id) {
    if (!confirm("Delete this submission?")) return;
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) {
      setShowDetails(false);
      setSelectedId(null);
    }
  }

  function openDetails(id) {
    setSelectedId(id);
    setShowDetails(true);
    markAsRead(id);
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Contact Submissions</h1>
          <p className="text-slate-500 mt-1 text-sm lg:text-base">Manage inquiries from your landing page contact form</p>
        </div>
        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-semibold text-sm">
            <Mail size={16} />
            {unreadCount} unread
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 lg:gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="All">All Types</option>
          <option value="landlord">Landlord Inquiry</option>
          <option value="tenant">Tenant Inquiry</option>
          <option value="valuation">Property Valuation</option>
          <option value="other">Other</option>
        </select>

        <div className="flex-1 min-w-[260px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Submissions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <Mail size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No submissions found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openDetails(s.id)}
                  className={`w-full text-left px-4 py-4 sm:px-5 sm:py-4 hover:bg-slate-50 transition ${!s.read ? "bg-blue-50/30" : ""} ${selectedId === s.id ? "bg-slate-50 border-l-2 border-teal-600" : "border-l-2 border-transparent"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-base lg:text-lg text-slate-800 truncate">{s.name}</p>
                        {!s.read && <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600"></span>}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{s.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_COLORS[s.type]}`}>
                          {TYPE_LABELS[s.type]}
                        </span>
                        {s.responded && (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-teal-100 text-teal-700">
                            Responded
                          </span>
                        )}
                        <span className="text-xs text-slate-400">{s.date}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit lg:sticky lg:top-4">
          {selectedId ? (
            <>
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare size={16} className="text-teal-600" />
                  Message Details
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Contact Info */}
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Name</p>
                  <p className="text-sm font-semibold text-slate-800">{selected?.name}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Email</p>
                  <a href={`mailto:${selected?.email}`} className="text-sm text-teal-600 hover:underline break-all">
                    {selected?.email}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Phone</p>
                  <a href={`tel:${selected?.phone}`} className="text-sm text-teal-600 hover:underline">
                    {selected?.phone}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Type</p>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[selected?.type]}`}>
                    {TYPE_LABELS[selected?.type]}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Date</p>
                  <p className="text-sm text-slate-600">{selected?.date}</p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Message</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">{selected?.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => markAsResponded(selectedId)}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg transition ${
                    selected?.responded
                      ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <MessageSquare size={14} />
                  {selected?.responded ? "Mark as Pending" : "Mark as Responded"}
                </button>
                <button
                  onClick={() => deleteSubmission(selectedId)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Eye size={24} className="mx-auto text-slate-300 mb-2 opacity-50" />
              <p className="text-sm">Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
