"use client";
import { useState, useMemo, useEffect } from "react";
import { Download, TrendingUp, Banknote, Wrench, Building2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// Default UI-only zero state: show 0 until backend provides real values
const ZERO_STAT_CARDS = [
  { label: "Total Rent Collected",  value: "€0", sub: "Year to date",      Icon: Banknote,   iconBg: "bg-teal-50",   iconColor: "text-teal-600",   trend: "0%" },
  { label: "Outstanding Balance",  value: "€0", sub: "Across 0 units",    Icon: TrendingUp,  iconBg: "bg-rose-50",   iconColor: "text-rose-500",  trend: "0%" },
  { label: "Maintenance Costs",    value: "€0", sub: "From recorded costs (0 items)", Icon: Wrench,  iconBg: "bg-orange-50", iconColor: "text-orange-500", trend: "0%" },
  { label: "Occupancy Rate",       value: "0%", sub: "0 properties",     Icon: Building2,   iconBg: "bg-sky-50",    iconColor: "text-sky-500",    trend: "0%" },
];

function _downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function CustomTooltip({ payload, monthRange }) {
  if (!payload || !payload.length) return null;
  const data = payload[0];
  const inRange = monthRange.wraps
    ? (data.payload.idx >= monthRange.startMonth || data.payload.idx <= monthRange.endMonth)
    : (data.payload.idx >= monthRange.startMonth && data.payload.idx <= monthRange.endMonth);
  const euro = (data.value * 1000).toLocaleString('en-IE');
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-800">{data.payload.month}</p>
      <p className={`text-base font-bold ${inRange ? 'text-teal-600' : 'text-slate-400'}`}>€{euro}</p>
      <p className="text-xs text-slate-500 mt-1">{inRange ? 'In range' : 'Outside range'}</p>
    </div>
  );
}

function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return `€${n.toLocaleString('en-IE')}`;
}

