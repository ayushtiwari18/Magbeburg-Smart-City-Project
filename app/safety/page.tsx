"use client";
import { useEffect, useState } from "react";
import {
  Shield, AlertTriangle, PhoneCall, MapPin, Users, X, Send,
  TrendingDown, Activity, Flame, ChevronRight
} from "lucide-react";
import {
  Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadialBarChart, RadialBar,
  PolarAngleAxis
} from "recharts";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

interface AccidentFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    UJAHR?: number; USTUNDE?: number; UWOCHENTAG?: number;
    UKATEGORIE?: number; UART?: number;
    IstFuss?: number; IstRad?: number; IstPKW?: number; IstKrad?: number;
  };
}
interface AccidentGeoJSON { type: string; features: AccidentFeature[]; }
interface KissRow { [key: string]: number | string | null; }
interface KissColumn { key: string; label: string | null; unit?: string; }
interface KissData { columns: KissColumn[]; rows: KissRow[]; }

const issueTypes = ["Broken Streetlight", "Suspicious Activity", "Road Hazard", "Vandalism", "Noise Complaint", "Other"];

const C = {
  blue:   "#2563eb", green:  "#16a34a", orange: "#ea580c", yellow: "#d97706",
  purple: "#7c3aed", teal:   "#0d9488",  red:    "#dc2626", cyan:   "#0891b2",
  muted:  "#64748b", text:   "#0f172a",
  bg: "#f8fafc", panel: "#ffffff", border: "#e2e8f0",
};

const TABS = [
  { id: "overview",   label: "\uD83D\uDEE1\uFE0F Overview" },
  { id: "trends",     label: "Accident Trends" },
  { id: "time",       label: "\u23F0 Time Patterns" },
  { id: "causes",     label: "\u26A0\uFE0F Causes" },
  { id: "severity",   label: "\uD83C\uDFAF Severity" },
  { id: "report",     label: "\uD83D\uDCDD Report Issue" },
];

function findColKey(columns: KissColumn[], ...tests: Array<(v: string) => boolean>): string | undefined {
  for (const test of tests) {
    const col = columns.find(c => test((c.key ?? "").toLowerCase()) || test((c.label ?? "").toLowerCase()));
    if (col) return col.key;
  }
  return undefined;
}

type TooltipPayload = { name: string; value: number; color: string };
const LightTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
      <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#64748b" }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#64748b" }}>{p.name}:</span>
          <strong style={{ color: p.color }}>{typeof p.value === "number" && p.value > 999 ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

function StatCard({ icon: Icon, value, label, sub, color = C.blue, delta }: {
  icon: React.ElementType; value: string; label: string; sub?: string; color?: string; delta?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden hover:shadow-md transition-shadow">
      <div style={{ position: "absolute", right: 12, top: 12, opacity: 0.08 }}><Icon size={32} color={color} /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
      {delta && <div style={{ fontSize: 11, color: delta.startsWith("+") ? C.green : C.red, marginTop: 2, fontWeight: 600 }}>{delta}</div>}
    </div>
  );
}

function ChartCard({ title, height = 280, children }: { title: string; height?: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: C.text }}>{title}</p>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, color = C.blue }: {
  icon: React.ElementType; title: string; subtitle: string; color?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}18`, border: `1.5px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{subtitle}</p>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", justifyContent: "flex-end" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ height: 14, background: "#f1f5f9", borderRadius: 6, animation: "pulse 1.5s infinite" }} />
      ))}
    </div>
  );
}

function NoData() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 13, color: "#94a3b8" }}>No data available</div>;
}

