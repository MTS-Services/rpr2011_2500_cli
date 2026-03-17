"use client";

import { useState, useEffect } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { Wrench, Plus, Clock, CheckCircle2, AlertCircle, X } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const statusIcon = {
  "In Progress": <Clock size={14} className="text-blue-600" />,
  "Resolved": <CheckCircle2 size={14} className="text-teal-600" />,
  "Open": <AlertCircle size={14} className="text-amber-600" />,
};

// Helper: Map API status to display status
const mapStatus = (apiStatus) => {
  const statusMap = {
    "OPEN": "Open",
    "IN_PROGRESS": "In Progress",
    "CLOSED": "Closed"
  };
  return statusMap[apiStatus] || apiStatus;
};

// Helper: Get status color
const getStatusColor = (status) => {
  const colors = {
    "Open": "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Closed": "bg-teal-100 text-teal-700"
  };
  return colors[status] || "bg-slate-100 text-slate-600";
};

// Helper: Map priority to display format
const mapPriority = (apiPriority) => {
  const priorityMap = {
    "LOW": "Low",
    "MEDIUM": "Medium",
    "HIGH": "High"
  };
  return priorityMap[apiPriority] || apiPriority;
};

// Helper: Get priority color
const getPriorityColor = (priority) => {
  const colors = {
    "High": "bg-red-100 text-red-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Low": "bg-slate-100 text-slate-600"
  };
  return colors[priority] || "bg-slate-100 text-slate-600";
};

export default function TenantMaintenancePage() {
  const { user } = usePortalAuth();
  const [showForm, setShowForm] = useState(false);
  const isReadOnly = user?.role?.toLowerCase() === "tenant";
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for new request
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "LOW"
  });
  const [submitting, setSubmitting] = useState(false);
  const [tenantProperty, setTenantProperty] = useState(null);

  // Fetch maintenance requests and properties from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch maintenance requests
        const requestsResponse = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/tenant`
        );
        if (!requestsResponse.ok) {
          throw new Error(`Failed to fetch requests: ${requestsResponse.statusText}`);
        }
        const requestsData = await requestsResponse.json();
        
        if (requestsData.success && requestsData.data) {
          // Transform API response to match UI format
          const transformed = requestsData.data.map((req) => ({
            id: req.id,
            title: req.title,
            desc: req.description,
            date: new Date(req.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            status: mapStatus(req.status),
            statusColor: getStatusColor(mapStatus(req.status)),
            priority: mapPriority(req.priority),
            priorityColor: getPriorityColor(mapPriority(req.priority)),
            apiStatus: req.status,
            propertyName: req.property?.name || "Unknown Property",
          }));
          setRequests(transformed);
          
          // Extract tenant's property (all requests should be for same property)
          if (requestsData.data.length > 0 && requestsData.data[0].property) {
            setTenantProperty(requestsData.data[0].property);
          }
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.warn("Error fetching data:", err);
        setError(err.message);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !tenantProperty) {
      Swal.fire("Validation Error", "Please fill all required fields", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        propertyId: tenantProperty.id
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to submit request: ${errorData || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        Swal.fire("Success", "Maintenance request submitted successfully", "success");
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          priority: "LOW"
        });
        setShowForm(false);
        
        // Refresh requests list
        const refreshResponse = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/tenant`
        );
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            const transformed = refreshData.data.map((req) => ({
              id: req.id,
              title: req.title,
              desc: req.description,
              date: new Date(req.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
              status: mapStatus(req.status),
              statusColor: getStatusColor(mapStatus(req.status)),
              priority: mapPriority(req.priority),
              priorityColor: getPriorityColor(mapPriority(req.priority)),
              apiStatus: req.status,
              propertyName: req.property?.name || "Unknown Property",
            }));
            setRequests(transformed);
          }
        }
      } else {
        throw new Error(data.message || "Failed to submit request");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <TenantShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 xl:mb-5 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Maintenance</h1>
          <p className="text-slate-500 mt-1 text-sm">Submit and track maintenance requests for your property</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus size={15} /> Report Issue
        </button>
      </div>

      {/* New Request Form (inline) */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">New Maintenance Request</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Property</label>
              <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50">
                {tenantProperty ? (
                  <p>{tenantProperty.name} - {tenantProperty.address}</p>
                ) : (
                  <p className="text-slate-400">Loading property...</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Issue Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g. Broken heating unit"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold rounded-lg transition"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600 font-medium">No maintenance requests found</p>
        </div>
      ) : (
        <>
          {/* Requests table (lg+) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Issue</th>
                <th className="text-left px-5 py-4">Submitted</th>
                <th className="text-left px-5 py-4">Priority</th>
                <th className="text-left px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Wrench size={17} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-700">{r.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5 max-w-xs truncate">{r.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">{r.date}</td>
                  <td className="px-5 py-5">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.priorityColor}`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    {isReadOnly ? (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.statusColor}`}>
                        {r.status}
                      </span>
                    ) : (
                      <select value={r.status} onChange={(e) => setRequests(requests.map(req => req.id === r.id ? {...req, status: e.target.value, statusColor: e.target.value === "Open" ? "bg-slate-100 text-slate-600" : e.target.value === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"} : req))} className={`text-xs font-semibold px-3 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer ${r.statusColor}`}>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Wrench size={17} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{r.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{r.desc}</div>
                    <div className="mt-2 text-xs text-slate-400">Submitted: {r.date}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.priorityColor}`}>{r.priority}</span>
                {isReadOnly ? (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.statusColor}`}>
                    {r.status}
                  </span>
                ) : (
                  <select value={r.status} onChange={(e) => setRequests(requests.map(req => req.id === r.id ? {...req, status: e.target.value, statusColor: e.target.value === "Open" ? "bg-slate-100 text-slate-600" : e.target.value === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"} : req))} className={`text-xs font-semibold px-2 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer ${r.statusColor}`}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </TenantShell>
  );
}