export default function AdminReportsPage() {
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(); d.setMonth(0, 1); d.setHours(0,0,0,0); return d.toISOString().slice(0,10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0,10));
  const [property, setProperty] = useState("All Properties");
  // Start with explicit zeros — do not show mocked values before backend responds
  const [statCards, setStatCards] = useState(ZERO_STAT_CARDS);
  const [rentData, setRentData] = useState(() => MONTHS.map((m, i) => ({ month: m, value: 0, idx: i, isFuture: false })));
  const [loading, setLoading] = useState(true);

  // Fetch API data
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/v1/admin/reports', { cache: 'no-store' });
        const json = await res.json();
        if (!mounted) return;
        if (json?.success && json.data) {
          const d = json.data;
          const apiCards = d.cards || {};
          const newCards = [
            {
              label: 'Total Rent Collected',
              value: formatCurrency(apiCards.rentCollected?.value ?? 0),
              sub: apiCards.rentCollected?.label ?? 'Year to date',
              Icon: Banknote,
              iconBg: 'bg-teal-50',
              iconColor: 'text-teal-600',
              trend: apiCards.rentCollected?.changePercent ? `${apiCards.rentCollected.changePercent > 0 ? '+' : ''}${apiCards.rentCollected.changePercent}%` : '0%',
            },
            {
              label: 'Outstanding Balance',
              value: formatCurrency(apiCards.outstandingBalance?.value ?? 0),
              sub: apiCards.outstandingBalance?.label ?? 'Across 0 units',
              Icon: TrendingUp,
              iconBg: 'bg-rose-50',
              iconColor: 'text-rose-500',
              trend: apiCards.outstandingBalance?.changePercent ? `${apiCards.outstandingBalance.changePercent > 0 ? '+' : ''}${apiCards.outstandingBalance.changePercent}%` : '0%',
            },
            {
              label: 'Maintenance Costs',
              value: formatCurrency(apiCards.maintenanceCosts?.value ?? 0),
              sub: apiCards.maintenanceCosts?.label ?? 'From recorded costs (0 items)',
              Icon: Wrench,
              iconBg: 'bg-orange-50',
              iconColor: 'text-orange-500',
              trend: apiCards.maintenanceCosts?.changePercent ? `${apiCards.maintenanceCosts.changePercent > 0 ? '+' : ''}${apiCards.maintenanceCosts.changePercent}%` : '0%',
            },
            {
              label: 'Occupancy Rate',
              value: '0%',
              sub: '0 properties',
              Icon: Building2,
              iconBg: 'bg-sky-50',
              iconColor: 'text-sky-500',
              trend: '0%',
            },
          ];

          setStatCards(newCards);

          if (Array.isArray(d.monthlyChart)) {
            const mapped = d.monthlyChart.map((m, i) => ({
              month: m.month,
              value: Number((m.collected / 1000).toFixed(1)),
              idx: i,
              isFuture: !!m.isFuture,
            }));
            setRentData(mapped);
          }
        }
      } catch (err) {
        console.error('Error loading reports API:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Load maintenance costs from localStorage and update stat cards (overrides maintenance card if present)
  useEffect(() => {
    const stored = localStorage.getItem("maintenanceCosts");
    if (stored) {
      try {
        const costs = JSON.parse(stored);
        const totalMaintenanceCost = Object.values(costs).reduce((sum, cost) => {
          const costDate = new Date(cost.date);
          const fromDateObj = new Date(fromDate);
          const toDateObj = new Date(toDate);
          if (costDate >= fromDateObj && costDate <= toDateObj) {
            return sum + (cost.amount || 0);
          }
          return sum;
        }, 0);

        setStatCards((prev) =>
          prev.map((card) =>
            card.label === "Maintenance Costs"
              ? {
                  ...card,
                  value: `€${totalMaintenanceCost.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  sub: `From recorded costs (${Object.keys(costs).length} items)`,
                }
              : card
          )
        );
      } catch (err) {
        console.error("Error loading maintenance costs:", err);
      }
    }
  }, [fromDate, toDate]);

  const properties = useMemo(() => ["All Properties", "Parkside Plaza", "Grand Dock", "Harbour View"], []);

  const monthRange = useMemo(() => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const startMonth = Math.max(0, Math.min(11, start.getMonth()));
    const endMonth = Math.max(0, Math.min(11, end.getMonth()));
    const wraps = startMonth > endMonth;
    return { startMonth, endMonth, wraps };
  }, [fromDate, toDate]);

  function handleExport() {
    const rows = [];
    rows.push(["Report Export", `Generated: ${new Date().toISOString()}`]);
    rows.push(["Filter", `Property: ${property}`, `From: ${fromDate}`, `To: ${toDate}`]);
    rows.push([]);
    rows.push(["Metric", "Value", "Notes"]);
    statCards.forEach((s) => rows.push([s.label, s.value, s.sub]));
    rows.push([]);
    rows.push(["Month", "Value (€)"]);
    rentData.forEach((r) => {
      const i = r.idx;
      const inRange = monthRange.wraps
        ? (i >= monthRange.startMonth || i <= monthRange.endMonth)
        : (i >= monthRange.startMonth && i <= monthRange.endMonth);
      if (inRange) rows.push([r.month, Number((r.value * 1000).toFixed(0))]);
    });
    _downloadCSV("reports_export.csv", rows);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Reports</h1>
          <p className="text-base text-slate-500 mt-0.5">View and export system-wide financial and occupancy reports</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-slate-500 leading-tight">{s.label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                <s.Icon size={18} className={s.iconColor} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{s.sub}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                (s.trend || '').toString().startsWith("+") ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-500"
              }`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart - Enhanced */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Monthly Rent Collected</h2>
            <p className="text-sm text-slate-400 mt-1">Figures in thousands (€000s) • Teal bars = selected range</p>
          </div>
        </div>
        <div className="relative" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rentData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f0f4f8" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip monthRange={monthRange} />}
                cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={600} isAnimationActive>
                {rentData.map((r, i) => {
                  const inRange = monthRange.wraps
                    ? (i >= monthRange.startMonth || i <= monthRange.endMonth)
                    : (i >= monthRange.startMonth && i <= monthRange.endMonth);
                  return (
                    <Cell
                      key={`c-${i}`}
                      fill={inRange ? 'url(#colorGrad)' : '#f0f4f8'}
                      stroke={inRange ? '#0f766e' : '#cbd5e1'}
                      strokeWidth={inRange ? 1 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

