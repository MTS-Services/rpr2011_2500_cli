"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Search, ArrowLeft, Plus, Copy, Check } from "lucide-react";

// Mock: All available tenants
const ALL_TENANTS = [
  { id: "tenant-1", name: "Sarah Kelly", initials: "SK", color: "bg-teal-100 text-teal-700", property: "Apt 39 Grand Canal Dock" },
  { id: "tenant-2", name: "Kevin Madden", initials: "KM", color: "bg-indigo-100 text-indigo-700", property: "Apt 5B Rosewood Close" },
  { id: "tenant-3", name: "Adam Walsh", initials: "AW", color: "bg-orange-100 text-orange-700", property: "Apt 65 Southern Cross" },
  { id: "tenant-4", name: "Reginald Spencer", initials: "RS", color: "bg-sky-100 text-sky-700", property: "Apt 21C Harbour View" },
  { id: "tenant-5", name: "Steven Keane", initials: "SK", color: "bg-emerald-100 text-emerald-700", property: "Apt 5 City Square" },
  { id: "tenant-6", name: "Stephen Blake", initials: "SB", color: "bg-violet-100 text-violet-700", property: "Apt 30 Fairview Road" },
  { id: "tenant-7", name: "Holly Quigley", initials: "HQ", color: "bg-pink-100 text-pink-700", property: "Apt 22 Parkside Plaza" },
  { id: "tenant-8", name: "Peter Hughes", initials: "PH", color: "bg-amber-100 text-amber-700", property: "Apt 306 Fairview Road" },
];

// Mock: All available landlords
const ALL_LANDLORDS = [
  { id: "landlord-1", name: "Joan Doyle", initials: "JD", color: "bg-purple-100 text-purple-700", property: "Multiple properties" },
  { id: "landlord-2", name: "Edward O'Neill", initials: "EO", color: "bg-indigo-100 text-indigo-700", property: "Multiple properties" },
  { id: "landlord-3", name: "Leo Mohan", initials: "LM", color: "bg-orange-100 text-orange-700", property: "Multiple properties" },
  { id: "landlord-4", name: "Mark Sheehan", initials: "MS", color: "bg-sky-100 text-sky-700", property: "Multiple properties" },
  { id: "landlord-5", name: "Brendan Walsh", initials: "BW", color: "bg-emerald-100 text-emerald-700", property: "Multiple properties" },
  { id: "landlord-6", name: "Tony Brennan", initials: "TB", color: "bg-violet-100 text-violet-700", property: "Multiple properties" },
  { id: "landlord-7", name: "Emma Curran", initials: "EC", color: "bg-pink-100 text-pink-700", property: "Multiple properties" },
  { id: "landlord-8", name: "Zoe Finnegan", initials: "ZF", color: "bg-amber-100 text-amber-700", property: "Multiple properties" },
];

