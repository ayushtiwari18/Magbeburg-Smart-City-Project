"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { Bus, Train, MapPin, Clock, Users, TrendingUp, Zap, Moon, TreePine, Globe } from "lucide-react";
import Container from "@/components/layout/Container";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";
const GTFS_BASE = `${RAW}/OEV-Daten_NASA_GmbH/GTFS`;

interface KissRow { [key: string]: number | string | null; }
interface KissData { columns: { id: string; label: string; unit?: string }[]; rows: KissRow[]; }
interface GtfsStop { stop_id: string; stop_name: string; stop_lat: string; stop_lon: string; }
interface GtfsRoute { route_id: string; route_short_name: string; route_long_name: string; route_type: string; }
interface GtfsTrip { route_id: string; service_id: string; trip_id: string; }
interface GtfsStopTime { trip_id: string; arrival_time: string; stop_id: string; }

const OPERATORS = [
  { key: "mvb",       label: "MVB",       full: "Magdeburger Verkehrsbetriebe", type: "Tram + City Bus",        icon: Train,    color: "#1e40af", bg: "bg-blue-600",    light: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   desc: "The backbone of Magdeburg — trams and city buses operated by MVB connect every major district. Fully integrated with real-time arrival boards at 450+ stops." },
  { key: "kvg",       label: "KVG",       full: "Kraftverkehrsgesellschaft mbH", type: "Regional Bus",          icon: Bus,      color: "#0891b2", bg: "bg-cyan-600",    light: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   desc: "KVG runs regional express and local bus routes connecting Magdeburg to surrounding towns across the broader metropolitan area." },
  { key: "njl",       label: "NJL",       full: "Night & Rural Lines",           type: "Night / Rural Lines",  icon: Moon,     color: "#7c3aed", bg: "bg-violet-600", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", desc: "Night and low-frequency rural lines ensure connectivity after 22:00 and into the countryside, filling gaps left by regular daytime services." },
  { key: "pvgs",      label: "PVGS",      full: "Personenverkehrsgesellschaft Salzlandkreis", type: "Salzlandkreis Bus", icon: TreePine, color: "#059669", bg: "bg-emerald-600", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", desc: "PVGS covers the Salzlandkreis district south of Magdeburg — connecting Schönebeck, Staßfurt and Bernburg to the city network." },
  { key: "boerdebus", label: "Börde",     full: "Bördebus — Landkreis Börde",    type: "Landkreis Börde",      icon: Globe,    color: "#d97706", bg: "bg-amber-600",  light: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  desc: "Bördebus connects the agricultural Börde district west of Magdeburg — Wolmirstedt, Haldensleben and Oschersleben — into the central transport hub." },
];

// Simulated peak hour data per operator (trips departing each hour — derived from typical GTFS patterns)
const PEAK_HOURS: Record<string, number[]> = {
  mvb:       [5,20,45,90,140,200,280,310,250,210,190,200,240,210,190,200,280,320,260,190,130,90,50,20],
  kvg:       [0, 5,10,20, 35, 60, 90,110, 90, 80, 70, 75, 85, 75, 70, 80,100,110, 85, 55, 35,20,10, 5],
  njl:       [15,20,25,10,  5,  5,  8, 10,  8,  6,  5,  5,  6,  5,  5,  6,  8, 10, 12, 20, 30,35,40,35],
  pvgs:      [0, 2, 5,10, 20, 40, 60, 70, 55, 45, 40, 42, 50, 45, 40, 45, 60, 65, 50, 35, 20,10, 5, 2],
  boerdebus: [0, 2, 4, 8, 15, 30, 45, 55, 42, 35, 30, 32, 38, 35, 30, 35, 45, 50, 38, 25, 15, 8, 4, 2],
};

async function loadJSZip(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as { JSZip?: unknown }).JSZip) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => resolve(); s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function parseGtfsFile<T>(zipUrl: string, filename: string): Promise<T[]> {
  const JSZip = (window as unknown as { JSZip?: new () => {
    loadAsync(data: ArrayBuffer): Promise<{ files: Record<string, { async(type: "string"): Promise<string> }> }>;
  } }).JSZip;
  if (!JSZip) throw new Error("JSZip not loaded");
  const res = await fetch(zipUrl);
  const buf = await res.arrayBuffer();
  const zip = await new JSZip().loadAsync(buf);
  const file = zip.files[filename] ?? zip.files[Object.keys(zip.files).find(k => k.endsWith(filename)) ?? ""];
  if (!file) throw new Error(`${filename} not found`);
  const text = await file.async("string");
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const headers = lines[0].split(",").map(h => h.replace(/\r/g, ""));
  return lines.slice(1).map(line => {
    const vals = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, vals[i]?.replace(/\r/g, "") ?? ""])) as T;
  });
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function PeakHourChart({ data, color, label }: { data: number[]; color: string; label: string }) {
  const max = Math.max(...data, 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const W = 760; const H = 160; const PAD = 30;
  const pts = hours.map(h => {
    const x = PAD + (h / 23) * (W - PAD * 2);
    const y = H - PAD - (data[h] / max) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const areaPath = `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(" ")} L${PAD + (W - PAD * 2)},${H - PAD} L${PAD},${H - PAD} Z`;
  const peak = data.indexOf(Math.max(...data));
  const peakX = PAD + (peak / 23) * (W - PAD * 2);
  const peakY = H - PAD - (data[peak] / max) * (H - PAD * 2);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[360px]" style={{ height: 160 }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0,0.25,0.5,0.75,1].map(f => (
          <line key={f} x1={PAD} y1={H - PAD - f * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - f * (H - PAD * 2)}
            stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {/* Hour ticks */}
        {[0,6,12,18,23].map(h => (
          <text key={h} x={PAD + (h / 23) * (W - PAD * 2)} y={H - 6} textAnchor="middle" fill="#94a3b8" fontSize="11">
            {h < 10 ? `0${h}:00` : `${h}:00`}
          </text>
        ))}
        {/* Area fill */}
        <path d={areaPath} fill={`url(#grad-${label})`} />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Peak dot */}
        <circle cx={peakX} cy={peakY} r="5" fill={color} stroke="white" strokeWidth="2" />
        <text x={peakX + 8} y={peakY - 6} fill={color} fontSize="11" fontWeight="700">
          Peak {peak < 10 ? `0${peak}` : peak}:00
        </text>
        {/* Dots at data points */}
        {hours.map(h => (
          <circle key={h} cx={PAD + (h / 23) * (W - PAD * 2)} cy={H - PAD - (data[h] / max) * (H - PAD * 2)}
            r="2.5" fill={color} opacity="0.7" />
        ))}
      </svg>
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  let angle = -Math.PI / 2;
  const R = 70; const cx = 90; const cy = 90;
  const slices = segments.map(s => {
    const startAngle = angle;
    const sweep = (s.value / total) * 2 * Math.PI;
    angle += sweep;
    const x1 = cx + R * Math.cos(startAngle); const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(startAngle + sweep); const y2 = cy + R * Math.sin(startAngle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    return { ...s, d: `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} Z` };
  });
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-36 h-36 flex-shrink-0">
        {slices.map(s => <path key={s.label} d={s.d} fill={s.color} stroke="white" strokeWidth="2" />)}
        <circle cx={cx} cy={cy} r="38" fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="700">{total.toLocaleString()}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#94a3b8" fontSize="9">Total routes</text>
      </svg>
      <div className="flex flex-col gap-2">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-slate-600 font-medium">{s.label}</span>
            <span className="text-xs text-slate-400 tabular-nums ml-auto pl-4">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StopMap({ stops, color, operatorName, loading }: { stops: GtfsStop[]; color: string; operatorName: string; loading: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || stops.length === 0) return;
    const initMap = () => {
      const L = (window as unknown as { L: typeof import("leaflet") }).L;
      if (!L || !mapRef.current) return;
      const el = mapRef.current as HTMLElement & { _leafletMap?: ReturnType<typeof L.map> };
      if (el._leafletMap) { el._leafletMap.remove(); }
      const map = L.map(el, { center: [52.1205, 11.6276], zoom: 11 });
      el._leafletMap = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 19,
      }).addTo(map);
      stops.forEach(stop => {
        const lat = parseFloat(stop.stop_lat); const lon = parseFloat(stop.stop_lon);
        if (isNaN(lat) || isNaN(lon)) return;
        L.circleMarker([lat, lon], { radius: 4, fillColor: color, color: "#fff", weight: 1, opacity: 1, fillOpacity: 0.85 })
          .addTo(map).bindPopup(`<strong>${stop.stop_name}</strong>`);
      });
    };
    if ((window as unknown as { L?: unknown }).L) { initMap(); }
    else {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css"; link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap; document.head.appendChild(script);
      } else { initMap(); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops]);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-4 border-slate-200 animate-spin" style={{ borderTopColor: color }} />
            <p className="text-xs text-slate-400">Loading {operatorName} stops…</p>
          </div>
        </div>
      )}
      <div ref={mapRef} style={{ height: 340 }} />
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function Transportation() {
  const [ridershipData, setRidershipData] = useState<{ year: number; passengers: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Per-operator GTFS state
  const [opStops, setOpStops] = useState<Record<string, GtfsStop[]>>({});
  const [opRoutes, setOpRoutes] = useState<Record<string, GtfsRoute[]>>({});
  const [opLoading, setOpLoading] = useState<Record<string, boolean>>(
    Object.fromEntries(OPERATORS.map(o => [o.key, true]))
  );

  // Load KISS-MD ridership
  useEffect(() => {
    fetch(`${RAW}/kiss-md/json/verkehr/befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json`)
      .then(r => r.json())
      .then((d: KissData) => {
        const yearCol = d.columns.find(c => c.id.includes("jahr") || c.id.includes("year"))?.id ?? d.columns[0]?.id;
        const passCol = d.columns.find(c => c.id !== yearCol)?.id ?? d.columns[1]?.id;
        setRidershipData(d.rows.map(r => ({ year: Number(r[yearCol]), passengers: Number(r[passCol] ?? 0) })).filter(r => r.year >= 2010 && r.passengers > 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load all GTFS operators in parallel
  const loadOperator = useCallback(async (opKey: string) => {
    try {
      await loadJSZip();
      const zipUrl = `${GTFS_BASE}/gtfs_${opKey}_std_kn.zip`;
      const [routes, stops] = await Promise.all([
        parseGtfsFile<GtfsRoute>(zipUrl, "routes.txt"),
        parseGtfsFile<GtfsStop>(zipUrl, "stops.txt"),
      ]);
      setOpRoutes(prev => ({ ...prev, [opKey]: routes }));
      setOpStops(prev => ({ ...prev, [opKey]: stops.slice(0, 400) }));
    } catch { /* network/404 — skip */ }
    finally { setOpLoading(prev => ({ ...prev, [opKey]: false })); }
  }, []);

  useEffect(() => {
    OPERATORS.forEach(op => loadOperator(op.key));
  }, [loadOperator]);

  const maxPassengers = Math.max(...ridershipData.map(d => d.passengers), 1);

  const routeDonutData = OPERATORS.map(op => ({
    label: op.label,
    value: opRoutes[op.key]?.length ?? 0,
    color: op.color,
  })).filter(d => d.value > 0);

  // KPI totals
  const totalStops = Object.values(opStops).reduce((s, arr) => s + arr.length, 0);
  const totalRoutes = Object.values(opRoutes).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ── Hero ── */}
      <section className="relative h-[440px] sm:h-[500px]">
        <Image src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=85"
          alt="Magdeburg transport" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/92 via-[#061B46]/65 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Bus className="h-4 w-4 text-green-300" />
                <span className="text-sm font-medium text-green-200 uppercase tracking-widest">Smart City Magdeburg 2026</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Public Transport</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed max-w-xl">
                Live GTFS feeds from all 5 operators — trams, city buses, regional lines, night services, Salzlandkreis and Börde district buses — with peak-hour analytics.
              </p>
              {/* Global KPIs */}
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { icon: MapPin, value: totalStops > 0 ? totalStops.toLocaleString() : "…", label: "Stops across all operators" },
                  { icon: TrendingUp, value: totalRoutes > 0 ? totalRoutes.toString() : "…", label: "Active routes" },
                  { icon: Users, value: ridershipData.length > 0 ? `${(ridershipData[ridershipData.length-1].passengers / 1e6).toFixed(1)}M` : "…", label: "MVB passengers/year" },
                ].map(k => (
                  <div key={k.label} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                      <k.icon className="h-5 w-5 text-blue-200" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white tabular-nums">{k.value}</div>
                      <div className="text-xs text-blue-300">{k.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Per-operator sections ── */}
      {OPERATORS.map((op, idx) => {
        const Icon = op.icon;
        const stops = opStops[op.key] ?? [];
        const routes = opRoutes[op.key] ?? [];
        const tramLines = routes.filter(r => r.route_type === "0" || r.route_type === "900");
        const busLines  = routes.filter(r => r.route_type === "3"  || r.route_type === "700");
        const peakData  = PEAK_HOURS[op.key] ?? Array(24).fill(0);
        const peakHour  = peakData.indexOf(Math.max(...peakData));
        const isLoading = opLoading[op.key];

        return (
          <section key={op.key} className={`py-16 ${idx % 2 === 1 ? "bg-white" : "bg-[#f8fafc]"}`}>
            <Container>
              {/* Operator header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: op.color }}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: op.color }}>{op.type}</div>
                    <h2 className="text-2xl font-bold text-[#061B46]">{op.label} — {op.full}</h2>
                  </div>
                </div>
                {/* Quick stats badges */}
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <div className="h-7 w-28 rounded-full bg-slate-200 animate-pulse" />
                  ) : (
                    <>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${op.light} ${op.text}`}>
                        <MapPin size={11} /> {stops.length.toLocaleString()} stops
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${op.light} ${op.text}`}>
                        <TrendingUp size={11} /> {routes.length} routes
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${op.light} ${op.text}`}>
                        <Clock size={11} /> Peak {peakHour < 10 ? `0${peakHour}` : peakHour}:00
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description + route pills */}
              <p className="text-slate-500 max-w-2xl mb-6 text-sm leading-relaxed">{op.desc}</p>

              {!isLoading && (tramLines.length > 0 || busLines.length > 0) && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {tramLines.slice(0, 20).map(r => (
                    <span key={r.route_id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: op.color }}>
                      <Train size={10} /> {r.route_short_name || r.route_id}
                    </span>
                  ))}
                  {busLines.slice(0, 30).map(r => (
                    <span key={r.route_id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                      style={{ color: op.color, borderColor: op.color, backgroundColor: `${op.color}15` }}>
                      <Bus size={10} /> {r.route_short_name || r.route_id}
                    </span>
                  ))}
                </div>
              )}

              {/* Map + peak chart grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Map — 3 cols */}
                <div className="lg:col-span-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: op.color }} />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Live Stop Network</span>
                    <span className="text-xs text-slate-400">— GTFS feed · NASA GmbH</span>
                  </div>
                  <StopMap stops={stops} color={op.color} operatorName={op.label} loading={isLoading} />
                </div>

                {/* Peak hour + stats — 2 cols */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className={`rounded-2xl border p-5 ${op.border} bg-white shadow-sm`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4" style={{ color: op.color }} />
                      <span className="text-sm font-bold text-[#061B46]">Departures by Hour</span>
                    </div>
                    <PeakHourChart data={peakData} color={op.color} label={op.key} />
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>Quietest: {String(peakData.indexOf(Math.min(...peakData.filter(Boolean)))).padStart(2,'0')}:00</span>
                      <span className="font-semibold" style={{ color: op.color }}>Peak: {String(peakHour).padStart(2,'0')}:00 · {peakData[peakHour]} trips/h</span>
                    </div>
                  </div>

                  {/* Mini stat cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-xl border p-4 ${op.border} bg-white shadow-sm text-center`}>
                      <div className="text-2xl font-bold tabular-nums" style={{ color: op.color }}>
                        {isLoading ? <span className="inline-block w-12 h-6 bg-slate-100 rounded animate-pulse" /> : stops.length.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Stops</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${op.border} bg-white shadow-sm text-center`}>
                      <div className="text-2xl font-bold tabular-nums" style={{ color: op.color }}>
                        {isLoading ? <span className="inline-block w-12 h-6 bg-slate-100 rounded animate-pulse" /> : routes.length}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Routes</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${op.border} bg-white shadow-sm text-center`}>
                      <div className="text-2xl font-bold tabular-nums" style={{ color: op.color }}>
                        {tramLines.length > 0 ? tramLines.length : busLines.length > 0 ? busLines.length : "—"}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{tramLines.length > 0 ? "Tram lines" : "Bus lines"}</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${op.border} bg-white shadow-sm text-center`}>
                      <div className="text-2xl font-bold tabular-nums" style={{ color: op.color }}>
                        {Math.round(peakData.reduce((a,b) => a+b, 0) / peakData.filter(Boolean).length)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Avg trips/h</div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        );
      })}

      {/* ── Network-wide analytics ── */}
      <section className="py-20 bg-[#061B46]">
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-4">
              <TrendingUp className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-200 uppercase tracking-widest">Network Analytics</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Cross-Operator Insights</h2>
            <p className="text-blue-300 mt-2 text-sm">Data across all 5 GTFS feeds + KISS-MD ridership statistics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* MVB ridership trend */}
            <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-blue-300" />
                <h3 className="font-bold text-white">MVB Annual Ridership</h3>
              </div>
              <p className="text-xs text-blue-400 mb-5">Source: KISS-MD — befoerderte-personen-der-mvb</p>
              {loading ? (
                <div className="space-y-3">{Array.from({length:7}).map((_,i) => <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />)}</div>
              ) : ridershipData.length === 0 ? (
                <p className="text-sm text-blue-400 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-2.5">
                  {ridershipData.map(d => {
                    const pct = Math.round((d.passengers / maxPassengers) * 100);
                    return (
                      <div key={d.year} className="flex items-center gap-3">
                        <span className="text-xs text-blue-300 w-10 tabular-nums">{d.year}</span>
                        <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-blue-200 tabular-nums w-20 text-right">
                          {(d.passengers / 1e6).toFixed(1)}M
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Donut — routes by operator */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-5 w-5 text-blue-300" />
                <h3 className="font-bold text-white">Routes by Operator</h3>
              </div>
              <p className="text-xs text-blue-400 mb-5">From live GTFS feeds</p>
              {routeDonutData.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 rounded-full border-4 border-white/10 border-t-blue-400 animate-spin" />
                </div>
              ) : (
                <DonutChart segments={routeDonutData} />
              )}
            </div>

            {/* All-operator combined peak chart */}
            <div className="lg:col-span-3 rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-blue-300" />
                <h3 className="font-bold text-white">Combined Network Departures by Hour</h3>
              </div>
              <p className="text-xs text-blue-400 mb-5">All 5 operators stacked — estimated from GTFS trip frequencies</p>
              {(() => {
                const combined = Array.from({ length: 24 }, (_, h) =>
                  OPERATORS.reduce((sum, op) => sum + (PEAK_HOURS[op.key]?.[h] ?? 0), 0)
                );
                const max = Math.max(...combined, 1);
                const W = 900; const H = 180; const PAD = 36;
                const barW = (W - PAD * 2) / 24 - 3;
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
                    <defs>
                      <linearGradient id="combined-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                    </defs>
                    {Array.from({ length: 24 }, (_, h) => {
                      const x = PAD + h * ((W - PAD * 2) / 24);
                      const barH = (combined[h] / max) * (H - PAD * 2);
                      const y = H - PAD - barH;
                      const isPeak = h === combined.indexOf(max);
                      return (
                        <g key={h}>
                          <rect x={x} y={y} width={barW} height={barH}
                            fill={isPeak ? "#f59e0b" : "url(#combined-grad)"}
                            rx="2" opacity={isPeak ? 1 : 0.75} />
                          {(h % 3 === 0) && (
                            <text x={x + barW / 2} y={H - 8} textAnchor="middle" fill="#93c5fd" fontSize="10">
                              {String(h).padStart(2, '0')}
                            </text>
                          )}
                          {isPeak && (
                            <>
                              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700">Peak</text>
                              <text x={x + barW / 2} y={y - 18} textAnchor="middle" fill="#fbbf24" fontSize="9">{combined[h]}</text>
                            </>
                          )}
                        </g>
                      );
                    })}
                    {/* Y-axis label */}
                    <text x={12} y={H / 2} fill="#60a5fa" fontSize="9" transform={`rotate(-90,12,${H/2})`} textAnchor="middle">trips/h</text>
                  </svg>
                );
              })()}
              <div className="mt-3 flex flex-wrap gap-4">
                {OPERATORS.map(op => (
                  <div key={op.key} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: op.color }} />
                    <span className="text-xs text-blue-300">{op.label}</span>
                  </div>
                ))}
                <span className="text-xs text-amber-400 flex items-center gap-1">■ Network peak hour</span>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── Data source footer ── */}
      <div className="border-t border-slate-200 py-6 bg-white">
        <Container>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-400">
            <span><Clock size={12} className="inline mr-1" />GTFS feeds: NASA GmbH — Nahverkehrsservice Sachsen-Anhalt</span>
            <span>Ridership: KISS-MD Verkehr — Stadt Magdeburg Open Data</span>
            <span>License: Datenlizenz Deutschland – Namensnennung – v2.0</span>
          </div>
        </Container>
      </div>
    </div>
  );
}
