"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, ChevronDown, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, Home, Users, Eye, Edit, Trash
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";
const COLOR_PALETTE = [
  "bg-teal-500", "bg-orange-400", "bg-slate-500", "bg-sky-600",
  "bg-emerald-500", "bg-teal-700", "bg-slate-400", "bg-indigo-400",
  "bg-pink-400", "bg-violet-400"
];

const LANDLORDS = [
  { id: 1, name: "Joan Doyle",      initials: "JD", color: "bg-teal-500",    sub: "Apt 28 Perkside Plaza",  properties: 12, tenants: 9,  mobile: "085-323-8927", pps: "3276513B",  pps2: "325-0305597", dob: "14 Mar 1972", email: "joan.doyle@email.com" },
  { id: 2, name: "Edward O'Neill",  initials: "EO", color: "bg-indigo-500",  sub: "Landlords",              properties: 9,  tenants: 9,  mobile: "087-830-5562", pps: "2215876M",  pps2: "329-L27656M", dob: "19 Aug 1970", email: "edward.oneill@email.com" },
  { id: 3, name: "Leo Mohan",       initials: "LM", color: "bg-orange-500",  sub: "Attarn Maien",           properties: 8,  tenants: 7,  mobile: "086-127-4503", pps: "4305567R",  pps2: "235-4005672", dob: "07 Jul 1970", email: "leo.mohan@email.com" },
  { id: 4, name: "Mark Sheehan",    initials: "MS", color: "bg-sky-600",     sub: "Brendan Walsh · 4G3",    properties: 7,  tenants: 7,  mobile: "084-157-8902", pps: "5992104N",  pps2: "598-2104N",  dob: "21 May 1969", email: "mark.sheehan@email.com" },
  { id: 5, name: "Brendan Walsh",   initials: "BW", color: "bg-emerald-600", sub: "brendan@mail.com",       properties: 7,  tenants: 7,  mobile: "085-385-5762", pps: "3382149B",  pps2: "685-3768336", dob: "12 Jan 1982", email: "brendan@mail.com" },
  { id: 6, name: "Tony Brennan",    initials: "TB", color: "bg-violet-500",  sub: "Laan Brennan",           properties: 7,  tenants: 5,  mobile: "085-229-5064", pps: "21630585",  pps2: "085-229-5056", dob: "13 Oct 1980", email: "tony.brennan@mail.com" },
  { id: 7, name: "Emma Curran",     initials: "EC", color: "bg-pink-500",    sub: "Emma Curran",            properties: 7,  tenants: 7,  mobile: "085-925-8367", pps: "2951066C",  pps2: "235-10986C", dob: "27 Mar 1977", email: "emma.curran@email.com" },
  { id: 8, name: "Zoe Finnegan",    initials: "ZF", color: "bg-amber-500",   sub: "Mark, Atarn@emai",       properties: 7,  tenants: 7,  mobile: "087-867-9893", pps: "1805949J",  pps2: "190-397-6902", dob: "22 Apr 1988", email: "zoe.finnegan@email.com" },
  { id: 9, name: "Zoe Finnegan",    initials: "ZF", color: "bg-rose-500",    sub: "Brianna",                properties: 7,  tenants: 7,  mobile: "086-480-3433", pps: "47268351",  pps2: "190-471-4927", dob: "10 Jun 1981", email: "mark.tron@email.com" },
];

