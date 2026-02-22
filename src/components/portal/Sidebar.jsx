"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderOpen,
  Wrench,
  MessageSquare,
  User,
} from "lucide-react";

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/portal/properties", label: "My Properties", Icon: Building2 },
  { href: "/portal/tenants", label: "Tenants", Icon: Users },
  { href: "/portal/documents", label: "Documents", Icon: FolderOpen },
  { href: "/portal/maintenance", label: "Maintenance", Icon: Wrench },
  { href: "/portal/messages", label: "Messages", Icon: MessageSquare, badge: 2 },
  { href: "/portal/profile", label: "Profile", Icon: User, badge: 3 },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-58 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "230px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <Image src="/logo.png" alt="McCann & Curran" width={34} height={34} />
          <span className="text-[0.95rem] font-bold text-slate-800 tracking-tight leading-tight">
            McCann &amp; Curran
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {navItems.map(({ href, label, Icon, badge }) => {
              const active = pathname === href || (href !== "/portal/dashboard" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                      active
                        ? "bg-teal-50 text-teal-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={17} className={active ? "text-teal-600" : "text-slate-400"} />
                    <span>{label}</span>
                    {badge && (
                      <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white text-[0.65rem] font-bold">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 text-[0.7rem] text-slate-400">
          © 2024 McCann &amp; Curran
        </div>
      </aside>
    </>
  );
}
