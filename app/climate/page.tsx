"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Container from "@/components/layout/Container";
import { Thermometer, Droplets, Wind, TrendingUp, Calendar, Snowflake, Sun } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from "recharts";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

type MonthRow = { date: string; MO_TT: number | null; MO_RR: number | null; MO_FK: number | null; [key: string]: unknown; };
type YearRow  = { year: number; temp: number; rain: number; };

// ── Weather particle canvas ──────────────────────────────────────────────────
type Particle = { x: number; y: number; vx: number; vy: number; r: number; opacity: number; type: "rain" | "snow" | "sun" };

function WeatherCanvas({ mode }: { mode: "rain" | "snow" | "sun" | "clear" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const resize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const N = mode === "rain" ? 120 : mode === "snow" ? 80 : mode === "sun" ? 30 : 0;
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: mode === "rain" ? (Math.random() - 0.3) * 1.5 : mode === "snow" ? (Math.random() - 0.5) * 0.4 : (Math.random() - 0.5) * 0.3,
        vy: mode === "rain" ? 6 + Math.random() * 6 : mode === "snow" ? 0.5 + Math.random() * 1 : -(0.2 + Math.random() * 0.4),
        r:  mode === "rain" ? 1.2 : mode === "snow" ? 2 + Math.random() * 3 : 3 + Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.5,
        type: mode as "rain" | "snow" | "sun",
      });
    }

    // sun rays
    let sunAngle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (mode === "sun") {
        sunAngle += 0.004;
        // big glowing sun
        const grd = ctx.createRadialGradient(W * 0.82, H * 0.18, 0, W * 0.82, H * 0.18, 90);
        grd.addColorStop(0, "rgba(255,220,50,0.35)");
        grd.addColorStop(0.4, "rgba(255,170,0,0.15)");
        grd.addColorStop(1, "rgba(255,100,0,0)");
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(W * 0.82, H * 0.18, 90, 0, Math.PI * 2); ctx.fill();
        // rays
        for (let i = 0; i < 12; i++) {
          const a = sunAngle + (i / 12) * Math.PI * 2;
          ctx.save(); ctx.translate(W * 0.82, H * 0.18); ctx.rotate(a);
          ctx.strokeStyle = "rgba(255,200,30,0.25)"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(70 + Math.sin(sunAngle * 3 + i) * 8, 0); ctx.stroke();
          ctx.restore();
        }
        // floating sparkles
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,220,60,${p.opacity * 0.6})`;
          ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        });
      } else if (mode === "rain") {
        ctx.strokeStyle = "rgba(130,180,255,0.55)"; ctx.lineWidth = 1.2;
        particles.forEach(p => {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2); ctx.stroke();
          p.x += p.vx; p.y += p.vy;
          if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
          if (p.x > W) p.x = 0; if (p.x < 0) p.x = W;
        });
      } else if (mode === "snow") {
        particles.forEach(p => {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,230,255,${p.opacity})`; ctx.fill();
          p.x += p.vx + Math.sin(p.y * 0.02) * 0.3; p.y += p.vy;
          if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        });
      }
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, [mode]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
const ClimateTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(6,27,70,0.92)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 14px", fontSize: 12, color: "#fff", backdropFilter: "blur(8px)" }}>
      <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#93c5fd" }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#cbd5e1" }}>{p.name}:</span>
          <strong style={{ color: p.color }}>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Animated number counter ───────────────────────────────────────────────────
function AnimatedVal({ target, suffix = "", decimals = 1 }: { target: number; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0; const end = target; if (end === 0) return;
    const dur = 1200; const step = 16;
    const inc = (end - start) / (dur / step);
    const t = setInterval(() => {
      start += inc;
      if ((inc > 0 && start >= end) || (inc < 0 && start <= end)) { setVal(end); clearInterval(t); }
      else setVal(start);
    }, step);
    return () => clearInterval(t);
  }, [target]);
  return <>{val.toFixed(decimals)}{suffix}</>;
}

