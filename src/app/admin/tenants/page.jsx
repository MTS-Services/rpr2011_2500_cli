"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import {
  Plus, ChevronDown, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, Eye, Edit, Trash
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import AddTenantModal from "./components/AddTenantModal";
import { addTenantToDirectory, loadDirectoryData, saveDirectoryData } from "@/utils/mockDirectoryStore";

const STATUS_STYLES = {
  Active: "bg-teal-100 text-teal-800 font-semibold",
  Notice: "bg-orange-100 text-orange-800 font-semibold",
};

export default function AdminTenantsPage() {
  const [selected, setSelected] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [countyFilter, setCountyFilter] = useState("All County/City");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const state = loadDirectoryData();
    setTenants(state.tenants || []);
  }, []);

  const statuses = ["All Statuses", "Active", "Notice"];
  const nextStatus = () =>
    setStatusFilter((cur) => statuses[(statuses.indexOf(cur) + 1) % statuses.length]);

  const uniqueSubs = Array.from(new Set(tenants.map((t) => t.sub))).slice(0, 50);
  const uniqueProperties = Array.from(new Set(tenants.map((t) => t.property))).slice(0, 50);

  const filtered = tenants.filter((t) => {
    const matchStatus = statusFilter === "All Statuses" || t.status === statusFilter;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.property.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.mobile.toLowerCase().includes(search.toLowerCase()) ||
      t.pps.toLowerCase().includes(search.toLowerCase());
    const matchCounty = countyFilter === "All County/City" || t.sub === countyFilter;
    const matchProperty = propertyFilter === "All Properties" || t.property === propertyFilter;
    return matchStatus && matchSearch && matchCounty && matchProperty;
  });

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const openAdd = () => setAddOpen(true);
  const closeAdd = () => setAddOpen(false);
  const handleAdd = (formData) => {
    const tenant = addTenantToDirectory(formData);
    setTenants((t) => [tenant, ...t]);
    closeAdd();
    alert('Tenant created');
  };

  const exportSelected = () => {
    const rows = tenants.filter((t) => selected.includes(t.id));
    if (rows.length === 0) { alert('No rows selected'); return; }
    const csv = ['Name,Email,Mobile,Property,Status'].concat(rows.map(r => `${r.name},${r.email},${r.mobile},${r.property},${r.status}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tenants.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const deleteSelected = () => {
    if (selected.length === 0) { alert('No rows selected'); return; }
    if (!confirm(`Delete ${selected.length} tenants?`)) return;
    const remaining = tenants.filter((x) => !selected.includes(x.id));
    setTenants(remaining);
    const state = loadDirectoryData();
    saveDirectoryData({ ...state, tenants: remaining });
    setSelected([]);
    alert('Deleted');
  };

  const openEdit = (t) => { setEditing(t); setEditOpen(true); };
  const closeEdit = () => { setEditing(null); setEditOpen(false); };
  const handleEdit = (updated) => {
    const nextTenants = tenants.map((x) => (x.id === updated.id ? { ...x, ...updated } : x));
    setTenants(nextTenants);
    const state = loadDirectoryData();
    saveDirectoryData({ ...state, tenants: nextTenants });
    closeEdit();
    alert('Saved');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Tenants</h1>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-white text-sm font-semibold rounded-lg shadow-sm transition" aria-label="Add new tenant">
          <Plus size={15} aria-hidden="true" /> <span className="hidden sm:inline">Add Tenant</span>
        </button>
      </div>

      {/* Breadcrumb
      <nav className="text-sm text-slate-400 flex items-center gap-1.5">
        <span className="hover:text-slate-600 cursor-pointer">Landlords</span>
        <span>/</span>
        <span className="text-slate-600 font-medium">Add Landlord</span>
      </nav> */}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={countyFilter} onChange={(e) => setCountyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer" aria-label="Filter by county or city">
          <option>All County/City</option>
          {uniqueSubs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer" aria-label="Filter by property">
          <option>All Properties</option>
          {uniqueProperties.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer" aria-label="Filter by status">
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex-1 min-w-[200px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenants…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            aria-label="Search tenants by name, email, phone, or PPS"
          />
        </div>
      </div>

      {/* Mobile cards — visible below lg */}
      <div className="lg:hidden space-y-3">
        {filtered.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${tenant.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {tenant.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-sm truncate">{tenant.name}</p>
                <p className="text-xs text-slate-600 truncate">{tenant.sub}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[tenant.status]}`}>{tenant.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2 col-span-2">
                <p className="text-xs text-slate-600 mb-0.5">Property</p>
                <p className="font-medium text-slate-900 truncate">{tenant.property}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-600 mb-0.5">Move-In</p>
                <p className="font-medium text-slate-900">{tenant.moveIn}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <Link href={`/admin/tenants/${tenant.id}`} aria-label={`View details for ${tenant.name}`} className="flex-1 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700 rounded-md transition text-xs gap-1 font-medium" title="View tenant details">
                <Eye size={14} aria-hidden="true" /> View
              </Link>
              <button aria-label={`Edit ${tenant.name}`} onClick={() => openEdit(tenant)} className="flex-1 h-9 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-600 rounded-md transition text-xs gap-1 font-medium" title="Edit tenant">
                <Edit size={14} aria-hidden="true" /> Edit
              </button>
              <button aria-label={`Delete ${tenant.name}`} onClick={() => {
                if (!confirm('Delete tenant?')) return;
                const nextTenants = tenants.filter((x) => x.id !== tenant.id);
                setTenants(nextTenants);
                const state = loadDirectoryData();
                saveDirectoryData({ ...state, tenants: nextTenants });
              }} className="flex-1 h-9 inline-flex items-center justify-center bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-600 rounded-md transition text-xs gap-1 font-medium" title="Delete tenant">
                <Trash size={14} aria-hidden="true" /> Delete
              </button>
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
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  aria-label="Select all tenants"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                <span className="flex items-center gap-1">Property <ArrowUpDown size={13} className="text-slate-500" aria-hidden="true" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                <span className="flex items-center gap-1">Move-In Date <ArrowUpDown size={13} className="text-slate-500" aria-hidden="true" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                <span className="flex items-center gap-1">Status <ArrowUpDown size={13} className="text-slate-500" aria-hidden="true" /></span>
              </th>
              <th className="w-28 px-4 py-3 text-right font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tenant) => (
              <tr
                key={tenant.id}
                className={`hover:bg-slate-50/70 transition ${selected.includes(tenant.id) ? "bg-teal-50/40" : ""}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(tenant.id)}
                    onChange={() => toggleRow(tenant.id)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    aria-label={`Select ${tenant.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${tenant.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {tenant.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{tenant.name}</p>
                      <p className="text-sm text-slate-600">{tenant.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-900 text-sm">{tenant.property}</td>
                <td className="px-4 py-3 text-slate-700 text-sm">{tenant.moveIn}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-sm font-semibold ${STATUS_STYLES[tenant.status]}`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/tenants/${tenant.id}`} aria-label={`View details for ${tenant.name}`} className="w-9 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700 rounded-md transition" title="View tenant details">
                      <Eye size={16} aria-hidden="true" />
                    </Link>
                    <button aria-label={`Edit ${tenant.name}`} onClick={() => openEdit(tenant)} className="w-9 h-9 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-600 rounded-md transition" title="Edit tenant">
                      <Edit size={16} aria-hidden="true" />
                    </button>
                    <button aria-label={`Delete ${tenant.name}`} onClick={() => {
                      if (!confirm('Delete tenant?')) return;
                      const nextTenants = tenants.filter((x) => x.id !== tenant.id);
                      setTenants(nextTenants);
                      const state = loadDirectoryData();
                      saveDirectoryData({ ...state, tenants: nextTenants });
                    }} className="w-9 h-9 inline-flex items-center justify-center bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-600 rounded-md transition" title="Delete tenant">
                      <Trash size={16} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} />
      </div>

      <AddTenantModal
        isOpen={addOpen}
        onClose={closeAdd}
        onSubmit={handleAdd}
      />
      {/* Edit modal */}
      {editOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-labelledby="editDialogTitle" aria-modal="true">
          <div className="fixed inset-0 bg-black/40" onClick={closeEdit} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 id="editDialogTitle" className="text-xl font-semibold text-slate-900">Edit Tenant</h3>
              </div>
              <button aria-label="Close modal" onClick={closeEdit} className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded">✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const f = e.target; handleEdit({ id: editing.id, name: f.name.value, email: f.email.value, mobile: f.mobile.value, property: f.property.value }); }} className="mt-4 space-y-3">
              <div>
                <label htmlFor="editName" className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                <input id="editName" name="name" defaultValue={editing.name} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="editEmail" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input id="editEmail" name="email" type="email" defaultValue={editing.email} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="editMobile" className="block text-sm font-medium text-slate-700 mb-1">Mobile</label>
                <input id="editMobile" name="mobile" type="tel" defaultValue={editing.mobile} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label htmlFor="editProperty" className="block text-sm font-medium text-slate-700 mb-1">Property</label>
                <input id="editProperty" name="property" defaultValue={editing.property} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex items-center gap-2 justify-end mt-4">
                <button type="button" onClick={closeEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white rounded-md font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