const CONVERSATIONS = [
  {
    id: 1,
    name: "Kevin Madden",
    role: "Tenant",
    property: "Apt 5B Rosewood Close",
    avatar_bg: "bg-teal-100 text-teal-700",
    preview: "Your rent review is scheduled for May 2025…",
    unread: 0,
    messages: [
      { from: "tenant", name: "Kevin Madden", text: "Hi, just a reminder that my February rent payment is overdue. Please arrange payment at your earliest convenience.", time: "Feb 6 · 9:15 AM" },
      { from: "admin", name: "McCann & Curran Realty", text: "Thank you Kevin, appreciated. A maintenance engineer will visit on Feb 24th between 10am–1pm.", time: "Feb 7 · 10:00 AM" },
      { from: "tenant", name: "Kevin Madden", text: "That works for me, I'll be home. Thanks for sorting that.", time: "Feb 7 · 10:22 AM" },
      { from: "admin", name: "McCann & Curran Realty", text: "Your rent review is scheduled for May 2025. We will be in touch with more details closer to the time.", time: "Feb 10 · 2:00 PM" },
    ],
  },
  {
    id: 2,
    name: "Joan Doyle",
    role: "Landlord",
    property: "Multiple properties",
    avatar_bg: "bg-purple-100 text-purple-700",
    preview: "The RTB registration for Apt 22 Parkside Plaza is currently Pending…",
    unread: 1,
    messages: [
      { from: "landlord", name: "Joan Doyle", text: "Please confirm the contractor visit date for Apt 5B.", time: "Feb 21 · 2:02 PM" },
      { from: "admin", name: "McCann & Curran Realty", text: "Hi Joan, the contractor is confirmed for Feb 28th, 10am–1pm.", time: "Feb 21 · 3:15 PM" },
      { from: "landlord", name: "Joan Doyle", text: "What is the status of the RTB registration for Apt 22 Parkside Plaza?", time: "Feb 22 · 11:00 AM" },
      { from: "admin", name: "McCann & Curran Realty", text: "The RTB registration for Apt 22 Parkside Plaza is currently Pending — we are waiting on the tenant's confirmation details.", time: "Feb 22 · 11:45 AM" },
    ],
  },
  {
    id: 3,
    name: "Kevin Madden",
    otherName: "Joan Doyle",
    role: "Landlord-Tenant",
    property: "Apt 5B Rosewood Close",
    avatar_bg: "bg-blue-100 text-blue-700",
    otherAvatar_bg: "bg-purple-100 text-purple-700",
    preview: "I received your notice about the maintenance on Feb 28th",
    unread: 0,
    messages: [
      { from: "landlord", name: "Joan Doyle", text: "Hi Kevin, just a reminder — the contractor will visit on Feb 28th between 10am–1pm for the boiler. Please ensure access.", time: "Feb 26 · 9:00 AM" },
      { from: "tenant", name: "Kevin Madden", text: "I received your notice about the maintenance on Feb 28th. I'll be home to let them in.", time: "Feb 26 · 10:15 AM" },
    ],
  },
  {
    id: 4,
    name: "Edward O'Neill",
    role: "Landlord",
    property: "Multiple properties",
    avatar_bg: "bg-indigo-100 text-indigo-700",
    preview: "Initial inquiry about RTB registration process",
    unread: 0,
    messages: [
      { from: "landlord", name: "Edward O'Neill", text: "What is the status of the RTB registration for Apt 25, Grand Dock?", time: "Feb 20 · 11:00 AM" },
      { from: "admin", name: "McCann & Curran Realty", text: "Hi Edward, status is Pending. We're awaiting the tenant details.", time: "Feb 20 · 2:30 PM" },
    ],
  },
  {
    id: 5,
    name: "Emma Collins",
    otherName: "Joan Doyle",
    role: "Landlord-Tenant",
    property: "Apt 22 Parkside Plaza",
    avatar_bg: "bg-pink-100 text-pink-700",
    otherAvatar_bg: "bg-purple-100 text-purple-700",
    preview: "Thanks for the update on the rent review timing",
    unread: 0,
    messages: [
      { from: "landlord", name: "Joan Doyle", text: "Hi Emma, just to let you know we will be conducting the rent review in May as per your lease terms.", time: "Feb 18 · 2:30 PM" },
      { from: "tenant", name: "Emma Collins", text: "Thanks for the update on the rent review timing. I appreciate the heads up.", time: "Feb 18 · 3:45 PM" },
    ],
  },
];

