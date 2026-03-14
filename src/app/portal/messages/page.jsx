"use client";

import { useState, useRef, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Send, Search, ArrowLeft } from "lucide-react";

const CONVERSATIONS = [
  {
    id: 1,
    name: "McCann & Corran",
    type: "staff",
    avatar: "MC",
    avatar_bg: "bg-teal-100 text-teal-700",
    preview: "The RTB registration for Apt 22 Parkside Plaza is currently Pending…",
    unread: 0,
    messages: [
      { from: "agency", name: "McCann & Corran", text: "Hi Joan, just to confirm the contractor visit for Apt 5B is scheduled for Feb 28th between 10am–1pm. Please ensure the tenant is aware.", time: "Feb 21, 2025 · 3:15 PM" },
      { from: "landlord", name: "Joan Doyle", text: "Thanks for confirming. I've let Kevin know. Please send over the invoice once the work is done.", time: "Feb 21, 2025 · 4:02 PM" },
      { from: "agency", name: "McCann & Corran", text: "Will do. We'll upload it to your documents section as well.", time: "Feb 21, 2025 · 4:20 PM" },
      { from: "landlord", name: "Joan Doyle", text: "What is the status of the RTB registration for Apt 22 Parkside Plaza?", time: "Feb 22, 2025 · 11:00 AM" },
      { from: "agency", name: "McCann & Corran", text: "The RTB registration for Apt 22 Parkside Plaza is currently Pending — we are waiting on the tenant's confirmation details. We'll update you as soon as it moves to Registered.", time: "Feb 22, 2025 · 11:45 AM" },
    ],
  },
  {
    id: 2,
    name: "Kevin Madden",
    type: "tenant",
    property: "Apt 5B Rosewood Close",
    avatar: "KM",
    avatar_bg: "bg-blue-100 text-blue-700",
    preview: "I received your notice about the maintenance on Feb 28th",
    unread: 1,
    messages: [
      { from: "landlord", name: "Joan Doyle", text: "Hi Kevin, just a reminder — the contractor will visit on Feb 28th between 10am–1pm for the boiler. Please ensure access.", time: "Feb 26, 2025 · 9:00 AM" },
      { from: "tenant", name: "Kevin Madden", text: "I received your notice about the maintenance on Feb 28th. I'll be home to let them in.", time: "Feb 26, 2025 · 10:15 AM" },
    ],
  },
  {
    id: 3,
    name: "Emma Collins",
    type: "tenant",
    property: "Apt 22 Parkside Plaza",
    avatar: "EC",
    avatar_bg: "bg-pink-100 text-pink-700",
    preview: "Thanks for the update on the rent review timing",
    unread: 0,
    messages: [
      { from: "landlord", name: "Joan Doyle", text: "Hi Emma, just to let you know we will be conducting the rent review in May as per your lease terms.", time: "Feb 18, 2025 · 2:30 PM" },
      { from: "tenant", name: "Emma Collins", text: "Thanks for the update on the rent review timing. I appreciate the heads up.", time: "Feb 18, 2025 · 3:45 PM" },
    ],
  },
];

export default function LandlordMessagesPage() {
  const [convos, setConvos] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [showChat, setShowChat] = useState(false);
  const scrollRef = useRef(null);

  const active = convos.find((c) => c.id === activeId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, convos]);

  function sendMessage() {
    if (!text.trim()) return;
    const now = new Date();
    const label = now.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" }) + " · " +
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, preview: text.trim(), messages: [...c.messages, { from: "landlord", name: "Joan Doyle", text: text.trim(), time: label }] }
          : c
      )
    );
    setText("");
  }

  const filtered = convos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
        <p className="text-slate-500 mt-1 text-sm">Conversations with staff and tenants</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex" style={{ height: "calc(100vh - 200px)", minHeight: 520 }}>
        {/* Left: Conversation list */}
        <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 shrink-0 border-r border-slate-100 flex-col`}>
          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/30"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveId(c.id); setShowChat(true); }}
                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition ${c.id === activeId ? "bg-slate-50 border-l-2 border-teal-600" : "border-l-2 border-transparent"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${c.avatar_bg}`}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800 truncate text-sm">{c.name}</p>
                    {c.unread > 0 && <span className="shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">{c.unread}</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{c.type === "staff" ? "McCann & Corran Staff" : `Tenant • ${c.property}`}</p>
                  <p className="text-xs text-slate-500 truncate mt-1">{c.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat area */}
        <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0`}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 shrink-0">
            <button
              onClick={() => setShowChat(false)}
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-700"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${active?.avatar_bg}`}>
              {active?.avatar}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{active?.name}</p>
              <p className="text-xs text-teal-600 mt-0.5">{active?.type === "staff" ? "Property Management Staff" : `Tenant • ${active?.property}`}</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {active?.messages.map((msg, i) => {
              const isLandlord = msg.from === "landlord";
              return (
                <div key={i} className={`flex gap-3 ${isLandlord ? "flex-row-reverse" : ""}`}>
                  {!isLandlord && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${active.avatar_bg}`}>
                      {active.avatar}
                    </div>
                  )}
                  <div className={`max-w-[75%] flex flex-col gap-1 ${isLandlord ? "items-end" : "items-start"}`}>
                    <p className="text-xs text-slate-400 px-1">{msg.name} · {msg.time}</p>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isLandlord ? "bg-teal-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-800 rounded-tl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-3 shrink-0">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message…"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 flex items-center justify-center text-white transition shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}


