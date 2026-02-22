"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell, Mail, Globe, ChevronDown, Menu, LogOut } from "lucide-react";

import { usePortalAuth } from "@/context/PortalAuthContext";
import { useState } from "react";


export default function Topbar({ onMenuClick }) {
  const { user, logout } = usePortalAuth();
  const router = useRouter();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/portal/login");
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 shrink-0">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 text-slate-500 hover:text-slate-800"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right icons */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="p-1.5 text-slate-500 hover:text-slate-800 relative">
          <Bell size={18} />
        </button>
        <button className="p-1.5 text-slate-500 hover:text-slate-800">
          <Mail size={18} />
        </button>
        <button className="p-1.5 text-slate-500 hover:text-slate-800">
          <Globe size={18} />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className="flex items-center gap-2 ml-1 hover:opacity-80 transition"
          >
            <Image
              src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt={user?.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {user?.name}
            </span>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {dropOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
              <a
                href="/portal/profile"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setDropOpen(false)}
              >
                My Profile
              </a>
              <hr className="my-1 border-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
