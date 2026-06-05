"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Bus, Train, Moon, TreePine, Globe, Eye, EyeOff, Users, TrendingUp, MapPin } from "lucide-react";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";
const GTFS_BASE = `${RAW}/OEV-Daten_NASA_GmbH/GTFS`;

interface KissRow { [key: string]: number | string | null; }
interface KissData { columns: { id: string; label: string; unit?: string }[]; rows: KissRow[]; }
interface GtfsStop { stop_id: string; stop_name: string; stop_lat: string; stop_lon: string; }
interface GtfsRoute { route_id: string; route_short_name: string; route_long_name: string; route_type: string; }

const OPERATORS = [
  {
    key: "mvb", label: "MVB", full: "Magdeburger Verkehrsbetriebe",
    type: "Tram + City Bus", Icon: Train, color: "#1d4ed8",
    vehicleEmoji: "🚊",
    // Animated tram SVG marker
    markerHtml: (color: string) =>
      `<div style="position:relative;width:34px;height:34px">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.2;animation:ping 1.6s ease-in-out infinite"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚊</div>
      </div>`,
    peakHours: [5,20,45,90,140,200,280,310,250,210,190,200,240,210,190,200,280,320,260,190,130,90,50,20],
  },
  {
    key: "kvg", label: "KVG", full: "Kraftverkehrsgesellschaft mbH",
    type: "Regional Bus", Icon: Bus, color: "#0891b2",
    vehicleEmoji: "🚌",
    markerHtml: (color: string) =>
      `<div style="position:relative;width:34px;height:34px">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.18;animation:ping 1.9s ease-in-out infinite"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚌</div>
      </div>`,
    peakHours: [0,5,10,20,35,60,90,110,90,80,70,75,85,75,70,80,100,110,85,55,35,20,10,5],
  },
  {
    key: "njl", label: "NJL", full: "Night & Rural Lines",
    type: "Night / Rural", Icon: Moon, color: "#7c3aed",
    vehicleEmoji: "🌙",
    markerHtml: (color: string) =>
      `<div style="position:relative;width:34px;height:34px">
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🌙</div>
      </div>`,
    peakHours: [15,20,25,10,5,5,8,10,8,6,5,5,6,5,5,6,8,10,12,20,30,35,40,35],
  },
  {
    key: "pvgs", label: "PVGS", full: "Personenverkehrsgesellschaft Salzlandkreis",
    type: "Salzlandkreis Bus", Icon: TreePine, color: "#059669",
    vehicleEmoji: "🚍",
    markerHtml: (color: string) =>
      `<div style="position:relative;width:34px;height:34px">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.18;animation:ping 2.1s ease-in-out infinite"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚍</div>
      </div>`,
    peakHours: [0,2,5,10,20,40,60,70,55,45,40,42,50,45,40,45,60,65,50,35,20,10,5,2],
  },
  {
    key: "boerdebus", label: "Börde", full: "Bördebus — Landkreis Börde",
    type: "Landkreis Börde", Icon: Globe, color: "#d97706",
    vehicleEmoji: "🚐",
    markerHtml: (color: string) =>
      `<div style="position:relative;width:34px;height:34px">
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚐</div>
      </div>`,
    peakHours: [0,2,4,8,15,30,45,55,42,35,30,32,38,35,30,35,45,50,38,25,15,8,4,2],
  },
];

