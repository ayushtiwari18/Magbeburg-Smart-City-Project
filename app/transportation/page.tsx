"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Bus, Train, Clock, Users, TrendingUp, Zap, Moon, TreePine, Globe, Eye, EyeOff } from "lucide-react";
import Container from "@/components/layout/Container";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";
const GTFS_BASE = `${RAW}/OEV-Daten_NASA_GmbH/GTFS`;

interface KissRow { [key: string]: number | string | null; }
interface KissData { columns: { id: string; label: string; unit?: string }[]; rows: KissRow[]; }
interface GtfsStop { stop_id: string; stop_name: string; stop_lat: string; stop_lon: string; }
interface GtfsRoute { route_id: string; route_short_name: string; route_long_name: string; route_type: string; }

const OPERATORS = [
  {
    key: "mvb", label: "MVB", full: "Magdeburger Verkehrsbetriebe",
    type: "Tram + City Bus", Icon: Train, color: "#1e40af",
    markerSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12"><rect x="4" y="3" width="16" height="13" rx="2"/><rect x="6" y="17" width="3" height="3"/><rect x="15" y="17" width="3" height="3"/><rect x="7" y="6" width="4" height="4" rx="1" fill="#1e40af"/><rect x="13" y="6" width="4" height="4" rx="1" fill="#1e40af"/></svg>`,
    peakHours: [5,20,45,90,140,200,280,310,250,210,190,200,240,210,190,200,280,320,260,190,130,90,50,20],
  },
  {
    key: "kvg", label: "KVG", full: "Kraftverkehrsgesellschaft mbH",
    type: "Regional Bus", Icon: Bus, color: "#0891b2",
    markerSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12"><rect x="2" y="5" width="20" height="12" rx="2"/><rect x="5" y="17" width="3" height="3"/><rect x="16" y="17" width="3" height="3"/><rect x="5" y="8" width="4" height="3" rx="1" fill="#0891b2"/><rect x="10" y="8" width="4" height="3" rx="1" fill="#0891b2"/><rect x="15" y="8" width="4" height="3" rx="1" fill="#0891b2"/></svg>`,
    peakHours: [0,5,10,20,35,60,90,110,90,80,70,75,85,75,70,80,100,110,85,55,35,20,10,5],
  },
  {
    key: "njl", label: "NJL", full: "Night & Rural Lines",
    type: "Night / Rural", Icon: Moon, color: "#7c3aed",
    markerSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    peakHours: [15,20,25,10,5,5,8,10,8,6,5,5,6,5,5,6,8,10,12,20,30,35,40,35],
  },
  {
    key: "pvgs", label: "PVGS", full: "Personenverkehrsgesellschaft Salzlandkreis",
    type: "Salzlandkreis Bus", Icon: TreePine, color: "#059669",
    markerSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12"><polygon points="12,2 19,14 5,14"/><rect x="10" y="14" width="4" height="5"/></svg>`,
    peakHours: [0,2,5,10,20,40,60,70,55,45,40,42,50,45,40,45,60,65,50,35,20,10,5,2],
  },
  {
    key: "boerdebus", label: "Börde", full: "Bördebus — Landkreis Börde",
    type: "Landkreis Börde", Icon: Globe, color: "#d97706",
    markerSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="9"/><path d="M12 3c-2 3-3 5.5-3 9s1 6 3 9M12 3c2 3 3 5.5 3 9s-1 6-3 9M3 12h18"/></svg>`,
    peakHours: [0,2,4,8,15,30,45,55,42,35,30,32,38,35,30,35,45,50,38,25,15,8,4,2],
  },
];

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

// ─── Donut chart ───────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="flex items-center justify-center h-28"><div className="h-6 w-6 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" /></div>;
  let angle = -Math.PI / 2;
  const R = 48; const cx = 56; const cy = 56;
  const slices = segments.map(s => {
    const sweep = (s.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle); const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle); const y2 = cy + R * Math.sin(angle);
    return { ...s, d: `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2},${y2} Z` };
  });
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 112 112" className="w-20 h-20 flex-shrink-0">
        {slices.map(s => <path key={s.label} d={s.d} fill={s.color} stroke="white" strokeWidth="1.5" />)}
        <circle cx={cx} cy={cy} r="26" fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="700">{total}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#94a3b8" fontSize="7">routes</text>
      </svg>
      <div className="flex flex-col gap-1">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-slate-600">{s.label}</span>
            <span className="text-xs text-slate-400 tabular-nums ml-auto pl-2">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Combined peak bar chart ───────────────────────────────────────────────
function CombinedPeakChart({ visible }: { visible: Set<string> }) {
  const combined = Array.from({ length: 24 }, (_, h) =>
    OPERATORS.filter(op => visible.has(op.key)).reduce((sum, op) => sum + (op.peakHours[h] ?? 0), 0)
  );
  const max = Math.max(...combined, 1);
  const W = 800; const H = 110; const PAD = 24;
  const barW = Math.max(4, (W - PAD * 2) / 24 - 2);
  const peakH = combined.indexOf(Math.max(...combined));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }}>
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75,1].map(f => (
        <line key={f} x1={PAD} y1={H - PAD - f*(H-PAD*2)} x2={W-PAD} y2={H - PAD - f*(H-PAD*2)} stroke="#e2e8f0" strokeWidth="0.8"/>
      ))}
      {Array.from({ length: 24 }, (_, h) => {
        const x = PAD + h * ((W-PAD*2)/24);
        const bH = (combined[h] / max) * (H - PAD*2);
        const y = H - PAD - bH;
        const isPeak = h === peakH;
        return (
          <g key={h}>
            <rect x={x} y={y} width={barW} height={bH} fill={isPeak ? "#f59e0b" : "url(#bar-grad)"} rx="2" opacity={isPeak ? 1 : 0.8} />
            {h % 6 === 0 && <text x={x+barW/2} y={H-5} textAnchor="middle" fill="#94a3b8" fontSize="8">{String(h).padStart(2,'0')}:00</text>}
            {isPeak && <text x={x+barW/2} y={y-4} textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="700">▲ {combined[h]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function Transportation() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const layerGroupsRef = useRef<Record<string, unknown>>({});

  const [visible, setVisible] = useState<Set<string>>(new Set(OPERATORS.map(o => o.key)));
  const [opStops, setOpStops] = useState<Record<string, GtfsStop[]>>({});
  const [opRoutes, setOpRoutes] = useState<Record<string, GtfsRoute[]>>({});
  const [opLoading, setOpLoading] = useState<Record<string, boolean>>(Object.fromEntries(OPERATORS.map(o => [o.key, true])));
  const [ridershipData, setRidershipData] = useState<{ year: number; passengers: number }[]>([]);
  const [kissLoading, setKissLoading] = useState(true);

  const initMap = useCallback(() => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { center: [52.1205, 11.6276], zoom: 10, zoomControl: true });
    mapInstanceRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors", maxZoom: 18,
    }).addTo(map);
    OPERATORS.forEach(op => {
      const lg = L.layerGroup().addTo(map);
      layerGroupsRef.current[op.key] = lg;
    });
  }, []);

  useEffect(() => {
    const ensureLeaflet = () => {
      if ((window as unknown as { L?: unknown }).L) { initMap(); return; }
      if (!document.getElementById("leaflet-css")) {
        const l = document.createElement("link"); l.id="leaflet-css"; l.rel="stylesheet";
        l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(l);
      }
      const s = document.createElement("script"); s.id="leaflet-js";
      s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = initMap; document.head.appendChild(s);
    };
    ensureLeaflet();
  }, [initMap]);

  useEffect(() => {
    fetch(`${RAW}/kiss-md/json/verkehr/befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json`)
      .then(r => r.json()).then((d: KissData) => {
        const yc = d.columns[0].id; const pc = d.columns[1].id;
        setRidershipData(d.rows.map(r => ({ year: Number(r[yc]), passengers: Number(r[pc] ?? 0) })).filter(r => r.year >= 2012 && r.passengers > 0));
      }).catch(()=>{}).finally(()=>setKissLoading(false));
  }, []);

  const loadOperator = useCallback(async (op: typeof OPERATORS[0]) => {
    try {
      await loadJSZip();
      const zipUrl = `${GTFS_BASE}/gtfs_${op.key}_std_kn.zip`;
      const [routes, stops] = await Promise.all([
        parseGtfsFile<GtfsRoute>(zipUrl, "routes.txt"),
        parseGtfsFile<GtfsStop>(zipUrl, "stops.txt"),
      ]);
      setOpRoutes(prev => ({ ...prev, [op.key]: routes }));
      setOpStops(prev => ({ ...prev, [op.key]: stops }));
      const L = (window as unknown as { L: typeof import("leaflet") }).L;
      const lg = layerGroupsRef.current[op.key] as ReturnType<typeof L.layerGroup>;
      if (L && lg) {
        const iconHtml = `<div style="width:20px;height:20px;background:${op.color};border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.3)">${op.markerSvg}</div>`;
        const icon = L.divIcon({ html: iconHtml, className: "", iconSize: [20,20], iconAnchor: [10,10] });
        stops.slice(0, 500).forEach(stop => {
          const lat = parseFloat(stop.stop_lat); const lon = parseFloat(stop.stop_lon);
          if (isNaN(lat) || isNaN(lon)) return;
          L.marker([lat, lon], { icon })
            .bindPopup(`<div style="min-width:140px"><strong style="color:${op.color}">${op.label}</strong><br/><span style="font-size:12px">${stop.stop_name}</span><br/><span style="font-size:11px;color:#64748b">${op.type}</span></div>`)
            .addTo(lg);
        });
      }
    } catch { /* skip */ }
    finally { setOpLoading(prev => ({ ...prev, [op.key]: false })); }
  }, []);

  useEffect(() => {
    OPERATORS.forEach((op, i) => setTimeout(() => loadOperator(op), i * 600));
  }, [loadOperator]);

  const toggleOperator = useCallback((key: string) => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    const map = mapInstanceRef.current as ReturnType<typeof L.map>;
    const lg = layerGroupsRef.current[key] as ReturnType<typeof L.layerGroup>;
    if (!L || !map || !lg) return;
    setVisible(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); map.removeLayer(lg as unknown as Parameters<typeof map.removeLayer>[0]); }
      else { next.add(key); map.addLayer(lg as unknown as Parameters<typeof map.addLayer>[0]); }
      return next;
    });
  }, []);

  const totalStops = Object.values(opStops).reduce((s, a) => s + a.length, 0);
  const totalRoutes = Object.values(opRoutes).reduce((s, a) => s + a.length, 0);
  const allLoaded = OPERATORS.every(op => !opLoading[op.key]);
  const maxPass = Math.max(...ridershipData.map(d => d.passengers), 1);
  const donutData = OPERATORS.map(op => ({ label: op.label, value: opRoutes[op.key]?.length ?? 0, color: op.color })).filter(d => d.value > 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ══════════════════ 1. HEADER ══════════════════ */}
      <div className="bg-[#061B46] border-b border-white/10">
        <Container>
          <div className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bus className="h-5 w-5 text-blue-300" />
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">Smart City Magdeburg 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Public Transport Network</h1>
              <p className="text-sm text-blue-300 mt-1">All 5 operators · Live GTFS feeds · NASA GmbH Sachsen-Anhalt</p>
            </div>
            <div className="flex gap-6">
              {[
                { icon: Bus, label: "Stops", value: totalStops > 0 ? totalStops.toLocaleString() : "…" },
                { icon: TrendingUp, label: "Routes", value: totalRoutes > 0 ? totalRoutes.toString() : "…" },
                { icon: Users, label: "Rides/yr", value: ridershipData.length > 0 ? `${(ridershipData.at(-1)!.passengers/1e6).toFixed(1)}M` : "…" },
              ].map(k => (
                <div key={k.label} className="text-center">
                  <div className="text-2xl font-bold text-white tabular-nums">{k.value}</div>
                  <div className="text-xs text-blue-400">{k.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ══════════════════ 2. ANALYTICS (TOP) ══════════════════ */}
      <section className="bg-[#061B46] pb-10 pt-8">
        <Container>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-300" />
            <h2 className="text-lg font-bold text-white">Network Analytics</h2>
            <span className="text-xs text-blue-400 ml-2">KISS-MD + GTFS data</span>
          </div>

          {/* Row 1: Ridership + Donut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">

            {/* Ridership bar chart */}
            <div className="md:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-bold text-white">MVB Annual Ridership</span>
              </div>
              <p className="text-xs text-blue-400 mb-3">Source: KISS-MD · befoerderte-personen-der-mvb</p>
              {kissLoading ? (
                <div className="space-y-2">{Array.from({length:6}).map((_,i)=><div key={i} className="h-3 bg-white/10 rounded animate-pulse" />)}</div>
              ) : ridershipData.length === 0 ? (
                <p className="text-sm text-blue-400 text-center py-6">No ridership data available</p>
              ) : (
                <div className="space-y-2">
                  {ridershipData.map(d => (
                    <div key={d.year} className="flex items-center gap-3">
                      <span className="text-xs text-blue-300 w-9 tabular-nums">{d.year}</span>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${Math.round((d.passengers/maxPass)*100)}%`, transition: "width 0.7s" }} />
                      </div>
                      <span className="text-xs text-blue-200 tabular-nums w-12 text-right">{(d.passengers/1e6).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Routes donut */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-bold text-white">Routes by Operator</span>
              </div>
              <p className="text-xs text-blue-400 mb-3">Live GTFS feeds</p>
              <DonutChart segments={donutData} />
            </div>
          </div>

          {/* Row 2: Peak-hour chart (full width) */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-bold text-white">Departures by Hour — Visible Operators</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {OPERATORS.map(op => (
                  <div key={op.key} className={`flex items-center gap-1.5 transition-opacity ${visible.has(op.key) ? "opacity-100" : "opacity-30"}`}>
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: op.color }} />
                    <span className="text-[10px] text-blue-300">{op.label}</span>
                  </div>
                ))}
                <span className="text-[10px] text-amber-400">▲ peak hour</span>
              </div>
            </div>
            <p className="text-xs text-blue-400 mb-3">Toggle operators using the map pills below · estimated from GTFS trip frequencies</p>
            <CombinedPeakChart visible={visible} />
          </div>

          {/* Row 3: Per-operator mini stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {OPERATORS.map(op => {
              const peakH = op.peakHours.indexOf(Math.max(...op.peakHours));
              const avgTrips = Math.round(op.peakHours.reduce((a,b)=>a+b,0) / op.peakHours.filter(Boolean).length);
              const Icon = op.Icon;
              return (
                <div key={op.key}
                  className={`rounded-xl bg-white/5 border border-white/10 p-4 transition-opacity ${visible.has(op.key) ? "opacity-100" : "opacity-40"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: op.color }}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{op.label}</div>
                      <div className="text-[10px] text-blue-400">{op.type}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    <div className="text-center">
                      <div className="text-base font-bold tabular-nums" style={{ color: op.color }}>
                        {opLoading[op.key] ? "…" : (opStops[op.key]?.length ?? 0).toLocaleString()}
                      </div>
                      <div className="text-[9px] text-blue-400">stops</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold tabular-nums" style={{ color: op.color }}>
                        {String(peakH).padStart(2,'0')}h
                      </div>
                      <div className="text-[9px] text-blue-400">peak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold tabular-nums" style={{ color: op.color }}>{avgTrips}</div>
                      <div className="text-[9px] text-blue-400">avg/h</div>
                    </div>
                  </div>
                  {/* Sparkline */}
                  <svg viewBox="0 0 200 32" className="w-full" style={{ height: 32 }}>
                    <defs>
                      <linearGradient id={`sp-${op.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={op.color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={op.color} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const mx = Math.max(...op.peakHours, 1);
                      const pts = op.peakHours.map((v,h) => `${(h/23)*180+10},${30-(v/mx)*24}`);
                      const area = `M${pts[0]} ${pts.slice(1).map(p=>`L${p}`).join(" ")} L190,30 L10,30 Z`;
                      return (
                        <>
                          <path d={area} fill={`url(#sp-${op.key})`} />
                          <polyline points={pts.join(" ")} fill="none" stroke={op.color} strokeWidth="1.5" strokeLinejoin="round" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ══════════════════ 3. MAP (BOTTOM) ══════════════════ */}
      <section className="bg-white py-8">
        <Container>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Live Stop Map</h2>
              <p className="text-xs text-slate-500">All operators · click a marker for details · toggle with pills</p>
            </div>
            {/* Operator toggle pills */}
            <div className="flex flex-wrap gap-2">
              {OPERATORS.map(op => {
                const on = visible.has(op.key);
                const loading = opLoading[op.key];
                const Icon = op.Icon;
                return (
                  <button
                    key={op.key}
                    onClick={() => toggleOperator(op.key)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                      on ? "text-white border-transparent shadow-sm" : "bg-white text-slate-400 border-slate-200 opacity-60"
                    }`}
                    style={on ? { backgroundColor: op.color, borderColor: op.color } : {}}
                  >
                    {loading ? (
                      <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    ) : on ? <Eye size={10} /> : <EyeOff size={10} />}
                    <Icon size={10} />
                    <span>{op.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            {!allLoaded && (
              <div className="absolute top-3 right-3 z-[999] flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 shadow text-xs text-slate-500">
                <span className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
                Loading operator data…
              </div>
            )}
            {/* Legend overlay */}
            <div className="absolute bottom-3 left-3 z-[999] bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 flex flex-col gap-1.5 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Legend</div>
              {OPERATORS.map(op => (
                <div key={op.key} className={`flex items-center gap-2 transition-opacity ${visible.has(op.key) ? "opacity-100" : "opacity-30"}`}>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: op.color }} />
                  <span className="text-[10px] font-medium text-slate-600">{op.label}</span>
                  <span className="text-[9px] text-slate-400">{op.type}</span>
                </div>
              ))}
            </div>
            <div ref={mapRef} style={{ height: "65vh", minHeight: 440 }} />
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Stop data: <strong>GTFS</strong> — NASA GmbH / Nahverkehrsservice Sachsen-Anhalt.
            Tiles: © OpenStreetMap contributors.
          </p>
        </Container>
      </section>

      {/* Footer */}
      <div className="border-t border-slate-200 py-4 bg-white">
        <Container>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-xs text-slate-400">
            <span>GTFS: NASA GmbH — Nahverkehrsservice Sachsen-Anhalt</span>
            <span>Ridership: KISS-MD — Stadt Magdeburg Open Data</span>
            <span>License: Datenlizenz Deutschland – Namensnennung – v2.0</span>
          </div>
        </Container>
      </div>
    </div>
  );
}
