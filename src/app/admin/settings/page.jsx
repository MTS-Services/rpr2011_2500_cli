"use client";

import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

const STORAGE_KEY = "admin_settings_v1";

const DEFAULTS = {
  companyName: "McCann & Corran",
  contactEmail: "admin@example.com",
};

export default function AdminSettingsPage() {
  const [state, setState] = useState(DEFAULTS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  function update(k, v) {
    setState((s) => ({ ...s, [k]: v }));
    setDirty(true);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setDirty(false);
      alert("Settings saved (local only)");
    } catch (e) {
      alert("Failed to save settings");
    }
  }

  function cancel() {
    setState(DEFAULTS);
    setDirty(false);
  }

  return (
    <div className="min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-base text-slate-600">Manage account and system defaults</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={cancel} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition duration-200">
              <X size={16} /> Cancel
            </button>
            <button onClick={save} disabled={!dirty} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${dirty ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company & Contact Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition duration-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Company & Contact</h2>
              <div className="h-1 w-12 bg-teal-600 rounded-full mt-2"></div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">Company Name</label>
                <input 
                  value={state.companyName} 
                  onChange={(e) => update('companyName', e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">Contact Email</label>
                <input 
                  value={state.contactEmail} 
                  onChange={(e) => update('contactEmail', e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition" 
                />
              </div>
            </div>
          </div>

          {/* Auth & Security Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition duration-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Auth & Security</h2>
              <div className="h-1 w-12 bg-teal-600 rounded-full mt-2"></div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">Confirm Password</label>
                <input type="password" placeholder="Confirm password" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Roles & Permissions Section - Full Width */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition duration-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Roles & Permissions</h2>
            <p className="text-sm text-slate-600 mt-1">Quick mock of roles. Manage access in a real app via backend.</p>
            <div className="h-1 w-12 bg-teal-600 rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 transition duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-base">Admin</p>
                  <p className="text-sm text-slate-600 mt-1">Full access</p>
                </div>
                <button disabled className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 transition">Non-Editable</button>
              </div>
            </div>
            <div className="p-5 border border-slate-200 rounded-lg bg-slate-50  transition duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-base">Manager</p>
                  <p className="text-sm text-slate-600 mt-1">Limited admin</p>
                </div>
                <button disabled className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 transition">Non-Editable</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
