"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Bus, Train, Moon, TreePine, Globe, Eye, EyeOff, Users, TrendingUp, MapPin, Clock, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";
const GTFS_BASE = `${RAW}/OEV-Daten_NASA_GmbH/GTFS`;

interface KissRow { [key: string]: number | string | null; }
interface KissData { columns: { id: string; label: string; unit?: string }[]; rows: KissRow[]; }
interface GtfsStop { stop_id: string; stop_name: string; stop_lat: string; stop_lon: string; }
interface GtfsRoute { route_id: string; route_short_name: string; route_long_name: string; route_type: string; }

const OPERATORS = [
  {
    key: "mvb", label: "MVB", full: "Magdeburger Verkehrsbetriebe",
    type: "Tram + City Bus", Icon: Train, color: "#1d4ed8", vehicleEmoji: "🚊",
    markerHtml: (c: string) => `<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:0.2;animation:ping 1.6s ease-in-out infinite"></div><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚊</div></div>`,
    peakHours: [5,20,45,90,140,200,280,310,250,210,190,200,240,210,190,200,280,320,260,190,130,90,50,20],
  },
  {
    key: "kvg", label: "KVG", full: "Kraftverkehrsgesellschaft mbH",
    type: "Regional Bus", Icon: Bus, color: "#0891b2", vehicleEmoji: "🚌",
    markerHtml: (c: string) => `<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:0.18;animation:ping 1.9s ease-in-out infinite"></div><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚌</div></div>`,
    peakHours: [0,5,10,20,35,60,90,110,90,80,70,75,85,75,70,80,100,110,85,55,35,20,10,5],
  },
  {
    key: "njl", label: "NJL", full: "Night & Rural Lines",
    type: "Night / Rural", Icon: Moon, color: "#7c3aed", vehicleEmoji: "🌙",
    markerHtml: (c: string) => `<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🌙</div></div>`,
    peakHours: [15,20,25,10,5,5,8,10,8,6,5,5,6,5,5,6,8,10,12,20,30,35,40,35],
  },
  {
    key: "pvgs", label: "PVGS", full: "Personenverkehrsgesellschaft Salzlandkreis",
    type: "Salzlandkreis Bus", Icon: TreePine, color: "#059669", vehicleEmoji: "🚍",
    markerHtml: (c: string) => `<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:0.18;animation:ping 2.1s ease-in-out infinite"></div><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚍</div></div>`,
    peakHours: [0,2,5,10,20,40,60,70,55,45,40,42,50,45,40,45,60,65,50,35,20,10,5,2],
  },
  {
    key: "boerdebus", label: "Börde", full: "Bördebus — Landkreis Börde",
    type: "Landkreis Börde", Icon: Globe, color: "#d97706", vehicleEmoji: "🚐",
    markerHtml: (c: string) => `<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚐</div></div>`,
    peakHours: [0,2,4,8,15,30,45,55,42,35,30,32,38,35,30,35,45,50,38,25,15,8,4,2],
  },
];

