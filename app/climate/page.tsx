"use client";
import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { Thermometer, Loader2, Droplets, Wind, TrendingUp, Calendar } from "lucide-react";

const RAW =
  "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

type MonthRow = {
  date: string;
  MO_TT: number | null;
  MO_RR: number | null;
  MO_FK: number | null;
  [key: string]: unknown;
};

type YearRow = {
  year: number;
  temp: number;
  rain: number;
};

export default function ClimatePage() {
  const [yearlyAvg, setYearlyAvg] = useState<YearRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [hoverY, setHoverY]       = useState<YearRow | null>(null);
  const [liveTime, setLiveTime]   = useState("");

  // Live clock
  useEffect(() => {
    const tick = () => setLiveTime(new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`${RAW}/sensor-data/json/klima-monat.json`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: { rows?: MonthRow[] }) => {
        const rows: MonthRow[] = d.rows ?? [];
        const byYear: Record<number, { temps: number[]; rains: number[] }> = {};
        rows.forEach(r => {
          const y = parseInt(r.date.slice(0, 4), 10);
          if (y < 1950 || y > 2025) return;
          if (!byYear[y]) byYear[y] = { temps: [], rains: [] };
          if (r.MO_TT !== null && r.MO_TT !== undefined) byYear[y].temps.push(r.MO_TT);
          if (r.MO_RR !== null && r.MO_RR !== undefined) byYear[y].rains.push(r.MO_RR);
        });
        const result: YearRow[] = Object.entries(byYear)
          .map(([y, v]) => ({
            year: Number(y),
            temp: v.temps.length ? v.temps.reduce((a, b) => a + b, 0) / v.temps.length : NaN,
            rain: v.rains.reduce((a, b) => a + b, 0),
          }))
          .filter(r => !isNaN(r.temp) && r.temp !== 0)
          .sort((a, b) => a.year - b.year);
        setYearlyAvg(result);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const temps    = yearlyAvg.map(r => r.temp);
  const minTemp  = temps.length ? Math.min(...temps) : 0;
  const maxTemp  = temps.length ? Math.max(...temps) : 1;
  const tempRange = maxTemp - minTemp || 1;

  const recent10  = yearlyAvg.slice(-10);
  const older10   = yearlyAvg.slice(0, 10);
  const recentAvg = recent10.length ? recent10.reduce((a, b) => a + b.temp, 0) / recent10.length : 0;
  const olderAvg  = older10.length  ? older10.reduce((a, b) => a + b.temp, 0) / older10.length   : 0;
  const warming   = recentAvg - olderAvg;

  const hottestYear = yearlyAvg.length ? yearlyAvg.reduce((a, b) => (a.temp > b.temp ? a : b)) : null;
  const cityAvgTemp = yearlyAvg.length ? yearlyAvg.reduce((a, b) => a + b.temp, 0) / yearlyAvg.length : 0;
  const totalRain   = yearlyAvg.length ? yearlyAvg.reduce((a, b) => a + b.rain, 0) / yearlyAvg.length : 0;

  const kpiTiles = [
    { Icon: Thermometer, val: warming !== 0 ? `${warming > 0 ? "+" : ""}${warming.toFixed(2)}°C` : "—", label: "Warming",         sub: "recent vs early 10y",  color: "#fb923c" },
    { Icon: Thermometer, val: hottestYear ? String(hottestYear.year) : "—",                              label: "Hottest Year",    sub: hottestYear ? `${hottestYear.temp.toFixed(1)}°C avg` : "", color: "#f87171" },
    { Icon: TrendingUp,  val: cityAvgTemp > 0 ? `${cityAvgTemp.toFixed(1)}°C` : "—",                    label: "Long-run Avg",   sub: "1950–2025 mean",      color: "#60a5fa" },
    { Icon: Droplets,    val: totalRain > 0 ? `${Math.round(totalRain)} mm` : "—",                       label: "Avg Rain/Year",  sub: "annual total",        color: "#34d399" },
    { Icon: Calendar,    val: String(yearlyAvg.length),                                                  label: "Years of Data",  sub: "DWD Station 03126",   color: "#c084fc" },
    { Icon: Wind,        val: minTemp > 0 ? `${minTemp.toFixed(1)}°C` : "—",                             label: "Coldest Avg",    sub: "lowest annual mean",  color: "#818cf8" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ── GLANCE BAR */}
      <div className="sticky top-0 z-40 bg-[#061B46] border-b border-white/10 shadow-xl">
        <div className="px-4 lg:px-8">
          {/* Top row */}
          <div className="flex items-center gap-4 py-2.5 border-b border-white/10">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                <Thermometer className="h-4 w-4 text-blue-300" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-300/70">Smart City Magdeburg</div>
                <div className="text-sm font-bold text-white leading-tight">Climate Dashboard</div>
              </div>
            </div>
            <div className="h-6 w-px bg-white/10 flex-shrink-0" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: "ping 1.5s ease-in-out infinite" }} />
              <span className="text-xs font-mono font-bold text-green-300">{liveTime || "—"}</span>
            </div>
            <div className="h-6 w-px bg-white/10 flex-shrink-0" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">DWD Station 03126 · Magdeburg · 1950–2025</span>
            {!loading && !error && (
              <span className="ml-auto text-[10px] text-green-400 font-semibold">{yearlyAvg.length} years loaded ✓</span>
            )}
          </div>
          {/* KPI strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-white/10 py-0">
            {kpiTiles.map(k => (
              <div key={k.label} className="flex flex-col items-center justify-center py-3 px-2 text-center hover:bg-white/5 transition-colors cursor-default">
                <k.Icon size={12} color={k.color} className="mb-1 opacity-80" />
                <div className="text-xl font-bold tabular-nums text-white leading-tight">{k.val}</div>
                <div className="text-[10px] font-semibold text-white/60 mt-0.5">{k.label}</div>
                <div className="text-[9px] text-white/30">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Container className="py-8">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <p className="text-lg font-semibold">Could not load climate data</p>
            <p className="text-sm mt-1">Check network access to raw.githubusercontent.com</p>
          </div>
        )}
        {!loading && !error && yearlyAvg.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <p className="text-lg font-semibold">No data rows found</p>
            <p className="text-sm mt-1">Verify column keys in klima-monat.json match MO_TT / MO_RR</p>
          </div>
        )}
        {!loading && !error && yearlyAvg.length > 0 && (
          <div className="space-y-8">
            {/* Temperature bar chart */}
            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#061B46]">Annual Mean Temperature 1950–2025</h2>
                  <p className="text-sm text-slate-500 mt-1">Source: DWD Climate Data Center · klima-monat.json (column: MO_TT)</p>
                </div>
                {hoverY && (
                  <div className="rounded-[14px] border border-slate-200 bg-white shadow p-3 text-xs">
                    <p className="font-bold text-[#061B46]">{hoverY.year}</p>
                    <p className="text-slate-600">Mean Temp: <strong>{hoverY.temp.toFixed(2)}°C</strong></p>
                    <p className="text-slate-600">Total Rain: <strong>{hoverY.rain.toFixed(0)} mm</strong></p>
                  </div>
                )}
              </div>
              <div className="flex items-end gap-[2px]" style={{ height: 200 }}>
                {yearlyAvg.map(r => {
                  const norm = (r.temp - minTemp) / tempRange;
                  const hue  = Math.round(240 - norm * 200);
                  return (
                    <div
                      key={r.year}
                      className="flex-1 rounded-t cursor-pointer transition-opacity hover:opacity-70"
                      style={{ height: `${norm * 90 + 10}%`, background: `hsl(${hue}, 75%, 50%)` }}
                      onMouseEnter={() => setHoverY(r)}
                      onMouseLeave={() => setHoverY(null)}
                      title={`${r.year}: ${r.temp.toFixed(2)}°C`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-slate-400">1950</span>
                <span className="text-[10px] text-slate-400">1975</span>
                <span className="text-[10px] text-slate-400">2000</span>
                <span className="text-[10px] text-slate-400">2025</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-slate-400">{minTemp.toFixed(1)}°C</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "linear-gradient(to right, hsl(240,75%,50%), hsl(180,75%,50%), hsl(120,75%,50%), hsl(60,75%,50%), hsl(40,75%,50%))" }} />
                <span className="text-[10px] text-slate-400">{maxTemp.toFixed(1)}°C</span>
              </div>
            </div>

            {/* Last 20 years table */}
            <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-[#061B46]">Last 20 Years</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Year</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Mean Temp (°C)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Total Rain (mm)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">vs. City Avg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...yearlyAvg].slice(-20).reverse().map(r => {
                      const diff = r.temp - cityAvgTemp;
                      return (
                        <tr key={r.year} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-bold text-[#061B46]">{r.year}</td>
                          <td className="px-4 py-3 tabular-nums text-right text-slate-700">{r.temp.toFixed(2)}</td>
                          <td className="px-4 py-3 tabular-nums text-right text-slate-700">{r.rain.toFixed(0)}</td>
                          <td className={`px-4 py-3 tabular-nums text-right font-semibold ${diff > 0 ? "text-orange-600" : "text-blue-600"}`}>
                            {diff > 0 ? "+" : ""}{diff.toFixed(2)}°C
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Container>

      <style>{`
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.85);opacity:0} }
      `}</style>
    </div>
  );
}