// ── Thermometer SVG ───────────────────────────────────────────────────────────
function ThermometerSVG({ value, min, max, color }: { value: number; min: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const fillH = pct * 100;
  return (
    <svg viewBox="0 0 40 120" style={{ width: 40, height: 120 }}>
      <defs>
        <linearGradient id="thermGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <clipPath id="thermClip">
          <rect x="14" y={110 - fillH} width="12" height={fillH} rx="3" />
        </clipPath>
      </defs>
      {/* tube */}
      <rect x="14" y="10" width="12" height="100" rx="6" fill="#e2e8f0" />
      {/* fill */}
      <rect x="14" y="10" width="12" height="100" rx="6" fill="url(#thermGrad)" clipPath="url(#thermClip)" style={{ transition: "all 1.2s ease" }} />
      {/* bulb */}
      <circle cx="20" cy="108" r="10" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      {/* tick marks */}
      {[0, 25, 50, 75, 100].map(p => (
        <line key={p} x1="26" y1={10 + (1 - p / 100) * 100} x2="30" y2={10 + (1 - p / 100) * 100} stroke="#94a3b8" strokeWidth="1" />
      ))}
      <text x="20" y="105" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">{value.toFixed(1)}°</text>
    </svg>
  );
}

// ── Rain gauge SVG ────────────────────────────────────────────────────────────
function RainGauge({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <svg viewBox="0 0 50 90" style={{ width: 50, height: 90 }}>
      <defs>
        <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      {/* cylinder outline */}
      <rect x="8" y="10" width="34" height="70" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* water fill */}
      <rect x="9" y={10 + (1 - pct) * 70} width="32" height={pct * 70} rx="3" fill="url(#rainGrad)" style={{ transition: "all 1.4s ease" }} />
      {/* wave */}
      <path d={`M9,${10 + (1 - pct) * 70} q8,-4 16,0 q8,4 16,0`} fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.8" />
      {/* ticks */}
      {[0, 50, 100].map(p => (
        <text key={p} x="44" y={80 - p * 0.6} fontSize="6" fill="#94a3b8" textAnchor="end">{p}%</text>
      ))}
      <text x="25" y="88" textAnchor="middle" fill="#2563eb" fontSize="7" fontWeight="bold">{value.toFixed(0)}mm</text>
    </svg>
  );
}

// ── Colour helper ─────────────────────────────────────────────────────────────
function tempColor(norm: number) {
  const hue = Math.round(240 - norm * 200);
  return `hsl(${hue},80%,52%)`;
}

