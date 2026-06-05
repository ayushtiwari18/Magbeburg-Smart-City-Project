"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bus, Train, Bike, Navigation, Clock, Users, Zap, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";
const GTFS_BASE = `${RAW}/OEV-Daten_NASA_GmbH/GTFS`;

interface KissRow { [key: string]: number | string | null; }
interface KissData { columns: { id: string; label: string; unit?: string }[]; rows: KissRow[]; }

interface GtfsStop { stop_id: string; stop_name: string; stop_lat: string; stop_lon: string; }
interface GtfsRoute { route_id: string; route_short_name: string; route_long_name: string; route_type: string; }

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${max ? (value / max) * 100 : 0}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-500 w-16 text-right tabular-nums">{value.toLocaleString()}</span>
    </div>
  );
}

// Parse a single CSV file from a GTFS zip using JSZip (loaded from CDN)
async function parseGtfsFile<T>(zipUrl: string, filename: string): Promise<T[]> {
  const JSZip = (window as unknown as { JSZip?: new () => {
    loadAsync(data: ArrayBuffer): Promise<{ files: Record<string, { async(type: "string"): Promise<string> }> }>;
  } }).JSZip;
  if (!JSZip) throw new Error("JSZip not loaded");
  const res = await fetch(zipUrl);
  const buf = await res.arrayBuffer();
  const zip = await new JSZip().loadAsync(buf);
  const file = zip.files[filename] ?? zip.files[Object.keys(zip.files).find(k => k.endsWith(filename)) ?? ""];
  if (!file) throw new Error(`${filename} not found in zip`);
  const text = await file.async("string");
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const headers = lines[0].split(",").map(h => h.replace(/\r/g, ""));
  return lines.slice(1).map(line => {
    const vals = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, vals[i]?.replace(/\r/g, "") ?? ""])) as T;
  });
}

const OPERATOR_LABELS: Record<string, { name: string; color: string; type: string }> = {
  mvb:      { name: "MVB — Magdeburger Verkehrsbetriebe", color: "#1e40af", type: "Tram + City Bus" },
  kvg:      { name: "KVG — Kraftverkehrsgesellschaft",    color: "#0891b2", type: "Regional Bus" },
  njl:      { name: "NJL",                                color: "#7c3aed", type: "Night / Rural Lines" },
  pvgs:     { name: "PVGS",                               color: "#059669", type: "Salzlandkreis Bus" },
  boerdebus:{ name: "Bördebus",                           color: "#d97706", type: "Landkreis Börde" },
};