export default function Safety() {
  const [geo, setGeo] = useState<AccidentGeoJSON | null>(null);
  const [yearData, setYearData] = useState<{ year: number; total: number; killed: number; injured: number }[]>([]);
  const [hourData, setHourData] = useState<{ hour: number; count: number }[]>([]);
  const [weekdayData, setWeekdayData] = useState<{ day: string; count: number }[]>([]);
  const [causeData, setCauseData] = useState<{ cause: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [liveTime, setLiveTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", type: issueTypes[0], description: "" });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const tick = () => setLiveTime(new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [geoRes, yearRes, hourRes, weekRes, causeRes] = await Promise.allSettled([
          fetch(`${RAW}/Unfaelle/Magdeburg_Unfallatlas.geojson`).then(r => r.json()) as Promise<AccidentGeoJSON>,
          fetch(`${RAW}/kiss-md/json/verkehr/strassenverkehrsunfaelle-in-magdeburg-gesamt.json`).then(r => r.json()) as Promise<KissData>,
          fetch(`${RAW}/kiss-md/json/verkehr/verkehrsunfaelle-aufgeteilt-nach-uhrzeiten.json`).then(r => r.json()) as Promise<KissData>,
          fetch(`${RAW}/kiss-md/json/verkehr/verkehrsunfaelle-mit-sachschaden-nach-wochentagen.json`).then(r => r.json()) as Promise<KissData>,
          fetch(`${RAW}/kiss-md/json/verkehr/unfaelle-nach-ausgewaehlten-ursachen.json`).then(r => r.json()) as Promise<KissData>,
        ]);
        if (geoRes.status === "fulfilled") setGeo(geoRes.value);
        if (yearRes.status === "fulfilled") {
          const d = yearRes.value; const cols = d.columns ?? [];
          const yearCol  = findColKey(cols, v => v.includes("jahr"), v => v.includes("year")) ?? cols[0]?.key;
          const totalCol = findColKey(cols, v => v.includes("gesamt"), v => v.includes("unfaelle"), v => v.includes("total")) ?? cols[1]?.key;
          const killedCol  = findColKey(cols, v => v.includes("getoetet"), v => v.includes("kill"), v => v.includes("tot"));
          const injuredCol = findColKey(cols, v => v.includes("verletzt"), v => v.includes("injured"));
          if (yearCol && totalCol) {
            setYearData(d.rows.map(r => ({
              year: Number(r[yearCol]), total: Number(r[totalCol] ?? 0),
              killed: killedCol ? Number(r[killedCol] ?? 0) : 0,
              injured: injuredCol ? Number(r[injuredCol] ?? 0) : 0,
            })).filter(r => r.year >= 2010));
          }
        }
        if (hourRes.status === "fulfilled") {
          const d = hourRes.value; const cols = d.columns ?? [];
          const hourCol  = findColKey(cols, v => v.includes("uhr"), v => v.includes("stunde"), v => v.includes("hour")) ?? cols[0]?.key;
          const countCol = cols.find(c => c.key !== hourCol)?.key ?? cols[1]?.key;
          if (hourCol && countCol) setHourData(d.rows.map(r => ({ hour: Number(r[hourCol]), count: Number(r[countCol] ?? 0) })).sort((a, b) => a.hour - b.hour));
        }
        if (weekRes.status === "fulfilled") {
          const d = weekRes.value; const cols = d.columns ?? [];
          const dayCol = cols[0]?.key; const countCol = cols[1]?.key;
          if (dayCol && countCol) setWeekdayData(d.rows.map(r => ({ day: String(r[dayCol]), count: Number(r[countCol] ?? 0) })));
        }
        if (causeRes.status === "fulfilled") {
          const d = causeRes.value; const cols = d.columns ?? [];
          const yearCol  = findColKey(cols, v => v.includes("jahr"), v => v.includes("year")) ?? cols[0]?.key;
          const causeCol = findColKey(cols, v => v.includes("ursache"), v => v.includes("cause"));
          const countCol = cols.find(c => c.key !== yearCol && c.key !== causeCol)?.key ?? cols[cols.length - 1]?.key;
          if (yearCol) {
            const latestYear = Math.max(...d.rows.map(r => Number(r[yearCol])));
            const latestRows = d.rows.filter(r => Number(r[yearCol]) === latestYear);
            if (causeCol && countCol) {
              setCauseData(latestRows.map(r => ({ cause: String(r[causeCol]), count: Number(r[countCol] ?? 0) })).sort((a, b) => b.count - a.count).slice(0, 6));
            } else if (countCol) {
              const causeCols = cols.filter(c => c.key !== yearCol);
              if (latestRows.length > 0) setCauseData(causeCols.map(c => ({ cause: c.label ?? c.key, count: Number(latestRows[0][c.key] ?? 0) })).sort((a, b) => b.count - a.count).slice(0, 6));
            }
          }
        }
      } catch (e) { console.error("Safety fetch error", e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const features           = geo?.features ?? [];
  const totalAccidents     = features.length;
  const fatalities         = features.filter(f => f.properties.UKATEGORIE === 1).length;
  const serious            = features.filter(f => f.properties.UKATEGORIE === 2).length;
  const minor              = features.filter(f => f.properties.UKATEGORIE === 3).length;
  const cyclistInvolved    = features.filter(f => f.properties.IstRad === 1).length;
  const pedestrianInvolved = features.filter(f => f.properties.IstFuss === 1).length;

  const severityData = [
    { name: "Fatal",   value: fatalities, fill: C.red },
    { name: "Serious", value: serious,    fill: C.orange },
    { name: "Minor",   value: minor,      fill: C.yellow },
  ];

  const maxDay  = Math.max(...weekdayData.map(d => d.count), 1);
  const maxHour = Math.max(...hourData.map(d => d.count), 1);

  const hourGrid = Array.from({ length: 24 }, (_, h) => {
    const found = hourData.find(d => d.hour === h);
    return { h, count: found?.count ?? 0 };
  });

  const CAUSE_COLORS = [C.red, C.orange, C.yellow, C.blue, C.purple, C.cyan];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setSubmitted(true);
    setTimeout(() => { setModalOpen(false); setSubmitted(false); setForm({ name: "", location: "", type: issueTypes[0], description: "" }); }, 2200);
  };

  const GRID  = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginBottom: 24 };
  const GRID2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 };

  const kpiTiles = [
    { Icon: AlertTriangle, val: loading ? "—" : totalAccidents.toLocaleString(),      label: "Accidents",   sub: "2017–2024",    color: "#60a5fa" },
    { Icon: TrendingDown,  val: loading ? "—" : fatalities.toLocaleString(),           label: "Fatalities",  sub: "UKATEGORIE 1", color: "#f87171" },
    { Icon: Users,         val: loading ? "—" : cyclistInvolved.toLocaleString(),      label: "Cyclists",    sub: "IstRad = 1",   color: "#34d399" },
    { Icon: MapPin,        val: loading ? "—" : pedestrianInvolved.toLocaleString(),   label: "Pedestrians", sub: "IstFuss = 1",  color: "#fbbf24" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ── GLANCE BAR ── */}
      <div className="sticky top-0 z-40 bg-[#061B46] border-b border-white/10 shadow-xl">
        <div className="px-4 lg:px-8">
          <div className="flex items-center gap-4 py-2.5 border-b border-white/10">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                <Shield className="h-4 w-4 text-blue-300" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-300/70">Smart City Magdeburg</div>
                <div className="text-sm font-bold text-white leading-tight">Safety Dashboard</div>
              </div>
            </div>
            <div className="h-6 w-px bg-white/10 flex-shrink-0" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: "ping 1.5s ease-in-out infinite" }} />
              <span className="text-xs font-mono font-bold text-green-300">{liveTime || "—"}</span>
            </div>
            <div className="h-6 w-px bg-white/10 flex-shrink-0" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Unfallatlas · KISS-MD Verkehr · Statistisches Amt Magdeburg</span>
            <button
              onClick={() => setModalOpen(true)}
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Send size={11} /> Report Issue
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            {kpiTiles.map(k => (
              <div key={k.label} className="flex flex-col items-center justify-center py-3 px-2 text-center hover:bg-white/5 transition-colors cursor-default">
                <k.Icon size={12} color={k.color} />
                <div className="text-xl font-bold tabular-nums text-white leading-tight mt-1">{k.val}</div>
                <div className="text-[10px] font-semibold text-white/60 mt-0.5">{k.label}</div>
                <div className="text-[9px] text-white/30">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[108px] z-30 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: "11px 16px", fontSize: 12, fontWeight: active ? 700 : 500, background: "transparent", border: "none", borderBottom: active ? `2px solid ${C.blue}` : "2px solid transparent", color: active ? C.blue : C.muted, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      {mounted && (
        <div style={{ padding: "28px 24px", maxWidth: 1400, margin: "0 auto" }}>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              <SectionTitle icon={Shield} title="Safety at a Glance" subtitle="Snapshot 2017–2024 · Source: Unfallatlas Magdeburg (GeoJSON)" color={C.blue} />
              <div style={GRID}>
                <StatCard icon={AlertTriangle} value={loading ? "—" : totalAccidents.toLocaleString()}      label="Total Accidents"    sub="2017–2024"       color={C.blue} />
                <StatCard icon={TrendingDown}  value={loading ? "—" : fatalities.toLocaleString()}          label="Fatalities"         sub="UKATEGORIE = 1" delta="Most severe" color={C.red} />
                <StatCard icon={Flame}         value={loading ? "—" : serious.toLocaleString()}             label="Serious Injuries"   sub="UKATEGORIE = 2"  color={C.orange} />
                <StatCard icon={AlertTriangle} value={loading ? "—" : minor.toLocaleString()}               label="Minor Accidents"    sub="UKATEGORIE = 3"  color={C.yellow} />
                <StatCard icon={Users}         value={loading ? "—" : cyclistInvolved.toLocaleString()}     label="Cyclists Involved"  sub="IstRad = 1"      color={C.green} />
                <StatCard icon={MapPin}        value={loading ? "—" : pedestrianInvolved.toLocaleString()}  label="Pedestrians"        sub="IstFuss = 1"     color={C.purple} />
              </div>
              <div style={GRID2}>
                <ChartCard title="Accident Trend 2010–2024" height={260}>
                  {loading ? <Skeleton /> : yearData.length === 0 ? <NoData /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={yearData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.blue} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                        <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<LightTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
                        <Area type="monotone" dataKey="total" name="Total Accidents" stroke={C.blue} strokeWidth={2.5} fill="url(#gTotal)" isAnimationActive animationDuration={1000} />
                        <Line type="monotone" dataKey="killed" name="Fatalities" stroke={C.red} strokeWidth={2.5} dot={{ r: 3, fill: C.red }} isAnimationActive animationDuration={1200} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
                <ChartCard title="\uD83C\uDFAF Severity Breakdown" height={260}>
                  {loading ? <Skeleton /> : totalAccidents === 0 ? <NoData /> : (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={severityData} startAngle={90} endAngle={-270}>
                          <PolarAngleAxis type="number" domain={[0, totalAccidents]} tick={false} />
                          <RadialBar dataKey="value" background={{ fill: "#f1f5f9" }} isAnimationActive animationDuration={1000} cornerRadius={6} label={false} />
                          <Tooltip content={<LightTooltip />} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 4 }}>
                        {severityData.map(s => (
                          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.fill, display: "inline-block" }} />
                            <strong style={{ color: C.text }}>{s.value.toLocaleString()}</strong> {s.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ChartCard>
              </div>
            </>
          )}

          {/* ACCIDENT TRENDS */}
          {tab === "trends" && (
            <>
              <SectionTitle icon={Activity} title="Accident Trends 2010–2024" subtitle="Annual totals · Injuries · Fatalities · Source: KISS-MD Verkehr" color={C.blue} />
              <div style={GRID}>
                {yearData.length > 0 && (() => {
                  const latest = yearData.at(-1)!;
                  const prev   = yearData.at(-2);
                  const delta  = prev ? latest.total - prev.total : 0;
                  return (
                    <>
                      <StatCard icon={AlertTriangle} value={latest.total.toLocaleString()}   label={`Total ${latest.year}`}      delta={`${delta >= 0 ? "+" : ""}${delta} vs prev`} color={C.blue} />
                      <StatCard icon={TrendingDown}  value={latest.killed.toLocaleString()}  label={`Fatalities ${latest.year}`} color={C.red} />
                      <StatCard icon={Flame}         value={latest.injured.toLocaleString()} label={`Injured ${latest.year}`}    color={C.orange} />
                      <StatCard icon={Activity}      value={yearData[0].total.toLocaleString()} label={`Total ${yearData[0].year}`} sub="Earliest year" color={C.muted} />
                    </>
                  );
                })()}
              </div>
              <ChartCard title="Annual Accident Totals with Fatalities Overlay 2010–2024" height={300}>
                {loading ? <Skeleton /> : yearData.length === 0 ? <NoData /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={yearData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="gT2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.blue} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gInj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.cyan} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                      <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<LightTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
                      <Area type="monotone" dataKey="total"   name="Total Accidents" stroke={C.blue} strokeWidth={2.5} fill="url(#gT2)"  isAnimationActive animationDuration={1000} />
                      <Area type="monotone" dataKey="injured" name="Injured"          stroke={C.cyan} strokeWidth={2}   fill="url(#gInj)" isAnimationActive animationDuration={1100} />
                      <Line type="monotone" dataKey="killed"  name="Fatalities"       stroke={C.red}  strokeWidth={2.5} dot={{ r: 4, fill: C.red }} isAnimationActive animationDuration={1300} />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </>
          )}

          {/* TIME PATTERNS */}
          {tab === "time" && (
            <>
              <SectionTitle icon={Activity} title="Time-of-Day & Weekly Patterns" subtitle="When accidents happen · Source: KISS-MD Verkehr" color={C.purple} />
              <div style={GRID2}>
                <ChartCard title="\u23F0 Accidents by Hour of Day" height={270}>
                  {loading ? <Skeleton /> : hourData.length === 0 ? <NoData /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourData} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gHour" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.purple} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={C.purple} stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="hour" tick={{ fill: C.muted, fontSize: 10 }} tickLine={false}
                          tickFormatter={(h: number) => h % 6 === 0 ? `${String(h).padStart(2, "0")}h` : ""} />
                        <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<LightTooltip />} />
                        <Bar dataKey="count" name="Accidents" fill="url(#gHour)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
                <ChartCard title="\uD83D\uDCC5 Accidents by Weekday" height={270}>
                  {loading ? <Skeleton /> : weekdayData.length === 0 ? <NoData /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekdayData} layout="vertical" margin={{ top: 5, right: 16, left: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gDay" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={C.teal} stopOpacity={0.5} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
                        <Tooltip content={<LightTooltip />} />
                        <Bar dataKey="count" name="Accidents" fill="url(#gDay)" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={1000}>
                          {weekdayData.map((d, i) => (
                            <Cell key={i} fill={d.count === maxDay ? C.red : "url(#gDay)"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
              <ChartCard title="\uD83D\uDD25 24-Hour Accident Intensity Heatmap" height={200}>
                {loading ? <Skeleton /> : hourData.length === 0 ? <NoData /> : (
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 6 }}>
                      {hourGrid.map(({ h, count }) => {
                        const intensity = count / maxHour;
                        const bg = intensity > 0.75 ? C.red : intensity > 0.5 ? C.orange : intensity > 0.25 ? C.yellow : "#e2e8f0";
                        return (
                          <div key={h} title={`${String(h).padStart(2, "0")}:00 — ${count} accidents`}
                            style={{
                              aspectRatio: "1", borderRadius: 8, background: bg,
                              opacity: intensity < 0.05 ? 0.3 : 0.55 + intensity * 0.45,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, fontWeight: 700, color: intensity > 0.3 ? "#fff" : C.muted,
                              cursor: "default", transition: "transform 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "none")}
                          >
                            {String(h).padStart(2, "0")}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                      {[
                        { color: "#e2e8f0", label: "Low" },
                        { color: C.yellow,  label: "Medium" },
                        { color: C.orange,  label: "High" },
                        { color: C.red,     label: "Peak" },
                      ].map(l => (
                        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                          <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color, display: "inline-block" }} />
                          {l.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ChartCard>
            </>
          )}

          {/* CAUSES */}
          {tab === "causes" && (
            <>
              <SectionTitle icon={AlertTriangle} title="Top Accident Causes" subtitle="Latest year · Source: KISS-MD — unfaelle-nach-ausgewaehlten-ursachen" color={C.red} />
              {causeData.length > 0 && (
                <div style={GRID}>
                  {causeData.slice(0, 4).map((c, i) => (
                    <StatCard key={c.cause} icon={AlertTriangle} value={c.count.toLocaleString()} label={c.cause} color={CAUSE_COLORS[i % CAUSE_COLORS.length]} />
                  ))}
                </div>
              )}
              <ChartCard title="Top Accident Causes (latest year)" height={300}>
                {loading ? <Skeleton /> : causeData.length === 0 ? <NoData /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={causeData} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="cause" tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} width={140} />
                      <Tooltip content={<LightTooltip />} />
                      <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={900}>
                        {causeData.map((_, i) => <Cell key={i} fill={CAUSE_COLORS[i % CAUSE_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </>
          )}

          {/* SEVERITY */}
          {tab === "severity" && (
            <>
              <SectionTitle icon={Flame} title="Accident Severity Breakdown" subtitle="Fatal · Serious · Minor · Source: Unfallatlas GeoJSON (UKATEGORIE)" color={C.orange} />
              <div style={GRID}>
                <StatCard icon={TrendingDown}  value={loading ? "—" : fatalities.toLocaleString()}          label="Fatal Accidents"    sub="UKATEGORIE = 1" delta="Highest severity" color={C.red} />
                <StatCard icon={Flame}         value={loading ? "—" : serious.toLocaleString()}              label="Serious Injuries"   sub="UKATEGORIE = 2" color={C.orange} />
                <StatCard icon={AlertTriangle} value={loading ? "—" : minor.toLocaleString()}                label="Minor Accidents"    sub="UKATEGORIE = 3" color={C.yellow} />
                <StatCard icon={Activity}      value={loading ? "—" : `${((fatalities/Math.max(totalAccidents,1))*100).toFixed(1)}%`} label="Fatality Rate" sub="of all accidents" color={C.purple} />
              </div>
              <div style={GRID2}>
                <ChartCard title="\uD83C\uDFAF Severity Radial Chart" height={280}>
                  {loading ? <Skeleton /> : totalAccidents === 0 ? <NoData /> : (
                    <>
                      <ResponsiveContainer width="100%" height={220}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" data={severityData} startAngle={90} endAngle={-270}>
                          <PolarAngleAxis type="number" domain={[0, totalAccidents]} tick={false} />
                          <RadialBar dataKey="value" background={{ fill: "#f1f5f9" }} isAnimationActive animationDuration={1000} cornerRadius={6} label={false} />
                          <Tooltip content={<LightTooltip />} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 4 }}>
                        {severityData.map(s => (
                          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.fill, display: "inline-block" }} />
                            <strong style={{ color: C.text }}>{s.value.toLocaleString()}</strong>&nbsp;{s.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ChartCard>
                <ChartCard title="Severity Bar" height={280}>
                  {loading ? <Skeleton /> : totalAccidents === 0 ? <NoData /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={severityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 12 }} tickLine={false} />
                        <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<LightTooltip />} />
                        <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
                          {severityData.map((s, i) => <Cell key={i} fill={s.fill} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            </>
          )}

          {/* REPORT ISSUE */}
          {tab === "report" && (
            <>
              <SectionTitle icon={Send} title="Report a Safety Issue" subtitle="Help us keep Magdeburg safe · Reports are reviewed by the city team" color={C.blue} />
              <div className="bg-white rounded-xl border border-slate-200 p-6" style={{ maxWidth: 520 }}>
                {!submitted ? (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {([
                      { label: "Your Name", key: "name",     placeholder: "Max Mustermann" },
                      { label: "Location",  key: "location", placeholder: "e.g. Breiter Weg, Altstadt" },
                    ] as { label: string; key: "name" | "location"; placeholder: string }[]).map(f => (
                      <div key={f.key}>
                        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{f.label}</label>
                        <input required value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                          style={{ width: "100%", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 14px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Issue Type</label>
                      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                        style={{ width: "100%", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 14px", fontSize: 13, outline: "none" }}>
                        {issueTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Description</label>
                      <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe what you observed..."
                        style={{ width: "100%", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 14px", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }} />
                    </div>
                    <button type="submit"
                      style={{ borderRadius: 10, background: "#061B46", color: "#fff", border: "none", padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.blue)}
                      onMouseLeave={e => (e.currentTarget.style.background = "#061B46")}
                    >Submit Report</button>
                  </form>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 14 }}>&#x2705;</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Report Submitted!</div>
                    <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Thank you, {form.name}. Our team will review your report shortly.</p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 40 }}>
                <SectionTitle icon={Shield} title="Safety Initiatives" subtitle="Programmes powered by this data to keep Magdeburg safer" color={C.teal} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                  {[
                    { icon: AlertTriangle, color: C.blue,   title: "Smart Surveillance",  desc: "AI camera networks monitor public spaces 24/7 and alert emergency services in real time." },
                    { icon: PhoneCall,     color: C.green,  title: "Emergency Response",  desc: "SOS stations across the city connect citizens to services with one press." },
                    { icon: Activity,      color: C.purple, title: "Incident Analytics",  desc: "Unfallatlas heatmaps pinpoint hotspots and prioritise infrastructure investment." },
                    { icon: Users,         color: C.yellow, title: "Community Watch",     desc: "Citizens report safety concerns, building a collaborative network of awareness." },
                  ].map(item => (
                    <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.color}18`, border: `1.5px solid ${item.color}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <item.icon size={18} color={item.color} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.title}</div>
                      <p style={{ marginTop: 6, fontSize: 12, lineHeight: 1.7, color: C.muted }}>{item.desc}</p>
                      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: item.color, cursor: "pointer" }}>
                        Learn more <ChevronRight size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      )}

      {/* ── FAB ── */}
      {tab !== "report" && (
        <button onClick={() => setTab("report")} style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 40,
          display: "flex", alignItems: "center", gap: 7,
          background: "#061B46", borderRadius: 999, padding: "12px 20px",
          fontSize: 12, fontWeight: 700, color: "#fff", border: "none", cursor: "pointer",
          boxShadow: "0 8px 32px rgba(6,27,70,0.35)", transition: "transform 0.15s, background 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.background = C.blue; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "#061B46"; }}
        >
          <Send size={13} /> Report Issue
        </button>
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }}>
          <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", animation: "scaleIn 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", padding: "18px 20px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Report a Safety Issue</div>
              <button onClick={() => setModalOpen(false)} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} />
              </button>
            </div>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                {([
                  { label: "Name",     key: "name",     placeholder: "Max Mustermann" },
                  { label: "Location", key: "location", placeholder: "e.g. Breiter Weg" },
                ] as { label: string; key: "name" | "location"; placeholder: string }[]).map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{f.label}</label>
                    <input required value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      style={{ width: "100%", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "9px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    style={{ width: "100%", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "9px 12px", fontSize: 13, outline: "none" }}>
                    {issueTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Description</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe what you observed..."
                    style={{ width: "100%", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "9px 12px", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }} />
                </div>
                <button type="submit" style={{ borderRadius: 8, background: "#061B46", color: "#fff", border: "none", padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.blue)}
                  onMouseLeave={e => (e.currentTarget.style.background = "#061B46")}
                >Submit</button>
              </form>
            ) : (
              <div style={{ padding: "36px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>&#x2705;</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Submitted!</div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Thank you, {form.name}.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes ping    { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.85);opacity:0} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:none} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