export default function AdminLandlordsPage() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [landlords, setLandlords] = useState([]);
  const [countyFilter, setCountyFilter] = useState("All County/City");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const uniqueSubs = Array.from(new Set(landlords.map((l) => l.sub || l.address).filter(Boolean))).slice(0, 50);

  // Helper to show 'N/A' when a string is missing or empty
  const fmtString = (v) => {
    if (v === null || v === undefined) return "N/A";
    if (typeof v === "string" && v.trim() === "") return "N/A";
    return v;
  };

  // When using server-side pagination the API returns already filtered results.
  // `filtered` represents the currently loaded page of landlords.
  const filtered = landlords;

  // Debounce search input to avoid excessive requests
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [debouncedSearch, countyFilter]);

  // Ensure current page is valid when totals change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (currentPage > total) setCurrentPage(1);
  }, [totalItems, itemsPerPage]);

  // Fetch landlords from server with pagination
  useEffect(() => {
    const controller = new AbortController();

    const fetchLandlords = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", String(currentPage));
        params.append("limit", String(itemsPerPage));
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (countyFilter && countyFilter !== "All County/City") params.append("sub", countyFilter);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/role/LANDLORD?${params.toString()}`;
        const response = await authenticatedFetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch landlords");
        const result = await response.json();

        if (result.success && result.data) {
          const users = Array.isArray(result.data) ? result.data : (result.data.users || []);
          const pagination = result.meta?.pagination || result.data.pagination || {};

          const mapped = users.map((u, idx) => {
            const name = fmtString(u.name);
            const initials = ((u.name && u.name.trim()) ? u.name : 'NA')
              .split(' ')
              .map((p) => p[0] || '')
              .join('')
              .toUpperCase()
              .substring(0, 2);
            const properties = Number.isFinite(u.propertiesCount) ? u.propertiesCount : (u.profile?.propertiesManaged ?? 0);
            const tenants = Number.isFinite(u.tenantsCount) ? u.tenantsCount : (u.profile?.totalTenancies ?? 0);
            return {
              id: u.id,
              name,
              initials,
              color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
              sub: fmtString(u.address),
              address: fmtString(u.address),
              properties,
              tenants,
              mobile: fmtString(u.phone),
              dob: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
              email: fmtString(u.email),
            };
          });

          setLandlords(mapped);
          setTotalItems(pagination.totalItems ?? users.length ?? 0);
          setTotalPages(pagination.totalPages ?? Math.max(1, Math.ceil((pagination.totalItems ?? users.length ?? 0) / itemsPerPage)));
        } else {
          setLandlords([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching landlords:", err);
          Swal.fire({ title: "Error", text: "Failed to load landlords", icon: "error" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
    return () => controller.abort();
  }, [currentPage, itemsPerPage, debouncedSearch, countyFilter, triggerFetch]);

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const openAdd = () => setAddOpen(true);
  const closeAdd = () => setAddOpen(false);

  // Replace client-side mock add with server-backed registration
  const handleAddNewLandlord = async (newL) => {
    try {
      const payload = {
        ...newL,
        role: "LANDLORD",
      };

      const res = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create landlord (${res.status})`);
      }

      setAddOpen(false);
      await Swal.fire({
        title: "Success!",
        text: "Landlord created successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // trigger a reload of the landlords list
      setTriggerFetch((prev) => prev + 1);
    } catch (err) {
      console.error("Error creating landlord:", err);
      await Swal.fire({
        title: "Error!",
        text: `Failed to create landlord: ${err.message}`,
        icon: "error",
      });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleAddNewLandlord({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone") || formData.get("mobile"),
      address: formData.get("address") || formData.get("sub"),
      ppsNumber: formData.get("ppsNumber"),
      pps2: formData.get("pps2"),
      dateOfBirth: formData.get("dateOfBirth"),
    });
  };

  const openEdit = (l) => {
    setEditing({
      ...l,
      // keep edit inputs empty rather than showing 'N/A'
      mobile: l.mobile === 'N/A' ? '' : (l.mobile || ''),
      email: l.email === 'N/A' ? '' : (l.email || ''),
      sub: l.sub === 'N/A' ? '' : (l.sub || ''),
    });
    setEditOpen(true);
  };
  const closeEdit = () => { setEditing(null); setEditOpen(false); };
  
  const mapUserToRow = (u, prev = null, idx = 0) => {
    const name = fmtString(u.name);
    const initials = ((u.name && u.name.trim()) ? u.name : 'NA')
      .split(' ')
      .map((p) => p[0] || '')
      .join('')
      .toUpperCase()
      .substring(0, 2);
    const properties = Number.isFinite(u.propertiesCount) ? u.propertiesCount : (u.profile?.propertiesManaged ?? 0);
    const tenants = Number.isFinite(u.tenantsCount) ? u.tenantsCount : (u.profile?.totalTenancies ?? 0);
    return {
      id: u.id,
      name,
      initials,
      color: prev?.color ?? COLOR_PALETTE[idx % COLOR_PALETTE.length],
      sub: fmtString(u.address),
      address: fmtString(u.address),
      properties,
      tenants,
      mobile: fmtString(u.phone),
      dob: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
      email: fmtString(u.email),
    };
  };

  const handleEdit = async (updated) => {
    try {
      // Prepare payload mapping frontend field names to API
      const payload = {
        name: updated.name,
        email: updated.email,
        phone: updated.mobile || updated.phone || null,
        address: updated.sub || updated.address || null,
      };

      const res = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${updated.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to update user: ${res.status}`);
      }

      const result = await res.json();
      const user = result.data || result.data?.user || null;
      if (!user) {
        throw new Error(result.message || "Invalid response from server");
      }

      // Update local state, preserving existing color when available
      setLandlords((prev) => prev.map((l, i) => (l.id === updated.id ? mapUserToRow(user, l, i) : l)));

      await Swal.fire({ icon: "success", title: "Updated!", text: "Landlord updated successfully.", timer: 1800, showConfirmButton: false });
      closeEdit();
    } catch (err) {
      console.error("Error updating landlord:", err);
      await Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to update landlord" });
    }
  };

  const handleDelete = async (id) => {
    const choice = await Swal.fire({
      title: 'Delete landlord?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!choice.isConfirmed) return;

    try {
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete user (${res.status})`);
      }
      setLandlords((p) => p.filter(x => x.id !== id));
      setSelected((s) => s.filter(x => x !== id));
      await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Landlord deleted.', timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error('Error deleting landlord:', err);
      await Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to delete landlord' });
    }
  };

  const exportSelected = () => {
    const rows = landlords.filter((l) => selected.includes(l.id));
    if (rows.length === 0) {
      Swal.fire({
        title: 'No Selection',
        text: 'Please select rows to export',
        icon: 'info',
      });
      return;
    }
    const csv = ['Name,Email,Mobile,Properties,Tenants'].concat(rows.map(r => `${r.name},${r.email},${r.mobile},${r.properties},${r.tenants}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'landlords.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const deleteSelected = async () => {
    if (selected.length === 0) {
      Swal.fire({
        title: 'No Selection',
        text: 'Please select rows to delete',
        icon: 'info',
      });
      return;
    }

    const choice = await Swal.fire({
      title: `Delete ${selected.length} landlords?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!choice.isConfirmed) return;

    try {
      const promises = selected.map((id) => authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`, { method: 'DELETE' }));
      const results = await Promise.allSettled(promises);

      const successIds = results.map((r, idx) => (r.status === 'fulfilled' && r.value && r.value.ok ? selected[idx] : null)).filter(Boolean);
      const failedCount = results.length - successIds.length;

      setLandlords((p) => p.filter((l) => !successIds.includes(l.id)));
      setSelected([]);

      await Swal.fire({ icon: 'success', title: 'Delete complete', text: `${successIds.length} deleted, ${failedCount} failed`, timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error('Error deleting selected landlords:', err);
      await Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to delete selected landlords' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Landlords</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> <span className="hidden sm:inline">Add Landlord</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="relative max-w-xl">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full"
            />
          </div>
        </div>
        <select value={countyFilter} onChange={(e) => setCountyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
          <option>All County/City</option>
          {uniqueSubs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Mobile cards — visible below lg */}
      <div className="lg:hidden space-y-3">
        {filtered.map((landlord) => (
          <div key={landlord.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${landlord.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {landlord.initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{landlord.name}</p>
                <p className="text-xs text-slate-400 truncate">{landlord.sub}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Properties</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1"><Home size={12} className="text-slate-400" />{landlord.properties}</p>
              </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400 mb-0.5">Tenants</p>
                  <p className="font-semibold text-slate-700 flex items-center gap-1"><Users size={12} className="text-slate-400" />{landlord.tenants}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400 mb-0.5">Mobile</p>
                  <p className="font-medium text-slate-700">{landlord.mobile}</p>
                </div>
            </div>
            <p className="text-xs text-slate-400 truncate">{landlord.email}</p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <Link href={`/admin/landlords/${landlord.id}`} aria-label="View" className="flex-1 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md transition text-xs gap-1 font-medium">
                <Eye size={14} /> View
              </Link>
              <button aria-label="Edit" className="flex-1 h-9 inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md transition text-xs gap-1 font-medium">
                <Edit size={14} /> Edit
              </button>
              <button aria-label="Delete" className="flex-1 h-9 inline-flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition text-xs gap-1 font-medium">
                <Trash size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination
            total={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table — visible lg+ */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">
                <span className="flex items-center justify-center gap-1">Properties <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">
                <span className="flex items-center justify-center gap-1">Tenants <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Mobile</th>
              
              {/* Date of Birth column removed per UI update */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
              <th className="w-28 px-4 py-3 text-right font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((landlord) => (
              <tr
                key={landlord.id}
                className={`hover:bg-slate-50/70 transition ${selected.includes(landlord.id) ? "bg-teal-50/40" : ""}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(landlord.id)}
                    onChange={() => toggleRow(landlord.id)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${landlord.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {landlord.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{landlord.name}</p>
                      <p className="text-sm text-slate-400">{landlord.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="text-sm font-medium text-slate-700">{landlord.properties}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="text-sm font-medium text-slate-700">{landlord.tenants}</div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-700 text-sm">{landlord.mobile}</p>
                </td>
                
                {/* Date of Birth cell removed per UI update */}
                <td className="px-4 py-3 text-slate-400 text-sm">{landlord.email}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/landlords/${landlord.id}`} aria-label="View" className="w-9 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md transition">
                      <Eye size={16} />
                    </Link>
                      <button onClick={() => openEdit(landlord)} aria-label="Edit" className="w-9 h-9 inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md transition">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(landlord.id)} aria-label="Delete" className="w-9 h-9 inline-flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition">
                        <Trash size={16} />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-100 px-4 py-3">
          <Pagination
            total={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
      {/* Add / Edit modals */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeAdd} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Add Landlord</h3>
                <p className="text-sm text-slate-500 mt-1">Create a landlord.</p>
              </div>
              <button aria-label="Close" onClick={closeAdd} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="addName" className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                <input id="addName" name="name" placeholder="e.g., John Doe" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="addEmail" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input id="addEmail" name="email" type="email" placeholder="e.g., john@example.com" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="addPassword" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input id="addPassword" name="password" type="password" placeholder="e.g., SecurePass123!" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="addPhone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input id="addPhone" name="phone" type="tel" placeholder="e.g., +353 87 123 4567" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="addAddress" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input id="addAddress" name="address" placeholder="e.g., 123 Main Street, Dublin" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="addPpsNumber" className="block text-sm font-medium text-slate-700 mb-1">PPS Number</label>
                <input id="addPpsNumber" name="ppsNumber" placeholder="e.g., 1234567AB" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="addPps2" className="block text-sm font-medium text-slate-700 mb-1">PPS2</label>
                <input id="addPps2" name="pps2" placeholder="e.g., 7654321" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="addDateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                <input id="addDateOfBirth" name="dateOfBirth" type="date" placeholder="mm/dd/yyyy" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex items-center gap-2 justify-end mt-4">
                <button type="button" onClick={closeAdd} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white rounded-md font-medium">Add Landlord</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeEdit} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Edit Landlord</h3>
              </div>
              <button aria-label="Close" onClick={closeEdit} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const f=e.target; handleEdit({ id: editing.id, name: f.name.value, email: f.email.value, mobile: f.mobile.value, sub: f.sub.value }); }} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Full name</label>
                <input name="name" defaultValue={editing.name} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Email</label>
                <input name="email" defaultValue={editing.email} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Mobile</label>
                <input name="mobile" defaultValue={editing.mobile} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Sub / Town</label>
                <input name="sub" defaultValue={editing.sub} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div className="flex items-center gap-2 justify-end mt-4">
                <button type="button" onClick={closeEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