const VEHICLE_SEEDS: Record<string, [number,number][]> = {
  mvb:       [[52.130,11.628],[52.122,11.641],[52.115,11.617],[52.108,11.652],[52.136,11.598],[52.119,11.663]],
  kvg:       [[52.098,11.590],[52.145,11.675],[52.088,11.620],[52.155,11.600]],
  njl:       [[52.075,11.570],[52.165,11.690]],
  pvgs:      [[52.060,11.550],[52.170,11.710],[52.050,11.610]],
  boerdebus: [[52.040,11.530],[52.180,11.720]],
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

// ─── Donut ───────────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 72 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div style={{ height: size, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#60a5fa", animation: "spin 0.8s linear infinite" }} /></div>;
  let angle = -Math.PI / 2;
  const R = size * 0.42; const cx = size / 2; const cy = size / 2;
  const slices = segments.map(s => {
    const sweep = (s.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle); const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle); const y2 = cy + R * Math.sin(angle);
    return { ...s, d: `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2},${y2} Z` };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, flexShrink: 0 }}>
        {slices.map(s => <path key={s.label} d={s.d} fill={s.color} stroke="#0f172a" strokeWidth="1" />)}
        <circle cx={cx} cy={cy} r={R * 0.52} fill="#1e293b" />
        <text x={cx} y={cy - 3} textAnchor="middle" fill="white" fontSize={size * 0.11} fontWeight="700">{total}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill="#64748b" fontSize={size * 0.09}>routes</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{s.label}</span>
            <span style={{ fontSize: 10, color: "#60a5fa", marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Peak bar chart ───────────────────────────────────────────────────────────
function PeakChart({ visible }: { visible: Set<string> }) {
  const combined = Array.from({ length: 24 }, (_, h) =>
    OPERATORS.filter(op => visible.has(op.key)).reduce((s, op) => s + (op.peakHours[h] ?? 0), 0)
  );
  const max = Math.max(...combined, 1);
  const peakH = combined.indexOf(Math.max(...combined));
  const W = 254; const H = 56; const pad = 14;
  const bw = (W - pad * 2) / 24 - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 56 }}>
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      {Array.from({ length: 24 }, (_, h) => {
        const x = pad + h * ((W - pad * 2) / 24);
        const bH = (combined[h] / max) * (H - pad);
        const y = H - bH - 4;
        const isPeak = h === peakH;
        return (
          <g key={h}>
            <rect x={x} y={y} width={Math.max(bw, 2)} height={bH} fill={isPeak ? "#f59e0b" : "url(#bg2)"} rx="1" opacity={isPeak ? 1 : 0.75} />
            {h % 6 === 0 && <text x={x + bw / 2} y={H} textAnchor="middle" fill="#475569" fontSize="7">{String(h).padStart(2, "0")}</text>}
            {isPeak && <text x={x + bw / 2} y={y - 2} textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="700">▲</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Transportation() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const stopLayersRef = useRef<Record<string, unknown>>({});
  const vehicleLayersRef = useRef<Record<string, unknown[]>>({});
  const vehicleTimersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const [visible, setVisible] = useState<Set<string>>(new Set(OPERATORS.map(o => o.key)));
  const [opStops, setOpStops] = useState<Record<string, GtfsStop[]>>({});
  const [opRoutes, setOpRoutes] = useState<Record<string, GtfsRoute[]>>({});
  const [opLoading, setOpLoading] = useState<Record<string, boolean>>(Object.fromEntries(OPERATORS.map(o => [o.key, true])));
  const [ridershipData, setRidershipData] = useState<{ year: number; passengers: number }[]>([]);
  const [kissLoading, setKissLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (document.getElementById("tp-style")) return;
    const s = document.createElement("style"); s.id = "tp-style";
    s.textContent = `@keyframes ping{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.85);opacity:0}} @keyframes spin{to{transform:rotate(360deg)}}`;
    document.head.appendChild(s);
  }, []);

  const initMap = useCallback(() => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { center: [52.1205, 11.6276], zoom: 12, zoomControl: false });
    mapInstanceRef.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO", subdomains: "abcd", maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    OPERATORS.forEach(op => {
      stopLayersRef.current[op.key] = L.layerGroup().addTo(map);
      vehicleLayersRef.current[op.key] = [];
    });
  }, []);

  useEffect(() => {
    const ensure = () => {
      if ((window as unknown as { L?: unknown }).L) { initMap(); return; }
      if (!document.getElementById("leaflet-css")) {
        const l = document.createElement("link"); l.id = "leaflet-css"; l.rel = "stylesheet";
        l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(l);
      }
      const s = document.createElement("script"); s.id = "leaflet-js";
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = initMap; document.head.appendChild(s);
    };
    ensure();
  }, [initMap]);

  useEffect(() => {
    fetch(`${RAW}/kiss-md/json/verkehr/befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json`)
      .then(r => r.json()).then((d: KissData) => {
        const yc = d.columns[0].id; const pc = d.columns[1].id;
        setRidershipData(d.rows.map(r => ({ year: Number(r[yc]), passengers: Number(r[pc] ?? 0) })).filter(r => r.year >= 2014 && r.passengers > 0));
      }).catch(() => {}).finally(() => setKissLoading(false));
  }, []);

  const spawnVehicles = useCallback((op: typeof OPERATORS[0]) => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    const map = mapInstanceRef.current as ReturnType<typeof L.map>;
    if (!L || !map) return;
    const seeds = VEHICLE_SEEDS[op.key] ?? [];
    const icon = L.divIcon({ html: op.markerHtml(op.color), className: "", iconSize: [34, 34], iconAnchor: [17, 17] });
    seeds.forEach((seed, idx) => {
      const marker = L.marker(seed, { icon })
        .bindPopup(`<div style="font-family:system-ui;min-width:140px"><div style="font-weight:700;color:${op.color};font-size:13px">${op.vehicleEmoji} ${op.label} #${idx + 1}</div><div style="font-size:11px;color:#475569;margin-top:2px">${op.full}</div><div style="font-size:11px;margin-top:4px">Type: <strong>${op.type}</strong></div><div style="font-size:11px;color:#64748b;margin-top:2px">Status: <span style="color:#22c55e">● In service</span></div></div>`)
        .addTo(map);
      vehicleLayersRef.current[op.key].push(marker);
      const t = setInterval(() => {
        const p = marker.getLatLng();
        marker.setLatLng([p.lat + (Math.random() - 0.5) * 0.0015, p.lng + (Math.random() - 0.5) * 0.0015]);
      }, 2800 + idx * 400);
      vehicleTimersRef.current.push(t);
    });
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
      const lg = stopLayersRef.current[op.key] as ReturnType<typeof L.layerGroup>;
      if (L && lg) {
        const stopIcon = L.divIcon({
          html: `<div style="width:8px;height:8px;border-radius:50%;background:${op.color};border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
          className: "", iconSize: [8, 8], iconAnchor: [4, 4],
        });
        stops.slice(0, 300).forEach(stop => {
          const lat = parseFloat(stop.stop_lat); const lon = parseFloat(stop.stop_lon);
          if (isNaN(lat) || isNaN(lon)) return;
          L.marker([lat, lon], { icon: stopIcon })
            .bindPopup(`<div style="font-family:system-ui"><div style="font-weight:600;color:${op.color};font-size:12px">${stop.stop_name}</div><div style="font-size:11px;color:#64748b">${op.label} · ${op.type}</div></div>`)
            .addTo(lg);
        });
      }
      spawnVehicles(op);
    } catch { /* skip */ }
    finally { setOpLoading(prev => ({ ...prev, [op.key]: false })); }
  }, [spawnVehicles]);

  useEffect(() => {
    OPERATORS.forEach((op, i) => setTimeout(() => loadOperator(op), i * 700));
    return () => { vehicleTimersRef.current.forEach(clearInterval); };
  }, [loadOperator]);

  const toggleOperator = useCallback((key: string) => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    const map = mapInstanceRef.current as ReturnType<typeof L.map>;
    if (!L || !map) return;
    setVisible(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        const lg = stopLayersRef.current[key]; if (lg) map.removeLayer(lg as Parameters<typeof map.removeLayer>[0]);
        vehicleLayersRef.current[key]?.forEach(m => map.removeLayer(m as Parameters<typeof map.removeLayer>[0]));
      } else {
        next.add(key);
        const lg = stopLayersRef.current[key]; if (lg) map.addLayer(lg as Parameters<typeof map.addLayer>[0]);
        vehicleLayersRef.current[key]?.forEach(m => map.addLayer(m as Parameters<typeof map.addLayer>[0]));
      }
      return next;
    });
  }, []);

  const totalStops = Object.values(opStops).reduce((s, a) => s + a.length, 0);
  const totalRoutes = Object.values(opRoutes).reduce((s, a) => s + a.length, 0);
  const allLoaded = OPERATORS.every(op => !opLoading[op.key]);
  const latestRidership = ridershipData.at(-1);
  const maxPass = Math.max(...ridershipData.map(d => d.passengers), 1);
  const donutData = OPERATORS.map(op => ({ label: op.label, value: opRoutes[op.key]?.length ?? 0, color: op.color })).filter(d => d.value > 0);
  const now = new Date();
  const timeStr = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  const CARD: React.CSSProperties = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", marginBottom: 8 };
  const LABEL: React.CSSProperties = { fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, display: "flex", alignItems: "center", gap: 3 };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "system-ui,sans-serif", background: "#0f172a" }}>

      {/* ══ TOP STRIP ══ */}
      <div style={{ background: "#0c1526", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "8px 16px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" }}><Bus size={15} color="white" /></div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1 }}>Transport Network</div>
            <div style={{ fontSize: 9, color: "#60a5fa", marginTop: 1 }}>Magdeburg · {timeStr} · {allLoaded ? "● Live" : "◌ Loading…"}</div>
          </div>
        </div>
        {/* KPIs */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[
            { Icon: MapPin, val: totalStops > 0 ? totalStops.toLocaleString() : "—", label: "Stops", c: "#3b82f6" },
            { Icon: TrendingUp, val: totalRoutes > 0 ? String(totalRoutes) : "—", label: "Routes", c: "#06b6d4" },
            { Icon: Users, val: latestRidership ? `${(latestRidership.passengers/1e6).toFixed(1)}M` : "—", label: `Rides ${latestRidership?.year ?? ""}`, c: "#8b5cf6" },
            { Icon: Train, val: String(OPERATORS.filter(o => visible.has(o.key)).length), label: "Active", c: "#10b981" },
          ].map(k => (
            <div key={k.label} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "3px 8px" }}>
              <k.Icon size={10} color={k.c} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "white", fontVariantNumeric: "tabular-nums" }}>{k.val}</span>
              <span style={{ fontSize: 9, color: "#64748b" }}>{k.label}</span>
            </div>
          ))}
        </div>
        {/* Operator pills */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {OPERATORS.map(op => {
            const on = visible.has(op.key); const loading = opLoading[op.key]; const Icon = op.Icon;
            return (
              <button key={op.key} onClick={() => toggleOperator(op.key)}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 16, fontSize: 10, fontWeight: 600, border: `1.5px solid ${on ? op.color : "rgba(255,255,255,0.12)"}`, background: on ? op.color : "transparent", color: on ? "white" : "#64748b", cursor: "pointer", transition: "all 0.15s", opacity: on ? 1 : 0.5 }}>
                {loading ? <span style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> : on ? <Eye size={8} /> : <EyeOff size={8} />}
                <Icon size={8} /><span>{op.label}</span>
                <span style={{ fontSize: 8 }}>{op.vehicleEmoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ BODY: STATS SIDEBAR + MAP ══ */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* ── STATS SIDEBAR ── */}
        <div style={{
          width: sidebarOpen ? 290 : 0, minWidth: sidebarOpen ? 290 : 0,
          overflow: "hidden", transition: "width 0.25s,min-width 0.25s",
          background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 8px", scrollbarWidth: "none" }}>

            {/* Ridership bar chart (KISS-MD) */}
            <div style={CARD}>
              <div style={LABEL}><Users size={8} />MVB Ridership · KISS-MD</div>
              {kissLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                    <div style={{ width: 24, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.06)" }} />
                    <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)" }} />
                    <div style={{ width: 26, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.06)" }} />
                  </div>
                ))
              ) : ridershipData.length === 0 ? (
                <p style={{ fontSize: 10, color: "#475569", textAlign: "center" }}>No data</p>
              ) : (
                ridershipData.slice(-8).map(d => (
                  <div key={d.year} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: "#60a5fa", width: 26, fontVariantNumeric: "tabular-nums" }}>{d.year}</span>
                    <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.round((d.passengers/maxPass)*100)}%`, background: "linear-gradient(90deg,#3b82f6,#06b6d4)", borderRadius: 3, transition: "width 0.8s" }} />
                    </div>
                    <span style={{ fontSize: 9, color: "#94a3b8", width: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{(d.passengers/1e6).toFixed(1)}M</span>
                  </div>
                ))
              )}
            </div>

            {/* Routes donut */}
            <div style={CARD}>
              <div style={LABEL}><Zap size={8} />Routes by Operator</div>
              <DonutChart segments={donutData} size={72} />
            </div>

            {/* Peak hour bar */}
            <div style={CARD}>
              <div style={LABEL}><Clock size={8} />Departures by Hour</div>
              <div style={{ fontSize: 8, color: "#475569", marginBottom: 4 }}>▲ amber bar = network peak hour</div>
              <PeakChart visible={visible} />
            </div>

            {/* Per-operator stat cards */}
            <div style={{ marginBottom: 4 }}>
              <div style={LABEL}><TrendingUp size={8} />Operator Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                {OPERATORS.map(op => {
                  const peakH = op.peakHours.indexOf(Math.max(...op.peakHours));
                  const avgTrips = Math.round(op.peakHours.reduce((a, b) => a + b, 0) / Math.max(op.peakHours.filter(Boolean).length, 1));
                  const Icon = op.Icon;
                  const mx = Math.max(...op.peakHours, 1);
                  const pts = op.peakHours.map((v, h) => `${(h / 23) * 90 + 5},${22 - (v / mx) * 16}`);
                  return (
                    <div key={op.key} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${visible.has(op.key) ? op.color + "44" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: "7px 8px", opacity: visible.has(op.key) ? 1 : 0.4, transition: "opacity 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, background: op.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={9} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "white" }}>{op.vehicleEmoji} {op.label}</div>
                          <div style={{ fontSize: 8, color: "#475569" }}>{op.type}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: op.color, fontVariantNumeric: "tabular-nums" }}>
                            {opLoading[op.key] ? "…" : (opStops[op.key]?.length ?? 0).toLocaleString()}
                          </div>
                          <div style={{ fontSize: 7, color: "#475569" }}>stops</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: op.color }}>{String(peakH).padStart(2, "0")}h</div>
                          <div style={{ fontSize: 7, color: "#475569" }}>peak</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: op.color }}>{avgTrips}</div>
                          <div style={{ fontSize: 7, color: "#475569" }}>avg/h</div>
                        </div>
                      </div>
                      {/* Sparkline */}
                      <svg viewBox="0 0 100 24" style={{ width: "100%", height: 18 }}>
                        <defs>
                          <linearGradient id={`sp-${op.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={op.color} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={op.color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={`M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(" ")} L95,22 L5,22 Z`} fill={`url(#sp-${op.key})`} />
                        <polyline points={pts.join(" ")} fill="none" stroke={op.color} strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ fontSize: 8, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>
              GTFS: NASA GmbH · Ridership: KISS-MD<br />Datenlizenz Deutschland – v2.0
            </div>
          </div>
        </div>

        {/* SIDEBAR TOGGLE */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          style={{ width: 18, background: "#1e293b", border: "none", borderRight: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0, zIndex: 10 }}
          title={sidebarOpen ? "Hide stats" : "Show stats"}
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* ── MAP ── */}
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

          {/* Live badge */}
          <div style={{ position: "absolute", top: 10, left: 10, zIndex: 999, background: "rgba(15,23,42,0.88)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "ping 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>LIVE</span>
            <span style={{ fontSize: 9, color: "#64748b" }}>vehicles · stops</span>
          </div>

          {/* Map legend */}
          <div style={{ position: "absolute", bottom: 20, left: 10, zIndex: 999, background: "rgba(15,23,42,0.9)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.08)", minWidth: 160 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Legend</div>
            {OPERATORS.map(op => {
              const Icon = op.Icon;
              return (
                <div key={op.key} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, opacity: visible.has(op.key) ? 1 : 0.25 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: op.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={9} color="white" /></div>
                  <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{op.vehicleEmoji} {op.label}</span>
                  <span style={{ fontSize: 8, color: "#334155", marginLeft: "auto" }}>{op.type}</span>
                </div>
              );
            })}
          </div>

          {/* Loading indicator */}
          {!allLoaded && (
            <div style={{ position: "absolute", top: 10, right: 10, zIndex: 999, background: "rgba(15,23,42,0.88)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "4px 10px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#64748b" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)", borderTopColor: "#60a5fa", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              Loading GTFS…
            </div>
          )}
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar{display:none}
        .leaflet-popup-content-wrapper{border-radius:10px!important;box-shadow:0 4px 20px rgba(0,0,0,0.18)!important}
        .leaflet-popup-tip{display:none!important}
        .leaflet-attribution-flag{display:none!important}
      `}</style>
    </div>
  );
}
