"use client";

import { useState, useRef, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Send } from "lucide-react";

const initialThread = [
  {
    from: "agency",
    name: "McCann & Corran",
    text: "Hi Joan, just to confirm the contractor visit for Apt 5B is scheduled for Feb 28th between 10am–1pm. Please ensure the tenant is aware.",
    time: "Feb 21, 2025 · 3:15 PM",
  },
  {
    from: "landlord",
    name: "Joan Doyle",
    text: "Thanks for confirming. I've let Kevin know. Please send over the invoice once the work is done.",
    time: "Feb 21, 2025 · 4:02 PM",
  },
  {
    from: "agency",
    name: "McCann & Corran",
    text: "Will do. We'll upload it to your documents section as well.",
    time: "Feb 21, 2025 · 4:20 PM",
  },
  {
    from: "landlord",
    name: "Joan Doyle",
    text: "What is the status of the RTB registration for Apt 22 Parkside Plaza?",
    time: "Feb 22, 2025 · 11:00 AM",
  },
  {
    from: "agency",
    name: "McCann & Corran",
    text: "The RTB registration for Apt 22 Parkside Plaza is currently Pending — we are waiting on the tenant's confirmation details. We'll update you as soon as it moves to Registered.",
    time: "Feb 22, 2025 · 11:45 AM",
  },
];

export default function LandlordMessagesPage() {
  const [thread, setThread] = useState(initialThread);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread]);

  function sendMessage() {
    if (!message.trim()) return;
    const now = new Date();
    const label = now.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" }) +
      " · " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setThread((prev) => [...prev, { from: "landlord", name: "Joan Doyle", text: message.trim(), time: label }]);
    setMessage("");
  }

  return (
    <PortalShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
        <p className="text-slate-500 mt-1 text-sm">Your conversation with McCann &amp; Corran</p>
      </div>

      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
        style={{ height: "calc(100vh - 220px)", minHeight: 480 }}
      >
        {/* Thread header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
            MC
          </div>
          <div>
            <p className="text-base font-bold text-slate-800">McCann &amp; Corran</p>
            <p className="text-xs text-teal-600 font-medium">Property Management · Online</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {thread.map((msg, i) => {
            const isLandlord = msg.from === "landlord";
            return (
              <div key={i} className={`flex gap-3 ${isLandlord ? "flex-row-reverse" : ""}`}>
                {!isLandlord && (
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0 mt-1">
                    MC
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col gap-1 ${isLandlord ? "items-end" : "items-start"}`}>
                  <p className="text-xs text-slate-400 px-1">{msg.name} · {msg.time}</p>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isLandlord
                      ? "bg-teal-600 text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-800 rounded-tl-sm"
                  }`}>
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 flex items-center justify-center text-white transition shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </PortalShell>
  );
}