// Simulated vehicle positions near Magdeburg (representative lat/lon clusters per operator)
const VEHICLE_SEEDS: Record<string, [number, number][]> = {
  mvb:       [[52.130, 11.628],[52.122, 11.641],[52.115, 11.617],[52.108, 11.652],[52.136, 11.598],[52.119, 11.663]],
  kvg:       [[52.098, 11.590],[52.145, 11.675],[52.088, 11.620],[52.155, 11.600]],
  njl:       [[52.075, 11.570],[52.165, 11.690]],
  pvgs:      [[52.060, 11.550],[52.170, 11.710],[52.050, 11.610]],
  boerdebus: [[52.040, 11.530],[52.180, 11.720]],
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
  const [hoveredOp, setHoveredOp] = useState<string | null>(null);

  // Inject ping keyframe once
  useEffect(() => {
    if (document.getElementById("ping-style")) return;
    const style = document.createElement("style");
    style.id = "ping-style";
    style.textContent = `@keyframes ping{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.8);opacity:0}}`;
    document.head.appendChild(style);
  }, []);

  const initMap = useCallback(() => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, {
      center: [52.1205, 11.6276], zoom: 12, zoomControl: false,
      attributionControl: true,
    });
    mapInstanceRef.current = map;
    // Light clean tile
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      subdomains: "abcd", maxZoom: 19,
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

  // KISS-MD ridership
  useEffect(() => {
    fetch(`${RAW}/kiss-md/json/verkehr/befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json`)
      .then(r => r.json()).then((d: KissData) => {
        const yc = d.columns[0].id; const pc = d.columns[1].id;
        setRidershipData(d.rows.map(r => ({ year: Number(r[yc]), passengers: Number(r[pc] ?? 0) })).filter(r => r.year >= 2018 && r.passengers > 0));
      }).catch(() => {});
  }, []);

  // Spawn animated vehicle markers
  const spawnVehicles = useCallback((op: typeof OPERATORS[0]) => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    const map = mapInstanceRef.current as ReturnType<typeof L.map>;
    if (!L || !map) return;
    const seeds = VEHICLE_SEEDS[op.key] ?? [];
    const icon = L.divIcon({ html: op.markerHtml(op.color), className: "", iconSize: [34, 34], iconAnchor: [17, 17] });
    seeds.forEach((seed, idx) => {
      const marker = L.marker(seed, { icon })
        .bindPopup(
          `<div style="font-family:system-ui;min-width:140px">
            <div style="font-weight:700;color:${op.color};font-size:13px">${op.vehicleEmoji} ${op.label} Vehicle ${idx + 1}</div>
            <div style="font-size:11px;color:#475569;margin-top:2px">${op.full}</div>
            <div style="font-size:11px;margin-top:4px">Type: <strong>${op.type}</strong></div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">Status: <span style="color:#22c55e">● In service</span></div>
          </div>`
        )
        .addTo(map);
      vehicleLayersRef.current[op.key] = vehicleLayersRef.current[op.key] ?? [];
      vehicleLayersRef.current[op.key].push(marker);
      // Drift animation
      const timer = setInterval(() => {
        const pos = marker.getLatLng();
        marker.setLatLng([
          pos.lat + (Math.random() - 0.5) * 0.0015,
          pos.lng + (Math.random() - 0.5) * 0.0015,
        ]);
      }, 2800 + idx * 400);
      vehicleTimersRef.current.push(timer);
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
        // Stop markers — small dots
        const stopIcon = L.divIcon({
          html: `<div style="width:8px;height:8px;border-radius:50%;background:${op.color};border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.25)"></div>`,
          className: "", iconSize: [8, 8], iconAnchor: [4, 4],
        });
        stops.slice(0, 300).forEach(stop => {
          const lat = parseFloat(stop.stop_lat); const lon = parseFloat(stop.stop_lon);
          if (isNaN(lat) || isNaN(lon)) return;
          L.marker([lat, lon], { icon: stopIcon })
            .bindPopup(
              `<div style="font-family:system-ui;min-width:130px">
                <div style="font-weight:600;color:${op.color};font-size:12px">${stop.stop_name}</div>
                <div style="font-size:11px;color:#64748b;margin-top:2px">${op.label} · ${op.type}</div>
              </div>`, { maxWidth: 200 }
            )
            .addTo(lg);
        });
      }
      // Spawn animated vehicles for this operator
      spawnVehicles(op);
    } catch { /* skip */ }
    finally { setOpLoading(prev => ({ ...prev, [op.key]: false })); }
  }, [spawnVehicles]);

  useEffect(() => {
    OPERATORS.forEach((op, i) => setTimeout(() => loadOperator(op), i * 700));
    return () => { vehicleTimersRef.current.forEach(t => clearInterval(t)); };
  }, [loadOperator]);

  const toggleOperator = useCallback((key: string) => {
    const L = (window as unknown as { L: typeof import("leaflet") }).L;
    const map = mapInstanceRef.current as ReturnType<typeof L.map>;
    if (!L || !map) return;
    setVisible(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        const lg = stopLayersRef.current[key];
        if (lg) map.removeLayer(lg as Parameters<typeof map.removeLayer>[0]);
        (vehicleLayersRef.current[key] ?? []).forEach(m => map.removeLayer(m as Parameters<typeof map.removeLayer>[0]));
      } else {
        next.add(key);
        const lg = stopLayersRef.current[key];
        if (lg) map.addLayer(lg as Parameters<typeof map.addLayer>[0]);
        (vehicleLayersRef.current[key] ?? []).forEach(m => map.addLayer(m as Parameters<typeof map.addLayer>[0]));
      }
      return next;
    });
  }, []);

  const totalStops = Object.values(opStops).reduce((s, a) => s + a.length, 0);
  const totalRoutes = Object.values(opRoutes).reduce((s, a) => s + a.length, 0);
  const latestRidership = ridershipData.at(-1);
  const allLoaded = OPERATORS.every(op => !opLoading[op.key]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "system-ui, sans-serif", background: "#0f172a" }}>

      {/* ── TOP STATS STRIP ── */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "10px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bus size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1 }}>Transport Network</div>
              <div style={{ fontSize: 10, color: "#60a5fa", marginTop: 1 }}>Magdeburg · {timeStr} · {allLoaded ? "Live" : "Loading…"}</div>
            </div>
          </div>

          {/* KPI pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { Icon: MapPin, val: totalStops > 0 ? totalStops.toLocaleString() : "—", label: "Stops", c: "#3b82f6" },
              { Icon: TrendingUp, val: totalRoutes > 0 ? totalRoutes : "—", label: "Routes", c: "#06b6d4" },
              { Icon: Users, val: latestRidership ? `${(latestRidership.passengers / 1e6).toFixed(1)}M` : "—", label: `Rides ${latestRidership?.year ?? ""}`, c: "#8b5cf6" },
              { Icon: Train, val: OPERATORS.filter(o => visible.has(o.key)).length, label: "Active ops", c: "#10b981" },
            ].map(k => (
              <div key={k.label} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 10px" }}>
                <k.Icon size={11} color={k.c} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "white", fontVariantNumeric: "tabular-nums" }}>{k.val}</span>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{k.label}</span>
              </div>
            ))}
          </div>

          {/* Operator toggle pills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {OPERATORS.map(op => {
              const on = visible.has(op.key);
              const loading = opLoading[op.key];
              const Icon = op.Icon;
              return (
                <button
                  key={op.key}
                  onClick={() => toggleOperator(op.key)}
                  onMouseEnter={() => setHoveredOp(op.key)}
                  onMouseLeave={() => setHoveredOp(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    border: `1.5px solid ${on ? op.color : "rgba(255,255,255,0.15)"}`,
                    background: on ? op.color : "transparent",
                    color: on ? "white" : "#94a3b8",
                    cursor: "pointer", transition: "all 0.15s",
                    opacity: on ? 1 : 0.5,
                    transform: hoveredOp === op.key ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {loading ? (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  ) : on ? <Eye size={9} /> : <EyeOff size={9} />}
                  <Icon size={9} />
                  <span>{op.label}</span>
                  <span style={{ fontSize: 9, opacity: 0.75 }}>{op.vehicleEmoji}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAP (fills rest) ── */}
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {/* Live badge */}
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 999,
          background: "rgba(15,23,42,0.88)", backdropFilter: "blur(8px)",
          borderRadius: 12, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "ping 1.5s ease-in-out infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>LIVE</span>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>vehicles · GTFS stops</span>
        </div>

        {/* Operator legend overlay */}
        <div style={{
          position: "absolute", bottom: 24, left: 12, zIndex: 999,
          background: "rgba(15,23,42,0.9)", backdropFilter: "blur(10px)",
          borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", gap: 5, minWidth: 190,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Operators</div>
          {OPERATORS.map(op => {
            const Icon = op.Icon;
            const stops = opStops[op.key]?.length ?? 0;
            const routes = opRoutes[op.key]?.length ?? 0;
            const on = visible.has(op.key);
            return (
              <div key={op.key} style={{ display: "flex", alignItems: "center", gap: 7, opacity: on ? 1 : 0.3, transition: "opacity 0.2s" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: op.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={11} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "white", lineHeight: 1 }}>{op.vehicleEmoji} {op.label}</div>
                  <div style={{ fontSize: 9, color: "#64748b" }}>{op.type}</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: op.color, fontVariantNumeric: "tabular-nums" }}>{stops > 0 ? stops.toLocaleString() : "…"}</div>
                  <div style={{ fontSize: 8, color: "#64748b" }}>{routes > 0 ? `${routes} routes` : "loading"}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ridership mini widget */}
        {ridershipData.length > 0 && (
          <div style={{
            position: "absolute", bottom: 24, right: 48, zIndex: 999,
            background: "rgba(15,23,42,0.9)", backdropFilter: "blur(10px)",
            borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.1)",
            minWidth: 160,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>MVB Ridership (KISS-MD)</div>
            {ridershipData.slice(-5).map(d => {
              const maxP = Math.max(...ridershipData.map(x => x.passengers));
              const pct = Math.round((d.passengers / maxP) * 100);
              return (
                <div key={d.year} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: "#60a5fa", width: 28, fontVariantNumeric: "tabular-nums" }}>{d.year}</span>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#3b82f6,#06b6d4)", borderRadius: 2, transition: "width 0.7s" }} />
                  </div>
                  <span style={{ fontSize: 9, color: "#94a3b8", width: 30, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{(d.passengers / 1e6).toFixed(1)}M</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading overlay */}
        {!allLoaded && (
          <div style={{
            position: "absolute", top: 12, right: 12, zIndex: 999,
            background: "rgba(15,23,42,0.88)", backdropFilter: "blur(8px)",
            borderRadius: 20, padding: "5px 12px", border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", borderTopColor: "#60a5fa", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            Loading GTFS…
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.9);opacity:0} }
        .leaflet-popup-content-wrapper { border-radius: 10px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important; }
        .leaflet-popup-tip { display: none !important; }
      `}</style>
    </div>
  );
}