export default function AdminMessagesPage() {
  const [convos, setConvos]         = useState(CONVERSATIONS);
  const [activeId, setActiveId]     = useState(CONVERSATIONS[0].id);
  const [text, setText]             = useState("");
  const [search, setSearch]         = useState("");
  const [showChat, setShowChat]     = useState(false);
  const [startNewConvo, setStartNewConvo] = useState(false);
  const [copiedId, setCopiedId]     = useState(null);
  const scrollRef                   = useRef(null);

  const active = convos.find((c) => c.id === activeId);

  // Search results when starting new conversation
  const searchResults = startNewConvo && search.trim() 
    ? [
        ...ALL_TENANTS.filter(t => t.name.toLowerCase().includes(search.toLowerCase())),
        ...ALL_LANDLORDS.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
      ]
    : [];

  // Handle starting new conversation with a user
  const startConversation = (user) => {
    const roleLabel = ALL_TENANTS.some(t => t.id === user.id) ? "Tenant" : "Landlord";
    const newConvo = {
      id: Math.max(...convos.map(c => c.id), 0) + 1,
      name: user.name,
      userId: user.id,
      role: roleLabel,
      property: user.property,
      avatar_bg: user.color,
      preview: "Conversation started",
      unread: 0,
      messages: [],
    };
    setConvos(prev => [newConvo, ...prev]);
    setActiveId(newConvo.id);
    setStartNewConvo(false);
    setSearch("");
    setShowChat(true);
  };

  const copyToClipboard = (userId) => {
    navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeId, convos]);

  function sendMessage() {
    if (!text.trim()) return;
    const now = new Date();
    const label = now.toLocaleDateString("en-GB", { month: "short", day: "numeric" }) + " · " +
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, preview: text.trim(), messages: [...c.messages, { from: "admin", name: "Admin", text: text.trim(), time: label }] }
          : c
      )
    );
    setText("");
  }

  const filtered = !startNewConvo 
    ? convos.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.preview.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const roleBadge = (role) => {
    if (role === "Tenant") return "bg-teal-100 text-teal-700";
    if (role === "Landlord") return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700"; // Landlord-Tenant conversation
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-0.5">Respond to tenant and landlord enquiries</p>
      </div>

      {/* Chat shell */}
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex"
        style={{ height: "calc(100vh - 200px)", minHeight: 520 }}
      >
        {/* ── Left: conversation list ───────────────────────── */}
        <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 shrink-0 border-r border-slate-100 flex-col`}>
          {/* Header with New Message button */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-800">
              {startNewConvo ? "New Message" : "Messages"}
            </h2>
            <button
              onClick={() => {
                setStartNewConvo(!startNewConvo);
                setSearch("");
              }}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
              title={startNewConvo ? "Back to conversations" : "Start new conversation"}
            >
              {startNewConvo ? <ArrowLeft size={18} /> : <Plus size={18} />}
            </button>
          </div>

          {/* search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={startNewConvo ? "Search tenant/landlord…" : "Search conversations…"}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/30"
              />
            </div>
          </div>

          {/* list or search results */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {startNewConvo ? (
              // ── START NEW CONVERSATION: Show search results ──
              <>
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => startConversation(user)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${user.color}`}>
                        {user.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.property}</p>
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-600 cursor-pointer hover:bg-slate-200 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(user.id);
                          }}>
                          <span className="truncate">{user.id}</span>
                          {copiedId === user.id ? (
                            <Check size={12} className="shrink-0 text-teal-600" />
                          ) : (
                            <Copy size={12} className="shrink-0 opacity-50" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : search.trim() ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No users found for "{search}"
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400">
                    Type a name to search
                  </div>
                )}
              </>
            ) : (
              // ── NORMAL MODE: Show conversations ──
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setActiveId(c.id); setShowChat(true); }}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 text-left transition ${c.id === activeId ? "bg-slate-50 border-l-2 border-purple-500" : "border-l-2 border-transparent"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${c.avatar_bg}`}>
                    {c.role === "Landlord-Tenant" ? (
                      <div className="flex items-center gap-0.5">
                        <span className="text-xs">{c.name.split(" ").map((n) => n[0]).slice(0, 1).join("")}</span>
                        <span className="text-xs">{c.otherName.split(" ").map((n) => n[0]).slice(0, 1).join("")}</span>
                      </div>
                    ) : (
                      c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {c.role === "Landlord-Tenant" ? `${c.name} ↔ ${c.otherName}` : c.name}
                      </p>
                      {c.unread > 0 && (
                        <span className="shrink-0 w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{c.role}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{c.property}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{c.preview}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right: chat area ──────────────────────────────── */}
        <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0`}>
          {/* chat header */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 shrink-0">
            <button
              onClick={() => setShowChat(false)}
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} />
            </button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${active?.avatar_bg}`}>
              {active?.role === "Landlord-Tenant" ? (
                <div className="flex items-center gap-0.5">
                  <span className="text-xs">{active?.name.split(" ").map((n) => n[0]).slice(0, 1).join("")}</span>
                  <span className="text-xs">{active?.otherName.split(" ").map((n) => n[0]).slice(0, 1).join("")}</span>
                </div>
              ) : (
                active?.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {active?.role === "Landlord-Tenant" ? `${active?.name} ↔ ${active?.otherName}` : active?.name}
              </p>
              <p className="text-xs text-purple-600">{active?.role}</p>
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {active?.messages.map((m, i) => {
              const isAdmin = m.from === "admin";
              const isLandlord = m.from === "landlord";
              const displayBg = isAdmin ? "bg-slate-200 text-slate-600" : 
                               isLandlord ? active?.avatar_bg : 
                               "bg-teal-100 text-teal-700";
              return (
                <div key={i} className={`flex gap-3 ${isAdmin || isLandlord ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${displayBg}`}>
                    {isAdmin ? "AD" : isLandlord ? active?.name.split(" ").map((n) => n[0]).slice(0, 1).join("") : active?.name.split(" ").map((n) => n[0]).slice(0, 1).join("")}
                  </div>
                  <div className={`max-w-[68%] flex flex-col ${isAdmin || isLandlord ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAdmin ? "bg-purple-600 text-white rounded-tr-sm" : isLandlord ? "bg-slate-100 text-slate-700 rounded-tl-sm" : "bg-teal-100 text-teal-700 rounded-tl-sm"}`}>
                      {m.text}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 px-1">{m.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* compose */}
          <div className="px-5 py-3 border-t border-slate-100 shrink-0">
            <div className="flex items-end gap-3">
              <textarea
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={active?.role === "Landlord-Tenant" ? `Monitor conversation between ${active?.name} & ${active?.otherName}…` : `Message ${active?.name}…`}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition resize-none"
              />
              <button
                onClick={sendMessage}
                className="w-11 h-11 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
