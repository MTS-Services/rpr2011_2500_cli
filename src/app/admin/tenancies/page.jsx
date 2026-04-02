"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, CheckCircle2, Clock, CreditCard, Trash2
} from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/components/portal/Pagination";
import AddTenancyModal from "./components/AddTenancyModal";
import { authenticatedFetch } from "@/utils/authFetch";

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

const COLOR_PALETTE = [
  "bg-teal-500", "bg-orange-400", "bg-slate-500", "bg-sky-600",
  "bg-emerald-500", "bg-teal-700", "bg-slate-400", "bg-indigo-400",
  "bg-pink-400", "bg-violet-400"
];

// Transform API response to UI format
function transformTenancy(apiTenancy, colorIndex) {
  const tenant = apiTenancy.tenant || {};
  const property = apiTenancy.property || {};
  const landlord = apiTenancy.landlord || {};
  
  // Extract initials from tenant name
  const initials = (tenant.name || "?")
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  
  return {
    id: apiTenancy.id,
    propertyId: property.id || "",
    tenantId: tenant.id || "",
    initials,
    color: COLOR_PALETTE[colorIndex % COLOR_PALETTE.length],
    name: tenant.name || "Unknown Tenant",
    sub: `${property.name || "Unknown"} · ${property.county || ""}`,
    property: property.name || "Unknown",
    statusLet: apiTenancy.status === "ACTIVE" ? "Let" : "Notice",
    statusBadge: null,
    county: property.county || null,
    landlord: landlord.name || "Unknown",
    landlordSub: landlord.county || "",
    startDate: apiTenancy.startDate?.split("T")[0] || "",
    endDate: apiTenancy.endDate?.split("T")[0] || "",
    rent: `€${apiTenancy.rent}`,
    rtb: apiTenancy.rtbNumber || "N/A",
    rtbDate: apiTenancy.rtbRegistration?.split("T")[0] || null,
    rtbStatus: apiTenancy.rtbStatus || "Unknown",
    rtbReg: apiTenancy.rtbRegistration || null,
    rentReviewDate: apiTenancy.rentReviewDate?.split("T")[0] || null,
    rentStatus: apiTenancy.rentStatus || "Pending",
  };
}

