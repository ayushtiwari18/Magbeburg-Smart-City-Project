"use client";
import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { Home, Loader2, ChevronUp, ChevronDown } from "lucide-react";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

// Exact schema from data/mietspiegel-2024/README.en.md:
// key: "nettokaltmiete_pro_qm" (NOT "nettokaltmiete_m2")
type RentRow = {
  stadtteil: string;
  wohnflaechenklasse: string;
  year: number;
  nettokaltmiete_pro_qm: number | null;
  stichprobengroesse: number | null;
};

type Summary = {
  stadtteil: string;
  avg: number;
  min: number;
  max: number;
  category: string;
};

function badge(avg: number) {
  if (avg < 6)  return { label: "Affordable",    color: "bg-green-100 text-green-800" };
  if (avg < 8)  return { label: "Moderate",      color: "bg-yellow-100 text-yellow-800" };
  if (avg < 10) return { label: "Expensive",     color: "bg-orange-100 text-orange-800" };
  return             { label: "Very Expensive",  color: "bg-red-100 text-red-800" };
}

export default function HousingPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${RAW}/mietspiegel-2024/nach-wohnflaeche.json`)
      .then(r => r.json())
      .then((d) => {
        const rows: RentRow[] = d.rows ?? [];

        // Filter out null values (small sample sizes omitted by the source)
        const valid = rows.filter(r => r.nettokaltmiete_pro_qm != null);
        if (valid.length === 0) {
          setError("No rent data available");
          return;
        }

        // Use the latest year that has data
        const maxYear = Math.max(...valid.map(r => r.year));
        const latest = valid.filter(r => r.year === maxYear);

        // Group by stadtteil and compute min/avg/max
        const map: Record<string, number[]> = {};
        latest.forEach(r => {
          if (!map[r.stadtteil]) map[r.stadtteil] = [];
          map[r.stadtteil].push(r.nettokaltmiete_pro_qm!);
        });

        const result: Summary[] = Object.entries(map).map(([stadtteil, vals]) => {
          const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
          return {
            stadtteil,
            avg,
            min: Math.min(...vals),
            max: Math.max(...vals),
            category: badge(avg).label,
          };
        });

        setSummaries(result);
      })
      .catch(() => setError("Failed to load rent data"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = summaries
    .filter(s => s.stadtteil.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "asc" ? a.avg - b.avg : b.avg - a.avg);

  const avgCity = summaries.length
    ? summaries.reduce((a, b) => a + b.avg, 0) / summaries.length
    : 0;

  const maxAvg = Math.max(...summaries.map(s => s.avg), 1);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                <Home className="h-7 w-7 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Mietspiegel 2024 · Magdeburg</p>
                <h1 className="text-3xl font-bold text-[#061B46]">Rent Index by District</h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-widest">City Avg. (€/m²)</p>
              <p className="text-3xl font-bold text-[#061B46] tabular-nums">
                {avgCity > 0 ? `€${avgCity.toFixed(2)}` : "—"}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-slate-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Search district…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-56"
              />
              <button
                onClick={() => setSort(s => s === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                Price {sort === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <p className="text-sm text-slate-500">{filtered.length} of {summaries.length} districts</p>
            </div>

            {/* Bar chart overview */}
            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#061B46] mb-1">Avg. Net Cold Rent per m² — All Districts</h2>
              <p className="text-xs text-slate-500 mb-5">Source: Mietspiegel Magdeburg 2024 · nach-wohnflaeche.json</p>
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2">
                {[...summaries].sort((a, b) => b.avg - a.avg).map(s => {
                  const b = badge(s.avg);
                  const pct = (s.avg / maxAvg) * 100;
                  return (
                    <div key={s.stadtteil}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">{s.stadtteil}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.color}`}>{b.label}</span>
                          <span className="text-xs font-bold text-[#061B46] tabular-nums w-14 text-right">€{s.avg.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: s.avg >= 10 ? "#dc2626" : s.avg >= 8 ? "#ea580c" : s.avg >= 6 ? "#d97706" : "#16a34a" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sortable table */}
            <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-[#061B46]">District Rent Table</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">District</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Min €/m²</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Avg €/m²</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Max €/m²</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((s, i) => {
                      const b = badge(s.avg);
                      return (
                        <tr key={s.stadtteil} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 text-slate-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-[#061B46]">{s.stadtteil}</td>
                          <td className="px-4 py-3 tabular-nums text-slate-600 text-right">€{s.min.toFixed(2)}</td>
                          <td className="px-4 py-3 tabular-nums font-bold text-[#061B46] text-right">€{s.avg.toFixed(2)}</td>
                          <td className="px-4 py-3 tabular-nums text-slate-600 text-right">€{s.max.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.color}`}>{b.label}</span>
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