export default function ClimatePage() {
  const [yearlyAvg, setYearlyAvg] = useState<YearRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [hoverY, setHoverY]       = useState<YearRow | null>(null);
  const [liveTime, setLiveTime]   = useState("");
  const [mounted, setMounted]     = useState(false);
  const [activeDecade, setActiveDecade] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const tick = () => setLiveTime(new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`${RAW}/sensor-data/json/klima-monat.json`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
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

  const temps     = yearlyAvg.map(r => r.temp);
  const minTemp   = temps.length ? Math.min(...temps) : 0;
  const maxTemp   = temps.length ? Math.max(...temps) : 1;
  const tempRange = maxTemp - minTemp || 1;

  const recent10  = yearlyAvg.slice(-10);
  const older10   = yearlyAvg.slice(0, 10);
  const recentAvg = recent10.length ? recent10.reduce((a, b) => a + b.temp, 0) / recent10.length : 0;
  const olderAvg  = older10.length  ? older10.reduce((a, b) => a + b.temp, 0) / older10.length   : 0;
  const warming   = recentAvg - olderAvg;

  const hottestYear = yearlyAvg.length ? yearlyAvg.reduce((a, b) => (a.temp > b.temp ? a : b)) : null;
  const coldestYear = yearlyAvg.length ? yearlyAvg.reduce((a, b) => (a.temp < b.temp ? a : b)) : null;
  const cityAvgTemp = yearlyAvg.length ? yearlyAvg.reduce((a, b) => a + b.temp, 0) / yearlyAvg.length : 0;
  const totalRain   = yearlyAvg.length ? yearlyAvg.reduce((a, b) => a + b.rain, 0) / yearlyAvg.length : 0;
  const maxRain     = yearlyAvg.length ? Math.max(...yearlyAvg.map(r => r.rain)) : 1;

  // decade averages
  const decadeData = [1950,1960,1970,1980,1990,2000,2010,2020].map(d => {
    const rows = yearlyAvg.filter(r => r.year >= d && r.year < d + 10);
    return {
      decade: `${d}s`,
      temp: rows.length ? rows.reduce((a, b) => a + b.temp, 0) / rows.length : 0,
      rain: rows.length ? rows.reduce((a, b) => a + b.rain, 0) / rows.length : 0,
    };
  }).filter(d => d.temp > 0);

  // weather mode for hero
  const heroMode: "rain" | "snow" | "sun" | "clear" =
    !hottestYear ? "clear"
    : warming > 1.2 ? "sun"
    : warming > 0.5 ? "clear"
    : "rain";

  const kpiTiles = [
    { Icon: TrendingUp,  val: warming !== 0 ? `${warming > 0 ? "+" : ""}${warming.toFixed(2)}°C` : "—", label: "Warming",       sub: "recent vs early",    color: "#fb923c", glow: "#fb923c" },
    { Icon: Sun,         val: hottestYear ? String(hottestYear.year) : "—",                              label: "Hottest Year",  sub: hottestYear ? `${hottestYear.temp.toFixed(1)}°C` : "", color: "#fde047", glow: "#fde047" },
    { Icon: Snowflake,   val: coldestYear ? String(coldestYear.year) : "—",                              label: "Coldest Year",  sub: coldestYear ? `${coldestYear.temp.toFixed(1)}°C` : "", color: "#93c5fd", glow: "#93c5fd" },
    { Icon: Thermometer, val: cityAvgTemp > 0 ? `${cityAvgTemp.toFixed(1)}°C` : "—",                    label: "Long-run Avg",  sub: "1950–2025 mean",     color: "#60a5fa", glow: "#60a5fa" },
    { Icon: Droplets,    val: totalRain > 0 ? `${Math.round(totalRain)} mm` : "—",                       label: "Avg Rain/Year", sub: "annual total",       color: "#34d399", glow: "#34d399" },
    { Icon: Calendar,    val: String(yearlyAvg.length),                                                  label: "Years of Data", sub: "DWD Station 03126",  color: "#c084fc", glow: "#c084fc" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0a1628 0%, #0f2952 40%, #061B46 100%)" }}>

      {/* ── GLOBAL STYLES */}
      <style>{`
        @keyframes ping       { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.85);opacity:0} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 12px 2px var(--glow)} 50%{box-shadow:0 0 28px 6px var(--glow)} }
        @keyframes bar-grow   { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        .bar-animated         { transform-origin:bottom; animation:bar-grow 0.9s cubic-bezier(.22,1,.36,1) both; }
        .fade-up              { animation:fadeUp 0.5s ease both; }
        .float-y              { animation:floatY 3s ease-in-out infinite; }
        .card-glass {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 24px;
        }
        ::-webkit-scrollbar { display:none }
      `}</style>

      {/* ── GLANCE BAR */}
      <div className="sticky top-0 z-40" style={{ background: "rgba(6,27,70,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-4 lg:px-8">
          <div className="flex items-center gap-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(251,146,60,0.2)" }}>
                <Thermometer className="h-4 w-4" style={{ color: "#fb923c" }} />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(147,197,253,0.7)" }}>Smart City Magdeburg</div>
                <div className="text-sm font-bold text-white leading-tight">Climate Dashboard</div>
              </div>
            </div>
            <div className="h-6 w-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: "ping 1.5s ease-in-out infinite" }} />
              <span className="text-xs font-mono font-bold text-green-300">{liveTime || "—"}</span>
            </div>
            <div className="h-6 w-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>DWD Station 03126 · Magdeburg · 1950–2025</span>
            {!loading && !error && (
              <span className="ml-auto text-[10px] font-semibold" style={{ color: "#4ade80" }}>{yearlyAvg.length} years ✓</span>
            )}
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {kpiTiles.map((k, i) => (
              <div key={k.label}
                className="flex flex-col items-center justify-center py-3 px-2 text-center cursor-default"
                style={{ borderRight: i < 5 ? "1px solid rgba(255,255,255,0.06)" : undefined, transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}>
                <k.Icon size={12} style={{ color: k.color, marginBottom: 2, filter: `drop-shadow(0 0 4px ${k.glow})` }} />
                <div className="text-xl font-bold tabular-nums text-white leading-tight" style={{ textShadow: `0 0 12px ${k.glow}55` }}>{k.val}</div>
                <div className="text-[10px] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{k.label}</div>
                <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO WEATHER BANNER */}
      {mounted && !loading && !error && (
        <div className="relative overflow-hidden fade-up" style={{ height: 200, background: heroMode === "sun" ? "linear-gradient(135deg,#1e3a5f,#7c3a00)" : heroMode === "rain" ? "linear-gradient(135deg,#0a1628,#1e3a5f)" : "linear-gradient(135deg,#0f2952,#1e3a5f)" }}>
          <WeatherCanvas mode={heroMode} />
          <div className="absolute inset-0 flex items-center justify-center flex-col z-10 text-center px-4">
            <div className="text-5xl font-black text-white mb-1" style={{ textShadow: "0 0 40px rgba(251,146,60,0.6)", animation: "floatY 3s ease-in-out infinite" }}>
              {hottestYear ? `${hottestYear.temp.toFixed(1)}°C` : "—"}
            </div>
            <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Hottest annual mean · {hottestYear?.year}</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(251,146,60,0.2)", border: "1px solid rgba(251,146,60,0.4)", color: "#fb923c" }}>
                🌡️ +{warming.toFixed(2)}°C warming trend
              </div>
              <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#93c5fd" }}>
                💧 {Math.round(totalRain)} mm/yr avg
              </div>
            </div>
          </div>
          {/* gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(10,22,40,0.7))" }} />
        </div>
      )}

      {/* ── BODY */}
      <div className="px-4 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-40">
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#60a5fa", animation: "spin 0.8s linear infinite" }} />
            <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          </div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-40 text-white/50">
            <p className="text-lg font-semibold">Could not load climate data</p>
            <p className="text-sm mt-1">Check network access to raw.githubusercontent.com</p>
          </div>
        )}

        {!loading && !error && yearlyAvg.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* ── ROW 1: big temp timeline + thermometer */}
            <div className="card-glass p-6 fade-up" style={{ animationDelay: "0.05s" }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">🌡️ Annual Mean Temperature 1950–2025</h2>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Source: DWD Climate Data Center · klima-monat.json (MO_TT) · Hover a bar for details</p>
                </div>
                {hoverY && (
                  <div className="rounded-2xl p-3 text-xs" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <p className="font-bold text-white mb-1">{hoverY.year}</p>
                    <p style={{ color: "#fde68a" }}>🌡️ {hoverY.temp.toFixed(2)}°C</p>
                    <p style={{ color: "#93c5fd" }}>💧 {hoverY.rain.toFixed(0)} mm</p>
                    <p style={{ color: hoverY.temp > cityAvgTemp ? "#f87171" : "#60a5fa" }}>{hoverY.temp > cityAvgTemp ? "▲ above" : "▼ below"} avg</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 220 }}>
                {yearlyAvg.map((r, i) => {
                  const norm = (r.temp - minTemp) / tempRange;
                  const isHot = r.temp === maxTemp; const isCold = r.temp === minTemp;
                  return (
                    <div key={r.year} className="flex-1 bar-animated rounded-t-sm cursor-pointer relative group"
                      style={{
                        height: `${norm * 85 + 10}%`,
                        background: isHot ? "linear-gradient(to top, #ef4444, #fbbf24)" : isCold ? "linear-gradient(to top, #1d4ed8, #60a5fa)" : `linear-gradient(to top, ${tempColor(norm * 0.7)}, ${tempColor(norm)})`,
                        boxShadow: isHot ? "0 0 8px #ef4444" : isCold ? "0 0 8px #3b82f6" : undefined,
                        animationDelay: `${i * 6}ms`,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={() => setHoverY(r)}
                      onMouseLeave={() => setHoverY(null)}>
                      {(isHot || isCold) && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold whitespace-nowrap"
                          style={{ color: isHot ? "#fbbf24" : "#93c5fd" }}>
                          {isHot ? "🔥" : "❄️"}{r.year}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-2">
                {["1950","1963","1975","1988","2000","2013","2025"].map(y => (
                  <span key={y} className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{y}</span>
                ))}
              </div>

              {/* colour legend */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{minTemp.toFixed(1)}°C</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "linear-gradient(to right,hsl(240,80%,52%),hsl(180,80%,52%),hsl(120,80%,52%),hsl(60,80%,52%),hsl(40,80%,52%),hsl(10,80%,52%))" }} />
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{maxTemp.toFixed(1)}°C</span>
              </div>
            </div>

            {/* ── ROW 2: 3-column gauges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>

              {/* Thermometer column */}
              <div className="card-glass p-5 fade-up flex flex-col items-center" style={{ animationDelay: "0.1s" }}>
                <p className="text-sm font-bold text-white mb-1">🌡️ Temperature Range</p>
                <p className="text-[10px] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Full 1950–2025 spread</p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <ThermometerSVG value={minTemp} min={minTemp} max={maxTemp} color="#3b82f6" />
                    <span className="text-[10px] mt-1" style={{ color: "#93c5fd" }}>❄️ Min</span>
                    <span className="text-xs font-bold text-white">{coldestYear?.year}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ThermometerSVG value={cityAvgTemp} min={minTemp} max={maxTemp} color="#f59e0b" />
                    <span className="text-[10px] mt-1" style={{ color: "#fde68a" }}>📊 Avg</span>
                    <span className="text-xs font-bold text-white">{cityAvgTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ThermometerSVG value={maxTemp} min={minTemp} max={maxTemp} color="#ef4444" />
                    <span className="text-[10px] mt-1" style={{ color: "#fca5a5" }}>🔥 Max</span>
                    <span className="text-xs font-bold text-white">{hottestYear?.year}</span>
                  </div>
                </div>
              </div>

              {/* Rain gauge column */}
              <div className="card-glass p-5 fade-up flex flex-col items-center" style={{ animationDelay: "0.15s" }}>
                <p className="text-sm font-bold text-white mb-1">💧 Rain Gauge</p>
                <p className="text-[10px] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Annual totals · recent 5 years</p>
                <div className="flex items-end gap-4">
                  {yearlyAvg.slice(-5).map(r => (
                    <div key={r.year} className="flex flex-col items-center gap-1">
                      <RainGauge value={r.rain} max={maxRain} />
                      <span className="text-[9px] font-semibold" style={{ color: "#93c5fd" }}>{r.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warming trend mini chart */}
              <div className="card-glass p-5 fade-up" style={{ animationDelay: "0.2s" }}>
                <p className="text-sm font-bold text-white mb-1">📈 Warming Trend</p>
                <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>10-yr rolling anomaly vs 1950–1959 baseline</p>
                {(() => {
                  const baseline = older10.reduce((a, b) => a + b.temp, 0) / (older10.length || 1);
                  const anomaly = yearlyAvg.map(r => ({ year: r.year, delta: +(r.temp - baseline).toFixed(2) }));
                  return (
                    <ResponsiveContainer width="100%" height={140}>
                      <AreaChart data={anomaly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="anoGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} interval={9} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v > 0 ? "+" : ""}${v}°`} />
                        <Tooltip content={<ClimateTooltip />} />
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 2" />
                        <Area type="monotone" dataKey="delta" name="Anomaly (°C)" stroke="#f87171" strokeWidth={2} fill="url(#anoGrad)" isAnimationActive animationDuration={1400} />
                      </AreaChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>

            {/* ── ROW 3: Decade comparison + Rain timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {/* Decade bar chart */}
              <div className="card-glass p-5 fade-up" style={{ animationDelay: "0.25s" }}>
                <p className="text-sm font-bold text-white mb-1">🗓️ Decade Averages</p>
                <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Mean temperature by decade</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
                  {decadeData.map((d, i) => {
                    const norm = (d.temp - (decadeData.reduce((a, b) => Math.min(a, b.temp), 99))) / 3;
                    const clamped = Math.max(0, Math.min(1, norm));
                    const hue = Math.round(240 - clamped * 200);
                    return (
                      <div key={d.decade} className="flex-1 flex flex-col items-center gap-1"
                        onMouseEnter={() => setActiveDecade(i)}
                        onMouseLeave={() => setActiveDecade(null)}>
                        <span className="text-[9px] font-bold" style={{ color: `hsl(${hue},80%,65%)` }}>{d.temp.toFixed(1)}°</span>
                        <div className="w-full rounded-t bar-animated cursor-pointer"
                          style={{
                            height: `${((d.temp - 7) / 4) * 100}%`,
                            minHeight: 8,
                            background: `linear-gradient(to top, hsl(${hue},80%,35%), hsl(${hue},80%,60%))`,
                            boxShadow: activeDecade === i ? `0 0 16px hsl(${hue},80%,50%)` : undefined,
                            animationDelay: `${i * 80}ms`,
                            transition: "box-shadow 0.2s",
                          }} />
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{d.decade}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rain area chart */}
              <div className="card-glass p-5 fade-up" style={{ animationDelay: "0.3s" }}>
                <p className="text-sm font-bold text-white mb-1">🌧️ Annual Precipitation 1950–2025</p>
                <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Total rainfall per year (mm)</p>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={yearlyAvg} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rainAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} interval={9} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}mm`} />
                    <Tooltip content={<ClimateTooltip />} />
                    <Area type="monotone" dataKey="rain" name="Rain (mm)" stroke="#60a5fa" strokeWidth={2.5} fill="url(#rainAreaGrad)" isAnimationActive animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── ROW 4: dual-axis temp+rain line chart */}
            <div className="card-glass p-5 fade-up" style={{ animationDelay: "0.35s" }}>
              <p className="text-sm font-bold text-white mb-1">📊 Temperature vs Precipitation — Full History</p>
              <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Dual-axis · orange = temperature · blue = rainfall</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={yearlyAvg} margin={{ top: 4, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} interval={9} />
                  <YAxis yAxisId="t" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}°`} domain={["auto","auto"]} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}mm`} />
                  <Tooltip content={<ClimateTooltip />} />
                  <ReferenceLine yAxisId="t" y={cityAvgTemp} stroke="rgba(251,146,60,0.3)" strokeDasharray="5 3" label={{ value: "avg", fill: "rgba(251,146,60,0.5)", fontSize: 9 }} />
                  <Line yAxisId="t" type="monotone" dataKey="temp" name="Temp (°C)" stroke="#fb923c" strokeWidth={2} dot={false} isAnimationActive animationDuration={1400} style={{ filter: "url(#glow)" }} />
                  <Line yAxisId="r" type="monotone" dataKey="rain" name="Rain (mm)" stroke="#60a5fa" strokeWidth={1.5} dot={false} isAnimationActive animationDuration={1600} opacity={0.7} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ── ROW 5: data table */}
            <div className="card-glass fade-up overflow-hidden" style={{ animationDelay: "0.4s" }}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <h2 className="text-lg font-bold text-white">📅 Last 20 Years — Detailed Data</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                      {["Year","Mean Temp (°C)","Total Rain (mm)","vs City Avg","Anomaly bar"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...yearlyAvg].slice(-20).reverse().map((r, i) => {
                      const diff = r.temp - cityAvgTemp;
                      const absPct = Math.abs(diff) / 1.5 * 100;
                      return (
                        <tr key={r.year}
                          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", transition: "background 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                          onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent")}>
                          <td className="px-5 py-2.5 font-bold text-white">{r.year}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{ color: diff > 0 ? "#fca5a5" : "#93c5fd" }}>{r.temp.toFixed(2)}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{ color: "rgba(255,255,255,0.7)" }}>{r.rain.toFixed(0)}</td>
                          <td className="px-5 py-2.5 tabular-nums font-semibold" style={{ color: diff > 0 ? "#f87171" : "#60a5fa" }}>{diff > 0 ? "+" : ""}{diff.toFixed(2)}°C</td>
                          <td className="px-5 py-2.5">
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              {diff < 0 && <div style={{ width: `${Math.min(absPct, 60)}px`, height: 6, background: "#3b82f6", borderRadius: 3, marginLeft: `${60 - Math.min(absPct, 60)}px` }} />}
                              <div style={{ width: 2, height: 10, background: "rgba(255,255,255,0.2)", borderRadius: 1 }} />
                              {diff > 0 && <div style={{ width: `${Math.min(absPct, 60)}px`, height: 6, background: "#ef4444", borderRadius: 3 }} />}
                            </div>
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
      </div>
    </div>
  );
}
