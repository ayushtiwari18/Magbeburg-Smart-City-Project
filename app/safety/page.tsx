"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Shield, AlertTriangle, PhoneCall, MapPin, Users, X, Send,
  TrendingDown, Clock, Calendar, Activity, Flame, ChevronRight
} from "lucide-react";
import Container from "@/components/layout/Container";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
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

const issueTypes = ["Broken Streetlight","Suspicious Activity","Road Hazard","Vandalism","Noise Complaint","Other"];

const C = {
  navy:   "#061B46",
  blue:   "#2563eb",
  cyan:   "#0891b2",
  violet: "#7c3aed",
  red:    "#dc2626",
  orange: "#ea580c",
  amber:  "#d97706",
  green:  "#16a34a",
  muted:  "#64748b",
  border: "rgba(0,0,0,0.07)",
};

const WEEKDAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function findColKey(columns: KissColumn[], ...tests: Array<(v: string) => boolean>): string | undefined {
  for (const test of tests) {
    const col = columns.find(c => test((c.key ?? "").toLowerCase()) || test((c.label ?? "").toLowerCase()));
    if (col) return col.key;
  }
  return undefined;
}

// ── Shared dark tooltip ─────────────────────────────────────────────────────
type TTP = { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string };
const DarkTip = ({ active, payload, label }: TTP) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#e2e8f0",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
    }}>
      <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#94a3b8" }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <strong style={{ color: p.color }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Animated counter ────────────────────────────────────────────────────────
function AnimCounter({ target, duration = 1400 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setVal(Math.round(cur));
      if (cur >= target) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);
  return <>{val.toLocaleString()}</>;
}

