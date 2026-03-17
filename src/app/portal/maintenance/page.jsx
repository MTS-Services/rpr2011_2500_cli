"use client";

import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import { Eye, Search, ChevronDown, X } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const priorityColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

const statusColors = {
  "Open": "#f1f5f9",
  "In Progress": "#fef3c7",
  "Closed": "#d1fae5"
};

export default function MaintenancePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // CSS to hide scrollbars
  const hideScrollbarStyle = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `;

  // Helper: Map backend status to frontend
  const mapStatus = (backendStatus) => {
    const mapping = {
      "OPEN": "Open",
      "IN_PROGRESS": "In Progress",
      "CLOSED": "Closed"
    };
    return mapping[backendStatus] || backendStatus;
  };

  // Helper: Map backend priority to frontend
  const mapPriority = (backendPriority) => {
    return backendPriority.charAt(0) + backendPriority.slice(1).toLowerCase();
  };

  // Helper: Compute relative time
  const computeAge = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Fetch maintenance requests
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/landlord`
        );
        if (!response.ok) throw new Error("Failed to fetch maintenance");
        const result = await response.json();
        if (result.success && result.data) {
          const mapped = result.data.map((item) => ({
            id: item.id,
            property: item.property?.address || item.property?.name || "Unknown Property",
            issue: item.title,
            description: item.description,
            age: computeAge(item.createdAt),
            priority: mapPriority(item.priority),
            status: mapStatus(item.status),
            updated: computeAge(item.updatedAt),
            reportedBy: item.reportedBy?.user?.name || "Unknown"
          }));
          setItems(mapped);
        }
      } catch (error) {
        console.error("Error fetching maintenance:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load maintenance requests",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, [triggerFetch]);

  // Handle status change with API
  const handleStatusChange = async (itemId, newFrontendStatus) => {
    const statusMap = {
      "Open": "OPEN",
      "In Progress": "IN_PROGRESS",
      "Closed": "CLOSED"
    };

    const backendStatus = statusMap[newFrontendStatus];
    if (!backendStatus) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: backendStatus })
        }
      );

      if (!response.ok) throw new Error("Failed to update status");
      setItems(items.map(it => it.id === itemId ? {...it, status: newFrontendStatus} : it));
      Swal.fire({
        title: "Updated!",
        text: `Status changed to ${newFrontendStatus}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Failed to update status", "error");
      setTriggerFetch(prev => prev + 1);
    }
  };

  // Fetch maintenance details
  const handleViewDetails = async (itemId) => {
    try {
      setDetailsLoading(true);
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/${itemId}`
      );
      if (!response.ok) throw new Error("Failed to fetch details");
      const result = await response.json();
      if (result.success && result.data) {
        setSelectedDetails(result.data);
        setDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      Swal.fire("Error!", "Failed to load details", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      item.property.toLowerCase().includes(search.toLowerCase()) ||
      item.issue.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "All" || item.priority === priorityFilter;
    const matchStatus = statusFilter === "All" || item.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  if (loading) {
    return (
      <PortalShell>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading maintenance requests...</p>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <style>{hideScrollbarStyle}</style>
      <div className="mb-3 lg:mb-5">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Maintenance</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 lg:gap-3 mb-2 lg:mb-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search maintenance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
          />
        </div>

        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="pl-3 pr-7 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 transition shadow-sm"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-7 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 transition shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filtered.map((item) => (
            <div key={item.id} className="px-4 py-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.property}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.age}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${priorityColors[item.priority]}`}>{item.priority}</span>
              </div>
              <p className="text-sm text-slate-600">{item.issue}</p>
              <div className="flex items-center justify-between">
                <select value={item.status} onChange={(e) => handleStatusChange(item.id, e.target.value)} className="text-xs px-2.5 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer" style={{backgroundColor: statusColors[item.status], color: "#374151"}}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button onClick={() => handleViewDetails(item.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                <Eye size={13} /> View Details
              </button>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-4">Issue</th>
                <th className="text-left px-5 py-4">Priority</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-left px-5 py-4">Last Updated</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-base font-semibold text-slate-700">{item.property}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{item.age}</p>
                  </td>
                  <td className="px-4 py-4 text-base text-slate-600">{item.issue}</td>
                  <td className="px-5 py-5">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <select value={item.status} onChange={(e) => handleStatusChange(item.id, e.target.value)} className="text-sm px-3 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer" style={{backgroundColor: statusColors[item.status], color: "#374151"}}>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-400">{item.updated}</td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => handleViewDetails(item.id)} aria-label="View maintenance details" className="inline-flex items-center justify-center px-3 py-2 bg-[#f0fdfa] text-gray-800 rounded-lg transition hover:bg-teal-100">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          total={filtered.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Details Modal */}
      {detailsOpen && selectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/35" onClick={() => setDetailsOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg z-50 overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Maintenance Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Request information and current status</p>
              </div>
              <button 
                onClick={() => setDetailsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex items-center justify-center py-12 px-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Title</p>
                  <p className="text-sm text-slate-700 font-medium">{selectedDetails.title}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedDetails.description}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Property</p>
                  <p className="text-sm text-slate-700">{selectedDetails.property?.address || selectedDetails.property?.name || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Priority</p>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${priorityColors[mapPriority(selectedDetails.priority)]}`}>
                      {mapPriority(selectedDetails.priority)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full" style={{backgroundColor: statusColors[mapStatus(selectedDetails.status)], color: "#374151"}}>
                      {mapStatus(selectedDetails.status)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Reported By</p>
                  <p className="text-sm text-slate-700">{selectedDetails.reportedBy?.user?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{selectedDetails.reportedBy?.user?.email || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Created</p>
                    <p className="text-sm text-slate-700">{new Date(selectedDetails.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Updated</p>
                    <p className="text-sm text-slate-700">{new Date(selectedDetails.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedDetails.closedAt && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Closed</p>
                    <p className="text-sm text-slate-700">{new Date(selectedDetails.closedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setDetailsOpen(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
