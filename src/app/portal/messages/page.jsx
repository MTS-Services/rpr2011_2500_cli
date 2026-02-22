"use client";

import PortalShell from "@/components/portal/PortalShell";
import { Search } from "lucide-react";
import Image from "next/image";

const threads = [
  {
    name: "Stephen Blake",
    property: "Apt 306 Fairview Rd",
    age: "Apt 6 days ago",
    subject: "No Heating",
    preview: "Hi Joe. I've been having trouble with the heating lately. The heaters aren't turning on correctly. Can you send somn. nome noke to take look?",
    time: "30 minutes ago",
    unread: 1,
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Edward Martin",
    property: "Apt 104 Elmwood Grove",
    age: "15 days ago",
    subject: "Leaky Sink",
    preview: "Hi Joe. There's a leak under the kitchen sink that needs fixingz. It's dripping all one coboard space below.",
    time: "2 hours ago",
    unread: 2,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Adam Walsh",
    property: "Apt 104 Elmwood Grove",
    age: "6 days ago",
    subject: "RTB Registration",
    preview: "Hi Joe. Have you procsd the RTB registration for my tenancy yet? Thank you.",
    time: "2 days ago",
    unread: null,
    badge: "Red",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Kevin Madden",
    property: "Apt 5B Rosewood Close",
    age: "6 days ago",
    subject: "Rent Payment",
    preview: "Hi Joe. The payment for the month will be delayed. I should been t to you in a few days. Apologies for any inconvenience.",
    time: "3 days ago",
    unread: null,
    badge: "Red",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "Sarah Quinn",
    property: "Apt 306 Fairview Rd",
    age: "6 days ago",
    subject: "Vacating Property",
    preview: "Hi Joe. My partner ad e planning to vacate the property at the end of next month. We'll send a formal notice shortly. Thanks.",
    time: "6 days ago",
    unread: null,
    badge: "Red",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export default function MessagesPage() {
  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
        />
      </div>

      <div className="bg-white/90 rounded-xl border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-50">
          {threads.map((t, i) => (
            <div
              key={i}
              className="flex gap-4 px-5 py-4 hover:bg-slate-50/60 cursor-pointer transition-colors"
            >
              <Image
                src={t.avatar}
                alt={t.name}
                width={42}
                height={42}
                className="rounded-full object-cover w-[42px] h-[42px] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.property}</p>
                    <p className="text-xs text-slate-400">{t.age}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{t.time}</span>
                    {t.unread && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white text-[0.65rem] font-bold">
                        {t.unread}
                      </span>
                    )}
                    {t.badge && (
                      <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-red-400 text-white">
                        {t.badge}
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-slate-700 text-sm">{t.subject}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{t.preview}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            Rows per page:
            <select className="ml-1 border border-slate-200 rounded px-2 py-1 text-xs bg-white focus:outline-none">
              <option>10</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>1–5 of 6</span>
            <div className="flex gap-1">
              {["⏮","◀","▶","⏭"].map((a, k) => (
                <button key={k} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 text-xs">{a}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