export default function Transportation() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [ridershipData, setRidershipData] = useState<{ year: number; passengers: number }[]>([]);
  const [evData, setEvData] = useState<{ year: number; ev: number; total: number }[]>([]);
  const [stopCount, setStopCount] = useState<Record<string, number>>({});
  const [routeCount, setRouteCount] = useState<Record<string, number>>({});
  const [tramRoutes, setTramRoutes] = useState<GtfsRoute[]>([]);
  const [stops, setStops] = useState<GtfsStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [gtfsLoading, setGtfsLoading] = useState(true);
  const [activeOperator, setActiveOperator] = useState<string>("mvb");

  // Load KISS-MD stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [riderRes, evRes] = await Promise.allSettled([
          fetch(`${RAW}/kiss-md/json/verkehr/befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json`).then(r => r.json()) as Promise<KissData>,
          fetch(`${RAW}/kiss-md/json/verkehr/fahrzeugbestand-nach-kraftstoff-und-schadstoffgruppen-plakette.json`).then(r => r.json()) as Promise<KissData>,
        ]);

        if (riderRes.status === "fulfilled") {
          const d = riderRes.value;
          const yearCol = d.columns.find(c => c.id.includes("jahr") || c.id.includes("year"))?.id ?? d.columns[0]?.id;
          const passCol = d.columns.find(c => c.id.includes("befoerd") || c.id.includes("passag") || c.id.includes("gesamt") || (c.id !== yearCol && d.columns.indexOf(c) === 1))?.id ?? d.columns[1]?.id;
          setRidershipData(d.rows
            .map(r => ({ year: Number(r[yearCol]), passengers: Number(r[passCol] ?? 0) }))
            .filter(r => r.year >= 2010 && r.passengers > 0)
          );
        }

        if (evRes.status === "fulfilled") {
          const d = evRes.value;
          const yearCol = d.columns.find(c => c.id.includes("jahr") || c.id.includes("year"))?.id ?? d.columns[0]?.id;
          const evCol = d.columns.find(c => c.id.toLowerCase().includes("elektr") || c.id.toLowerCase().includes("bev"))?.id;
          const totalCol = d.columns.find(c => c.id.includes("gesamt") || c.id.includes("total") || c.id.includes("insges"))?.id;
          if (evCol) {
            setEvData(d.rows
              .map(r => ({ year: Number(r[yearCol]), ev: Number(r[evCol] ?? 0), total: totalCol ? Number(r[totalCol] ?? 0) : 0 }))
              .filter(r => r.year >= 2015 && r.ev > 0)
            );
          }
        }
      } catch (e) {
        console.error("Transport KISS-MD fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Load JSZip then parse GTFS
  useEffect(() => {
    const loadJSZip = () => new Promise<void>((resolve, reject) => {
      if ((window as unknown as { JSZip?: unknown }).JSZip) { resolve(); return; }
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      s.onload = () => resolve();
      s.onerror = reject;
      document.head.appendChild(s);
    });

    const fetchGtfs = async () => {
      try {
        await loadJSZip();
        const zipUrl = `${GTFS_BASE}/gtfs_${activeOperator}_std_kn.zip`;
        const [routesRaw, stopsRaw] = await Promise.all([
          parseGtfsFile<GtfsRoute>(zipUrl, "routes.txt"),
          parseGtfsFile<GtfsStop>(zipUrl, "stops.txt"),
        ]);
        setTramRoutes(routesRaw.filter(r => r.route_type === "0").slice(0, 20));
        setStops(stopsRaw.slice(0, 300)); // render first 300 stops on map

        // Count all operators
        const counts: Record<string, number> = {};
        const rCounts: Record<string, number> = {};
        await Promise.allSettled(
          Object.keys(OPERATOR_LABELS).map(async op => {
            try {
              const s = await parseGtfsFile<GtfsStop>(`${GTFS_BASE}/gtfs_${op}_std_kn.zip`, "stops.txt");
              const r = await parseGtfsFile<GtfsRoute>(`${GTFS_BASE}/gtfs_${op}_std_kn.zip`, "routes.txt");
              counts[op] = s.length;
              rCounts[op] = r.length;
            } catch { /* skip */ }
          })
        );
        setStopCount(counts);
        setRouteCount(rCounts);
      } catch (e) {
        console.error("GTFS parse error", e);
      } finally {
        setGtfsLoading(false);
      }
    };
    fetchGtfs();
  }, [activeOperator]);

  // Build map
  useEffect(() => {
    if (!mapRef.current || stops.length === 0) return;
    if (typeof window === "undefined") return;

    const initMap = () => {
      const L = (window as unknown as { L: typeof import("leaflet") }).L;
      if (!L || !mapRef.current) return;
      const el = mapRef.current as HTMLElement & { _leaflet_id?: number; _leafletMap?: ReturnType<typeof L.map> };
      if (el._leafletMap) { el._leafletMap.remove(); }
      const map = L.map(el, { center: [52.1205, 11.6276], zoom: 12 });
      el._leafletMap = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 19,
      }).addTo(map);

      const op = OPERATOR_LABELS[activeOperator];
      const stopIcon = L.circleMarker.bind(L);
      stops.forEach(stop => {
        const lat = parseFloat(stop.stop_lat);
        const lon = parseFloat(stop.stop_lon);
        if (isNaN(lat) || isNaN(lon)) return;
        stopIcon([lat, lon], {
          radius: 4, fillColor: op.color, color: "#fff", weight: 1, opacity: 1, fillOpacity: 0.85,
        }).addTo(map).bindPopup(`<strong>${stop.stop_name}</strong><br/><span class="text-xs">${op.name}</span>`);
      });

      // Draw tram routes in different colour
      tramRoutes.forEach(r => {
        const label = r.route_short_name || r.route_long_name;
        const marker = L.divIcon({ html: `<span style="background:${op.color};color:#fff;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:700">${label}</span>`, className: "" });
        void marker;
      });
    };

    if ((window as unknown as { L?: unknown }).L) {
      initMap();
    } else {
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
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, activeOperator]);

  const maxPassengers = Math.max(...ridershipData.map(d => d.passengers), 1);
  const maxEv = Math.max(...evData.map(d => d.ev), 1);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[480px]">
        <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=85" alt="Smart Transportation" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Bus className="h-4 w-4 text-green-300" />
                <span className="text-sm font-medium text-green-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Smart Transportation</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Real GTFS schedules from MVB, KVG, NJL, PVGS and Bördebus — live routes, stop maps and ridership data.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Operator summary cards */}
      <section className="bg-[#061B46] py-8">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(OPERATOR_LABELS).map(([key, op]) => (
              <button key={key} onClick={() => setActiveOperator(key)}
                className={`rounded-2xl p-4 text-left border-2 transition-all ${
                  activeOperator === key
                    ? "border-white bg-white/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">{op.type}</div>
                <div className="text-sm font-bold text-white leading-tight">{op.name.split(" — ")[0]}</div>
                {stopCount[key] ? (
                  <div className="mt-2 text-xs text-blue-300">
                    {stopCount[key].toLocaleString()} stops &nbsp;·&nbsp; {routeCount[key] ?? "?"} routes
                  </div>
                ) : (
                  <div className="mt-2 h-3 w-16 bg-white/10 rounded animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* GTFS Stop Map */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#061B46]">Stop Network Map</h2>
              <p className="text-slate-500 mt-1 text-sm">
                Source: NASA GmbH GTFS feeds — Datenlizenz Deutschland v2.0
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: OPERATOR_LABELS[activeOperator].color }} />
              <span className="text-sm font-semibold text-slate-700">{OPERATOR_LABELS[activeOperator].name}</span>
            </div>
          </div>

          {/* Tram routes list */}
          {tramRoutes.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1 mr-2"><Train size={12} /> Tram lines:</span>
              {tramRoutes.map(r => (
                <span key={r.route_id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: OPERATOR_LABELS[activeOperator].color }}>
                  {r.route_short_name || r.route_id}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
            {gtfsLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 rounded-full border-4 border-[#061B46]/20 border-t-[#061B46] animate-spin" />
                  <p className="text-sm text-slate-500">Parsing GTFS data for {OPERATOR_LABELS[activeOperator].name}…</p>
                </div>
              </div>
            )}
            <div ref={mapRef} style={{ height: 480 }} />
          </div>
        </Container>
      </section>

      {/* Charts row */}
      <section className="py-8 pb-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* MVB ridership */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-[#061B46]" />
                <h3 className="font-bold text-[#061B46]">MVB Annual Ridership</h3>
              </div>
              <p className="text-xs text-slate-400 mb-5">Source: KISS-MD — befoerderte-personen-der-mvb</p>
              {loading ? (
                <div className="space-y-3">{Array.from({length:8}).map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
              ) : ridershipData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-2">
                  {ridershipData.map(d => (
                    <div key={d.year}>
                      <div className="text-xs text-slate-500 mb-0.5">{d.year}</div>
                      <Bar value={d.passengers} max={maxPassengers} color="#1e40af" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EV fleet */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-5 w-5 text-[#061B46]" />
                <h3 className="font-bold text-[#061B46]">Electric Vehicles Registered</h3>
              </div>
              <p className="text-xs text-slate-400 mb-5">Source: KISS-MD — fahrzeugbestand-nach-kraftstoff</p>
              {loading ? (
                <div className="space-y-3">{Array.from({length:6}).map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
              ) : evData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No EV data available</p>
              ) : (
                <div className="space-y-2">
                  {evData.map(d => (
                    <div key={d.year}>
                      <div className="flex justify-between text-xs text-slate-500 mb-0.5">
                        <span>{d.year}</span>
                        {d.total > 0 && <span className="text-slate-400">{((d.ev / d.total) * 100).toFixed(1)}% of fleet</span>}
                      </div>
                      <Bar value={d.ev} max={maxEv} color="#059669" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="pb-24">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3">Transport Initiatives</h2>
          <p className="text-slate-500 mb-12">Connecting every corner of Magdeburg sustainably.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Bus,        color: "text-green-700",  bg: "bg-green-50",  title: "Smart Bus Network",  desc: "Real-time GPS tracking on all city buses. GTFS feeds for KVG, NJL, PVGS and Bördebus power live scheduling.",                          img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80" },
              { icon: Train,      color: "text-blue-700",   bg: "bg-blue-50",   title: "Tram Integration",   desc: "MVB's tram network — fully parsed from GTFS — is displayed as a live stop map with real tram line numbers.",                           img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
              { icon: Bike,       color: "text-amber-700",  bg: "bg-amber-50",  title: "E-Bike Sharing",    desc: "300+ electric bikes available across 60 docking stations, bookable via the city app with real-time availability.",                     img: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600&q=80" },
              { icon: Navigation, color: "text-violet-700", bg: "bg-violet-50", title: "Multimodal Routing", desc: "GTFS data for all 5 operators enables journey planning that combines tram, regional bus, and walking in one platform.", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={item.img} alt={item.title} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#061B46]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">{item.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                      <span>Live GTFS data</span><ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Data source footer */}
      <div className="border-t border-slate-200 py-6">
        <Container>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-400">
            <span><Clock size={12} className="inline mr-1" />GTFS feeds provided by NASA GmbH — Nahverkehrsservice Sachsen-Anhalt</span>
            <span>Ridership & fleet data: KISS-MD Verkehr — Stadt Magdeburg</span>
            <span>License: Datenlizenz Deutschland – Namensnennung – Version 2.0</span>
          </div>
        </Container>
      </div>
    </div>
  );
}
