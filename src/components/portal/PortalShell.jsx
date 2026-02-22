"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalAuth } from "@/context/PortalAuthContext";
import Sidebar from "@/components/portal/Sidebar";
import Topbar from "@/components/portal/Topbar";

export default function PortalShell({ children }) {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/portal/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <span className="w-8 h-8 border-2 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Layout */}
      <div className="flex w-full min-h-screen">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col flex-1 min-w-0">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="shrink-0 py-3 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
            © 2024 McCann &amp; Curran. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
