"use client";
import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { BarChart3, TrendingUp, Euro, Loader2 } from "lucide-react";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

type TaxRow = {
  jahr: number;
  gewerbesteuer: number | null;
  "gemeindeanteil-an-der-einkommensteuer": number | null;
  "gemeindeanteil-an-der-umsatzsteuer": number | null;
  "grundsteuer-b-bis-2024": number | null;
  "grundsteuer-b-ab-2025-wohngrundstuecke": number | null;
  "grundsteuer-b-ab-2025-nichtwohngrundstuecke": number | null;
  hundesteuer: number | null;
  vergnuegungssteuer: number | null;
};

// Derived type used for the chart — all values are coerced to number (never null)
type HoverRow = {
  jahr: number;
  total: number;
  gewerbesteuer: number;
  einkommensteuer: number;
  umsatzsteuer: number;
};

function fmt(v: number) {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(0)}K`;
  return `€${v.toFixed(0)}`;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="relative h-full w-full flex items-end">
      <div
        className="w-full rounded-t-md transition-all duration-500"
        style={{ height: `${pct}%`, background: color, minHeight: 2 }}
      />
    </div>
  );
}

export default function InsightsPage() {
  const [rows, setRows] = useState<TaxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState<HoverRow | null>(null);

  useEffect(() => {
    fetch(`${RAW}/steuereinnahmen/json/steuereinnahmen-2010-2025.json`)
      .then(r => r.json())
      .then(d => {
        const sorted = [...d.rows].sort((a: TaxRow, b: TaxRow) => a.jahr - b.jahr);
        setRows(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalByYear: HoverRow[] = rows.map(r => ({
    jahr: r.jahr,
    total: (
      (r.gewerbesteuer ?? 0) +
      (r["gemeindeanteil-an-der-einkommensteuer"] ?? 0) +
      (r["gemeindeanteil-an-der-umsatzsteuer"] ?? 0) +
      (r["grundsteuer-b-bis-2024"] ?? 0) +
      (r["grundsteuer-b-ab-2025-wohngrundstuecke"] ?? 0) +
      (r["grundsteuer-b-ab-2025-nichtwohngrundstuecke"] ?? 0)
    ),
    gewerbesteuer: r.gewerbesteuer ?? 0,
    einkommensteuer: r["gemeindeanteil-an-der-einkommensteuer"] ?? 0,
    umsatzsteuer: r["gemeindeanteil-an-der-umsatzsteuer"] ?? 0,
  }));

  const maxTotal = Math.max(...totalByYear.map(r => r.total), 1);
  const latest = totalByYear[totalByYear.length - 1];
  const prev = totalByYear[totalByYear.length - 2];
  const growth = latest && prev ? ((latest.total - prev.total) / prev.total) * 100 : 0;

  const COLORS = {
    gewerbesteuer: "#2563eb",
    einkommensteuer: "#16a34a",
    umsatzsteuer: "#d97706",
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <Container className="py-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <BarChart3 className="h-7 w-7 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">City Data · Live from Datasources</p>
              <h1 className="text-3xl font-bold text-[#061B46]">City Insights</h1>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Tax Revenue (2025)</p>
                <p className="mt-2 text-3xl font-bold text-[#061B46] tabular-nums">{latest ? fmt(latest.total) : "—"}</p>
                <p className="mt-1 text-sm text-slate-500">All sources combined</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">YoY Growth</p>
                <p className={`mt-2 text-3xl font-bold tabular-nums ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
                </p>
                <p className="mt-1 text-sm text-slate-500">vs. previous year</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Gewerbesteuer (2025)</p>
                <p className="mt-2 text-3xl font-bold text-[#061B46] tabular-nums">{latest ? fmt(latest.gewerbesteuer) : "—"}</p>
                <p className="mt-1 text-sm text-slate-500">Business tax, largest share</p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#061B46]">Tax Revenue 2010–2025</h2>
                  <p className="text-sm text-slate-500 mt-1">Annual city tax income breakdown — Source: Landeshauptstadt Magdeburg</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(COLORS).map(([k, c]) => (
                    <span key={k} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="h-3 w-3 rounded-sm flex-shrink-0" style={{ background: c }} />
                      {k === "gewerbesteuer" ? "Business Tax" : k === "einkommensteuer" ? "Income Tax" : "Sales Tax"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chart area */}
              <div className="relative">
                {hover && (
                  <div className="absolute top-0 right-0 z-10 rounded-[14px] border border-slate-200 bg-white shadow-lg p-4 text-xs space-y-1 min-w-[180px]">
                    <p className="font-bold text-[#061B46] text-sm">{hover.jahr}</p>
                    <p className="text-slate-600">Business: <span className="font-semibold tabular-nums">{fmt(hover.gewerbesteuer)}</span></p>
                    <p className="text-slate-600">Income: <span className="font-semibold tabular-nums">{fmt(hover.einkommensteuer)}</span></p>
                    <p className="text-slate-600">Sales: <span className="font-semibold tabular-nums">{fmt(hover.umsatzsteuer)}</span></p>
                    <p className="font-bold text-[#061B46] border-t border-slate-100 pt-1 mt-1">Total: {fmt(hover.gewerbesteuer + hover.einkommensteuer + hover.umsatzsteuer)}</p>
                  </div>
                )}
                <div className="flex items-end gap-1.5" style={{ height: 260 }}>
                  {totalByYear.map(r => (
                    <div
                      key={r.jahr}
                      className="flex-1 flex flex-col gap-0.5 h-full cursor-pointer"
                      onMouseEnter={() => setHover(r)}
                      onMouseLeave={() => setHover(null)}
                    >
                      {/* Stacked bars */}
                      <div className="flex-1 flex flex-col justify-end gap-0.5">
                        <div
                          className="w-full rounded-t-md transition-all duration-500"
                          style={{
                            height: `${maxTotal > 0 ? (r.gewerbesteuer / maxTotal) * 100 : 0}%`,
                            background: COLORS.gewerbesteuer,
                            minHeight: 2,
                          }}
                        />
                        <div
                          className="w-full"
                          style={{
                            height: `${maxTotal > 0 ? (r.einkommensteuer / maxTotal) * 100 : 0}%`,
                            background: COLORS.einkommensteuer,
                            minHeight: 2,
                          }}
                        />
                        <div
                          className="w-full"
                          style={{
                            height: `${maxTotal > 0 ? (r.umsatzsteuer / maxTotal) * 100 : 0}%`,
                            background: COLORS.umsatzsteuer,
                            minHeight: 2,
                          }}
                        />
                      </div>
                      <p className="text-center text-[9px] text-slate-400 mt-1">{String(r.jahr).slice(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Raw table */}
            <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-[#061B46]">Year-by-Year Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Year</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Business Tax</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Income Tax</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Sales Tax</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Property Tax B</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...totalByYear].reverse().map(r => (
                      <tr key={r.jahr} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-[#061B46]">{r.jahr}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-700">{fmt(r.gewerbesteuer)}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-700">{fmt(r.einkommensteuer)}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-700">{fmt(r.umsatzsteuer)}</td>
                        <td className="px-4 py-3 tabular-nums text-slate-700">
                          {fmt(
                            (rows.find(x => x.jahr === r.jahr)?.["grundsteuer-b-bis-2024"] ?? 0) +
                            (rows.find(x => x.jahr === r.jahr)?.["grundsteuer-b-ab-2025-wohngrundstuecke"] ?? 0) +
                            (rows.find(x => x.jahr === r.jahr)?.["grundsteuer-b-ab-2025-nichtwohngrundstuecke"] ?? 0)
                          )}
                        </td>
                        <td className="px-4 py-3 tabular-nums font-bold text-[#061B46] text-right">{fmt(r.total)}</td>
                      </tr>
                    ))}
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