function AdminTenanciesInner() {
  const [selected, setSelected] = useState([]);
  const [addTenancyModalOpen, setAddTenancyModalOpen] = useState(false);
  const [tenancies, setTenancies] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [propertyIdMap, setPropertyIdMap] = useState({}); // Map property names to IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [countyFilter, setCountyFilter] = useState("All County/City");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  // Local override map: { [tenancy.id]: "Paid" | "Overdue" | "Pending" }
  const [rentOverrides, setRentOverrides] = useState({});
  const getRentStatus = (t) => rentOverrides[t.id] ?? t.rentStatus;
  const markPaid = (id) => setRentOverrides((prev) => ({ ...prev, [id]: "Paid" }));
  // Local status override: { [tenancy.id]: string }
  const [statusOverrides, setStatusOverrides] = useState({});
  const getStatus = (t) => statusOverrides[t.id] ?? t.statusLet;
  const setStatus = (id, value) => setStatusOverrides((prev) => ({ ...prev, [id]: value }));

  // Fetch tenancies from API
  useEffect(() => {
    const fetchTenanciesAndTenants = async () => {
      try {
        setLoading(true);
        const [tenanciesResponse, usersResponse, propertiesResponse] = await Promise.all([
          authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies`
          ),
          authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?role=TENANT`
          ),
          authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties`
          ),
        ]);

        if (!tenanciesResponse.ok) {
          throw new Error(`Failed to fetch tenancies: ${tenanciesResponse.statusText}`);
        }

        const tenanciesData = await tenanciesResponse.json();
        if (tenanciesData.success && tenanciesData.data) {
          const transformed = tenanciesData.data.map((tenancy, idx) =>
            transformTenancy(tenancy, idx)
          );
          setTenancies(transformed);
        }

        // Fetch all tenants from users endpoint
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData.success && usersData.data) {
            const allTenants = usersData.data
              .filter((user) => user.role === "TENANT")
              .map((user) => ({
                id: user.id,
                name: user.name,
                property: "", // No property directly from users endpoint
              }));
            setTenants(allTenants);
          }
        }

        // Fetch all available properties
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          if (propertiesData.success && propertiesData.data) {
            const propNames = propertiesData.data.map(prop => prop.name).filter(Boolean);
            setAvailableProperties(propNames);
            
            // Build map of property name to ID
            const idMap = {};
            propertiesData.data.forEach(prop => {
              if (prop.name && prop.id) {
                idMap[prop.name] = prop.id;
              }
            });
            setPropertyIdMap(idMap);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenanciesAndTenants();
  }, []);

  // Build status options from source data so we stay in sync
  const STATUS_OPTIONS = Array.from(new Set(tenancies.map((x) => x.statusLet).filter(Boolean)));
  const STATUS_VALUES = STATUS_OPTIONS.length > 0 ? STATUS_OPTIONS : ["Let", "Notice", "Active"];
  const uniqueCounties = Array.from(new Set(tenancies.map((t) => t.county).filter(Boolean))).slice(0, 50);
  const uniqueProperties = Array.from(new Set(tenancies.map((t) => t.property).filter(Boolean))).slice(0, 50);

  const handleAddTenancy = async (formData) => {
    try {
      // Map form data to backend format
      const statusMap = { "Let": "ACTIVE", "Notice": "NOTICE", "Active": "ACTIVE" };
      
      // Parse rent value - remove currency symbols and spaces
      let rentValue = formData.rent;
      rentValue = rentValue.replace(/[€$,\s]/g, "");
      rentValue = parseInt(rentValue) || 0;
      
      const payload = {
        propertyId: formData.propertyId,
        tenantId: formData.tenantId,
        status: statusMap[formData.status] || "ACTIVE",
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        rent: rentValue,
        rentDueDay: parseInt(formData.rentDueDay) || 1,
        rentStatus: formData.rentStatus || "PAID",
        rtbNumber: formData.rtbNumber || null,
        rtbStatus: formData.rtbStatus || null,
        rtbRegistration: formData.rtbRegistration || null,
        rentReviewDate: formData.rentReviewDate || null,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create tenancy: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Add the new tenancy to the list
      if (data.success && data.data) {
        const newTenancy = transformTenancy(data.data, tenancies.length);
        setTenancies([newTenancy, ...tenancies]);
      }

      setAddTenancyModalOpen(false);

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Created!",
        text: "Tenancy has been created successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      return true;
    } catch (err) {
      console.error("Error adding tenancy:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to create tenancy. Please try again.",
      });
      return false;
    }
  };

  const handleDeleteTenancy = async (tenancyId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Delete Tenancy?",
      text: "Are you sure you want to delete this tenancy? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/${tenancyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete tenancy: ${response.statusText}`);
      }

      // Remove from local state after successful deletion
      setTenancies((prev) => prev.filter((t) => t.id !== tenancyId));

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Tenancy has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error deleting tenancy:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to delete tenancy. Please try again.",
      });
    }
  };

  const handleUpdateRentStatus = async (tenancyId, newStatus) => {
    try {
      const statusMap = {
        "Paid": "PAID",
        "Pending": "PENDING",
        "Overdue": "OVERDUE",
      };
      
      const apiStatus = statusMap[newStatus] || newStatus;
      
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/${tenancyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rentStatus: apiStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update rent status: ${response.statusText}`);
      }

      // Update local state
      setRentOverrides((prev) => ({ ...prev, [tenancyId]: newStatus }));

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Rent status updated to ${newStatus}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating rent status:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update rent status. Please try again.",
      });
    }
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
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading tenancies: {error}</p>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading tenancies...</p>
        </div>
      )}
      
      {!loading && !error && tenancies.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No tenancies found.</p>
        </div>
      )}
      
      {!loading && !error && tenancies.length > 0 && (
        <>
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
          </div>
      <div className="lg:hidden space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 text-sm truncate">{t.name}</p>
                  <p className="text-xs text-slate-400 truncate">{t.sub}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTenancy(t.id)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition flex-shrink-0"
                aria-label="Delete tenancy"
              >
                <Trash2 size={16} />
              </button>
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
                    if (v !== getRentStatus(t)) {
                      handleUpdateRentStatus(t.id, v);
                    }
                  }}
                  className="w-full max-w-xs rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
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
                <span className="flex items-center gap-1">County/City <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Landlord <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Rent</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Rent Status</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB Status</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Action</th>
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
                        if (v !== getRentStatus(t)) {
                          handleUpdateRentStatus(t.id, v);
                        }
                      }}
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-sm bg-white"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <button className={`px-3 py-1.5 text-white text-sm font-semibold rounded-md transition ${t.rtbStatus === "Notice"
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-teal-600 hover:bg-teal-700"
                    }`}>
                    {t.rtbStatus}
                  </button>
                </td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => handleDeleteTenancy(t.id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition"
                    aria-label="Delete tenancy"
                  >
                    <Trash2 size={16} />
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
        tenancies={tenancies}
        propertyMap={propertyIdMap}
        properties={availableProperties}
      />
        </>
      )}
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
