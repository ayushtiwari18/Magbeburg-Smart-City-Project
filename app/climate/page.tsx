"use client";
import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { Thermometer, Loader2, CloudRain, Wind, Droplets } from "lucide-react";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

type MonthRow = {
  date: string;
  year: number;
  month: number;
  "TM": number | null;  // mean temp
  "RR": number | null;  // precipitation
  "FM": number | null;  // wind
};

export default function ClimatePage() {
  const [yearlyAvg, setYearlyAvg] = useState<{ year: number; temp: number; rain: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverY, setHoverY] = useState<{ year: number; temp: number; rain: number } | null>(null);

  useEffect(() => {
    fetch(`${RAW}/sensor-data/json/klima-monat.json`)
      .then(r => r.json())
      .then(d => {
        const rows: MonthRow[] = d.rows ?? [];
        // Group by year, compute annual avg temp + total rain
        const byYear: Record<number, { temps: number[]; rains: number[] }> = {};
        rows.forEach(r => {
          const y = new Date(r.date).getFullYear();
          if (y < 1950 || y > 2025) return; // limit to modern era for readability
          if (!byYear[y]) byYear[y] = { temps: [], rains: [] };
          if (r["TM"] !== null && r["TM"] !== undefined) byYear[y].temps.push(r["TM"]);
          if (r["RR"] !== null && r["RR"] !== undefined) byYear[y].rains.push(r["RR"]);
        });
        const result = Object.entries(byYear)
          .map(([y, v]) => ({
            year: Number(y),
            temp: v.temps.length ? v.temps.reduce((a, b) => a + b, 0) / v.temps.length : 0,
            rain: v.rains.reduce((a, b) => a + b, 0),
          }))
          .filter(r => r.temp !== 0)
          .sort((a, b) => a.year - b.year);
        setYearlyAvg(result);
      })
      .finally(() => setLoading(false));
  }, []);

  const minTemp = Math.min(...yearlyAvg.map(r => r.temp));
  const maxTemp = Math.max(...yearlyAvg.map(r => r.temp));
  const tempRange = maxTemp - minTemp || 1;

  const recent10 = yearlyAvg.slice(-10);
  const older10 = yearlyAvg.slice(0, 10);
  const recentAvg = recent10.length ? recent10.reduce((a, b) => a + b.temp, 0) / recent10.length : 0;
  const olderAvg = older10.length ? older10.reduce((a, b) => a + b.temp, 0) / older10.length : 0;
  const warming = recentAvg - olderAvg;

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <Container className="py-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Thermometer className="h-7 w-7 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">DWD Station 03126 · 1950–2025</p>
              <h1 className="text-3xl font-bold text-[#061B46]">Climate — Magdeburg</h1>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Warming Since 1950s</p>
                <p className={`mt-2 text-3xl font-bold tabular-nums ${warming > 0 ? "text-orange-600" : "text-blue-600"}`}>
                  {warming > 0 ? "+" : ""}{warming.toFixed(2)}°C
                </p>
                <p className="mt-1 text-sm text-slate-500">Recent 10y avg vs. earliest 10y</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Hottest Year on Record</p>
                <p className="mt-2 text-3xl font-bold text-[#061B46] tabular-nums">
                  {yearlyAvg.length ? yearlyAvg.reduce((a, b) => a.temp > b.temp ? a : b).year : "—"}
                </p>
                <p className="mt-1 text-sm text-slate-500">{yearlyAvg.length ? `${yearlyAvg.reduce((a, b) => a.temp > b.temp ? a : b).temp.toFixed(2)}°C avg` : ""}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Years of Data</p>
                <p className="mt-2 text-3xl font-bold text-[#061B46] tabular-nums">{yearlyAvg.length}</p>
                <p className="mt-1 text-sm text-slate-500">DWD Station 03126, Magdeburg</p>
              </div>
            </div>

            {/* Temperature trend chart */}
            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#061B46]">Annual Mean Temperature 1950–2025</h2>
                  <p className="text-sm text-slate-500 mt-1">Source: DWD Climate Data Center · klima-monat.json</p>
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
                  // Colour by temperature: cool blue → warm orange → hot red
                  const norm = (r.temp - minTemp) / tempRange;
                  const hue = Math.round(240 - norm * 200); // 240=blue, 40=orange-red
                  return (
                    <div
                      key={r.year}
                      className="flex-1 rounded-t cursor-pointer transition-opacity hover:opacity-70"
                      style={{
                        height: `${((r.temp - minTemp) / tempRange) * 90 + 10}%`,
                        background: `hsl(${hue}, 75%, 50%)`,
                      }}
                      onMouseEnter={() => setHoverY(r)}
                      onMouseLeave={() => setHoverY(null)}
                    />
                  );
                })}
              </div>
              {/* X-axis labels */}
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-slate-400">1950</span>
                <span className="text-[10px] text-slate-400">1975</span>
                <span className="text-[10px] text-slate-400">2000</span>
                <span className="text-[10px] text-slate-400">2025</span>
              </div>
              {/* Gradient legend */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-slate-400">{minTemp.toFixed(1)}°C</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "linear-gradient(to right, hsl(240,75%,50%), hsl(180,75%,50%), hsl(120,75%,50%), hsl(60,75%,50%), hsl(40,75%,50%))" }} />
                <span className="text-[10px] text-slate-400">{maxTemp.toFixed(1)}°C</span>
              </div>
            </div>

            {/* Recent decade table */}
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
                      const cityAvg = yearlyAvg.reduce((a, b) => a + b.temp, 0) / yearlyAvg.length;
                      const diff = r.temp - cityAvg;
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
    </div>
  );
}