// ── Chart card wrapper ───────────────────────────────────────────────────────
function ChartCard({ title, subtitle, height = 260, children, accent = C.blue }: {
  title: string; subtitle?: string; height?: number; children: React.ReactNode; accent?: string;
}) {
  return (
    <div style={{
      background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20,
      padding: "22px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.12), 0 0 0 2px ${accent}33`; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
    >
      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: C.navy }}>{title}</p>
      {subtitle && <p style={{ margin: "2px 0 14px", fontSize: 11, color: C.muted }}>{subtitle}</p>}
      {!subtitle && <div style={{ marginBottom: 14 }} />}
      <div style={{ height }}>{children}</div>
    </div>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, value, label, sub, color, delay = 0 }: {
  icon: React.ElementType; value: number; label: string; sub?: string; color: string; delay?: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "22px 20px",
      border: `1px solid ${C.border}`, boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(18px)",
      transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.12), 0 0 0 2px ${color}44`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ position: "absolute", right: -8, top: -8, width: 80, height: 80, borderRadius: "50%", background: `${color}12` }} />
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.navy, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {vis ? <AnimCounter target={value} /> : "0"}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function Safety() {
  const [geo, setGeo] = useState<AccidentGeoJSON | null>(null);
  const [yearData, setYearData] = useState<{ year: number; total: number; killed: number; injured: number }[]>([]);
  const [hourData, setHourData] = useState<{ hour: number; count: number }[]>([]);
  const [weekdayData, setWeekdayData] = useState<{ day: string; count: number }[]>([]);
  const [causeData, setCauseData] = useState<{ cause: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", type: issueTypes[0], description: "" });

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
          if (hourCol && countCol) setHourData(d.rows.map(r => ({ hour: Number(r[hourCol]), count: Number(r[countCol] ?? 0) })).sort((a,b) => a.hour - b.hour));
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
              setCauseData(latestRows.map(r => ({ cause: String(r[causeCol]), count: Number(r[countCol] ?? 0) })).sort((a,b) => b.count - a.count).slice(0,6));
            } else if (countCol) {
              const causeCols = cols.filter(c => c.key !== yearCol);
              if (latestRows.length > 0) setCauseData(causeCols.map(c => ({ cause: c.label ?? c.key, count: Number(latestRows[0][c.key] ?? 0) })).sort((a,b) => b.count - a.count).slice(0,6));
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

  // severity pie data for radial bar
  const severityData = [
    { name: "Fatal",   value: fatalities, fill: C.red },
    { name: "Serious", value: serious,    fill: C.orange },
    { name: "Minor",   value: minor,      fill: C.amber },
  ];

  // Heatmap: weekday × slot (just use count per weekday as intensity blocks)
  const maxDay   = Math.max(...weekdayData.map(d => d.count), 1);
  const maxHour  = Math.max(...hourData.map(d => d.count), 1);
  const maxCause = Math.max(...causeData.map(d => d.count), 1);

  // hour buckets for heatmap grid (4 rows × 6 cols = 24h)
  const hourGrid = Array.from({ length: 24 }, (_, h) => {
    const found = hourData.find(d => d.hour === h);
    return { h, count: found?.count ?? 0 };
  });

  const CAUSE_COLORS = [C.red, C.orange, C.amber, C.blue, C.violet, C.cyan];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setSubmitted(true);
    setTimeout(() => { setModalOpen(false); setSubmitted(false); setForm({ name: "", location: "", type: issueTypes[0], description: "" }); }, 2200);
  };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ position: "relative", height: 480 }}>
        <Image src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=85" alt="Safety" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,#061B46ee 0%,#061B46aa 50%,transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <Container>
            <div style={{ maxWidth: 560, animation: "fadeUp 0.7s ease both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", padding: "6px 16px", marginBottom: 16 }}>
                <Shield size={14} color="#93c5fd" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#bfdbfe", letterSpacing: "0.1em", textTransform: "uppercase" }}>Smart City Magdeburg</span>
              </div>
              <h1 style={{ fontSize: 56, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Safety<br/>Dashboard</h1>
              <p style={{ marginTop: 16, fontSize: 16, color: "#bfdbfe", lineHeight: 1.7, maxWidth: 420 }}>
                Real accident data from Magdeburg&#39;s Unfallatlas — 2017 to 2024 — analysed across time, location and severity.
              </p>
              <button onClick={() => setModalOpen(true)} style={{
                marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", borderRadius: 14, padding: "12px 24px",
                fontSize: 14, fontWeight: 700, color: C.navy, border: "none",
                cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transition: "transform 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                <Send size={15} /> Report an Issue
              </button>
            </div>
          </Container>
        </div>
      </section>

      {/* ── KPI strip ── */}
      <div style={{ background: C.navy }}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "none" }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ padding: "28px 20px", textAlign: "center" }}>
                  <div style={{ height: 36, width: 80, background: "rgba(255,255,255,0.08)", borderRadius: 8, margin: "0 auto 8px", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: 12, width: 100, background: "rgba(255,255,255,0.05)", borderRadius: 6, margin: "0 auto", animation: "pulse 1.5s infinite" }} />
                </div>
              ))
              : ([
                { icon: AlertTriangle, value: totalAccidents,     label: "Accidents (2017–24)", sub: "Unfallatlas",       color: "#60a5fa" },
                { icon: TrendingDown,  value: fatalities,          label: "Fatalities",          sub: "UKATEGORIE = 1",   color: "#f87171" },
                { icon: Users,         value: cyclistInvolved,    label: "Cyclist Involved",    sub: "IstRad = 1",       color: "#34d399" },
                { icon: MapPin,        value: pedestrianInvolved, label: "Pedestrians",         sub: "IstFuss = 1",      color: "#fbbf24" },
              ] as { icon: React.ElementType; value: number; label: string; sub: string; color: string }[]).map((s, i) => (
                <div key={s.label} style={{ padding: "28px 20px", textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none", animation: `fadeUp 0.5s ${i * 0.1}s ease both` }}>
                  <s.icon size={18} color={s.color} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{s.value.toLocaleString()}</div>
                  <div style={{ fontSize: 13, color: "#93c5fd", marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{s.sub}</div>
                </div>
              ))
            }
          </div>
        </Container>
      </div>

      {/* ── Analytics Grid ── */}
      <section style={{ padding: "48px 0" }}>
        <Container>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.navy, margin: 0 }}>Accident Analytics</h2>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Sources: Unfallatlas · KISS-MD Verkehr · Statistisches Amt Magdeburg</p>
          </div>

          {/* Row 1: Yearly trend (wide) + Severity radial */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>

            <ChartCard title="🚗 Accident Trend 2010–2024" subtitle="Annual totals with fatalities overlay · KISS-MD Verkehr" height={280} accent={C.blue}>
              {loading ? <Skeleton /> : yearData.length === 0 ? <NoData /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={yearData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gInjured" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.cyan} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<DarkTip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: C.muted }} />
                    <Area type="monotone" dataKey="total" name="Total Accidents" stroke={C.blue} strokeWidth={2.5} fill="url(#gTotal)" isAnimationActive animationDuration={1200} />
                    <Area type="monotone" dataKey="injured" name="Injured" stroke={C.cyan} strokeWidth={2} fill="url(#gInjured)" isAnimationActive animationDuration={1400} />
                    <Line type="monotone" dataKey="killed" name="Fatalities" stroke={C.red} strokeWidth={2.5} dot={{ r: 4, fill: C.red }} isAnimationActive animationDuration={1600} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="☠️ Severity Breakdown" subtitle="Fatal · Serious · Minor — from GeoJSON" height={280} accent={C.red}>
              {loading ? <Skeleton /> : totalAccidents === 0 ? <NoData /> : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={severityData} startAngle={90} endAngle={-270}>
                      <PolarAngleAxis type="number" domain={[0, totalAccidents]} tick={false} />
                      <RadialBar dataKey="value" background={{ fill: "#f1f5f9" }} isAnimationActive animationDuration={1200} cornerRadius={6} label={false} />
                      <Tooltip content={<DarkTip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 4 }}>
                    {severityData.map(s => (
                      <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.fill, display: "inline-block" }} />
                        <strong style={{ color: C.navy }}>{s.value.toLocaleString()}</strong> {s.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ChartCard>
          </div>

          {/* Row 2: Hour chart + Weekday bars */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            <ChartCard title="⏰ Accidents by Hour of Day" subtitle="KISS-MD — verkehrsunfaelle-aufgeteilt-nach-uhrzeiten" height={260} accent={C.violet}>
              {loading ? <Skeleton /> : hourData.length === 0 ? <NoData /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourData} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gHour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.violet} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={C.violet} stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fill: C.muted, fontSize: 10 }} tickLine={false}
                      tickFormatter={h => h % 6 === 0 ? `${String(h).padStart(2,"0")}h` : ""} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<DarkTip />} />
                    <Bar dataKey="count" name="Accidents" fill="url(#gHour)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="📅 Accidents by Weekday" subtitle="KISS-MD — sachschaden nach Wochentagen" height={260} accent={C.cyan}>
              {loading ? <Skeleton /> : weekdayData.length === 0 ? <NoData /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekdayData} layout="vertical" margin={{ top: 5, right: 16, left: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gDay" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={C.cyan} stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#0e7490" stopOpacity={0.5} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
                    <Tooltip content={<DarkTip />} />
                    <Bar dataKey="count" name="Accidents" fill="url(#gDay)" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={1100}>
                      {weekdayData.map((d, i) => (
                        <Cell key={i} fill={d.count === maxDay ? C.red : "url(#gDay)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Row 3: Causes (wide) + Hour heatmap grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            <ChartCard title="⚠️ Top Accident Causes" subtitle="KISS-MD — unfaelle-nach-ausgewaehlten-ursachen (latest year)" height={260} accent={C.red}>
              {loading ? <Skeleton /> : causeData.length === 0 ? <NoData /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={causeData} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="cause" tick={{ fill: C.muted, fontSize: 9.5 }} tickLine={false} axisLine={false} width={130} />
                    <Tooltip content={<DarkTip />} />
                    <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={1000}>
                      {causeData.map((d, i) => <Cell key={i} fill={CAUSE_COLORS[i % CAUSE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* 24-hour heat grid */}
            <ChartCard title="🔥 24-Hour Accident Intensity" subtitle="Heat grid — each cell = 1 hour of the day (0–23h)" height={260} accent={C.orange}>
              {loading ? <Skeleton /> : hourData.length === 0 ? <NoData /> : (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 6 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 5 }}>
                    {hourGrid.map(({ h, count }) => {
                      const intensity = count / maxHour;
                      const bg = intensity > 0.75 ? C.red : intensity > 0.5 ? C.orange : intensity > 0.25 ? C.amber : "#e2e8f0";
                      return (
                        <div key={h} title={`${String(h).padStart(2,"0")}:00 → ${count} accidents`}
                          style={{
                            aspectRatio: "1", borderRadius: 6,
                            background: bg,
                            opacity: intensity < 0.05 ? 0.3 : 0.6 + intensity * 0.4,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 700, color: intensity > 0.3 ? "#fff" : C.muted,
                            cursor: "default",
                            transition: "transform 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "none")}
                        >
                          {String(h).padStart(2,"0")}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
                    {[
                      { color: "#e2e8f0", label: "Low" },
                      { color: C.amber,   label: "Medium" },
                      { color: C.orange,  label: "High" },
                      { color: C.red,     label: "Peak" },
                    ].map(l => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color, display: "inline-block" }} />
                        {l.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>
          </div>
        </Container>
      </section>

      {/* ── KPI Cards ── */}
      <section style={{ padding: "0 0 48px" }}>
        <Container>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 20 }}>Key Figures</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
            {loading ? Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />) : [
              { icon: Activity,      value: totalAccidents,     label: "Total Accidents",    sub: "2017–2024",    color: C.blue,   delay: 0   },
              { icon: TrendingDown,  value: fatalities,          label: "Fatalities",         sub: "UKATEGORIE 1", color: C.red,    delay: 100 },
              { icon: Flame,         value: serious,             label: "Serious Injuries",   sub: "UKATEGORIE 2", color: C.orange, delay: 200 },
              { icon: AlertTriangle, value: minor,               label: "Minor Accidents",    sub: "UKATEGORIE 3", color: C.amber,  delay: 300 },
              { icon: Users,         value: cyclistInvolved,    label: "Cyclists Involved",  sub: "IstRad = 1",   color: C.green,  delay: 400 },
              { icon: MapPin,        value: pedestrianInvolved, label: "Pedestrians Involved",sub: "IstFuss = 1",  color: C.violet, delay: 500 },
            ].map(k => <KpiCard key={k.label} icon={k.icon} value={k.value} label={k.label} sub={k.sub} color={k.color} delay={k.delay} />)}
          </div>
        </Container>
      </section>

      {/* ── Initiatives ── */}
      <section style={{ paddingBottom: 80 }}>
        <Container>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Safety Initiatives</h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>Programmes powered by this data to keep Magdeburg safer.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {[
              { icon: AlertTriangle, color: C.blue,   title: "Smart Surveillance",  desc: "AI-powered camera networks monitor public spaces 24/7, detecting unusual activity and alerting emergency services in real time.",   img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80" },
              { icon: PhoneCall,     color: C.green,  title: "Emergency Response",  desc: "Integrated SOS stations placed across the city connect citizens directly to emergency services with one press.",                      img: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&q=80" },
              { icon: Activity,      color: C.violet, title: "Incident Analytics",  desc: "The Unfallatlas heatmaps pinpoint hotspots across hours and weekdays, prioritising infrastructure investment smartly.",              img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80" },
              { icon: Users,         color: C.amber,  title: "Community Watch",     desc: "Citizens can report safety concerns via the form below, building a collaborative network of community awareness.",                   img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#fff", borderRadius: 24, overflow: "hidden",
                border: `1px solid ${C.border}`, boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
              >
                <div style={{ position: "relative", height: 180 }}>
                  <Image src={item.img} alt={item.title} fill sizes="400px" style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <item.icon size={20} color={item.color} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{item.title}</div>
                  <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7, color: C.muted }}>{item.desc}</p>
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: item.color, cursor: "pointer" }}>
                    Learn more <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAB ── */}
      <button onClick={() => setModalOpen(true)} style={{
        position: "fixed", bottom: 32, right: 32, zIndex: 40,
        display: "flex", alignItems: "center", gap: 8,
        background: C.navy, borderRadius: 999,
        padding: "14px 22px", fontSize: 13, fontWeight: 700,
        color: "#fff", border: "none", cursor: "pointer",
        boxShadow: "0 8px 32px rgba(6,27,70,0.4)",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.background = C.blue); }}
        onMouseLeave={e => { (e.currentTarget.style.transform = "none"; e.currentTarget.style.background = C.navy); }}
      >
        <Send size={15} /> Report Issue
      </button>

      {/* ── Modal ── */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }}>
          <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 28, boxShadow: "0 24px 64px rgba(0,0,0,0.25)", animation: "scaleIn 0.25s ease" }}>
            {!submitted ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", padding: "22px 24px" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>Report a Safety Issue</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Help us keep Magdeburg safe</div>
                  </div>
                  <button onClick={() => setModalOpen(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                  {([
                    { label: "Your Name",   key: "name",        placeholder: "Max Mustermann",          type: "input" },
                    { label: "Location",    key: "location",    placeholder: "e.g. Breiter Weg, Altstadt", type: "input" },
                  ] as { label: string; key: "name" | "location"; placeholder: string; type: string }[]).map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{f.label}</label>
                      <input required value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                        style={{ width: "100%", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 14px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Issue Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      style={{ width: "100%", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 14px", fontSize: 13, outline: "none" }}>
                      {issueTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Description</label>
                    <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe what you observed..."
                      style={{ width: "100%", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 14px", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }} />
                  </div>
                  <button type="submit" style={{ width: "100%", borderRadius: 12, background: C.navy, color: "#fff", border: "none", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.blue)}
                    onMouseLeave={e => (e.currentTarget.style.background = C.navy)}
                  >Submit Report</button>
                </form>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 56, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>Report Submitted!</div>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Thank you, {form.name}. Our team will review your report shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:none } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", justifyContent: "flex-end" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ height: 16, background: "#f1f5f9", borderRadius: 6, animation: "pulse 1.5s infinite", width: `${60 + Math.random() * 40}%` }} />
      ))}
    </div>
  );
}

function NoData() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 13, color: "#94a3b8" }}>No data available</div>;
}

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", border: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ height: 42, width: 42, borderRadius: 12, background: "#f1f5f9", marginBottom: 12, animation: "pulse 1.5s infinite" }} />
      <div style={{ height: 32, width: "60%", background: "#f1f5f9", borderRadius: 8, marginBottom: 8, animation: "pulse 1.5s infinite" }} />
      <div style={{ height: 12, width: "80%", background: "#f1f5f9", borderRadius: 6, animation: "pulse 1.5s infinite" }} />
    </div>
  );
}
