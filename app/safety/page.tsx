"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Shield, AlertTriangle, PhoneCall, MapPin, Users, X, Send, TrendingDown, Clock, Calendar } from "lucide-react";
import Container from "@/components/layout/Container";

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
interface GeoJSON { type: string; features: AccidentFeature[]; }

interface KissRow { [key: string]: number | string | null; }
interface KissData { columns: { id: string; label: string; unit?: string }[]; rows: KissRow[]; }

const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const SEVERITY_COLOR: Record<number, string> = { 1: "#dc2626", 2: "#f97316", 3: "#facc15" };
const SEVERITY_LABEL: Record<number, string> = { 1: "Fatal", 2: "Serious", 3: "Minor" };

const issueTypes = ["Broken Streetlight","Suspicious Activity","Road Hazard","Vandalism","Noise Complaint","Other"];

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${max ? (value / max) * 100 : 0}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-500 w-10 text-right tabular-nums">{value.toLocaleString()}</span>
    </div>
  );
}

export default function Safety() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [yearData, setYearData] = useState<{ year: number; total: number; killed: number; injured: number }[]>([]);
  const [hourData, setHourData] = useState<{ hour: number; count: number }[]>([]);
  const [weekdayData, setWeekdayData] = useState<{ day: string; count: number }[]>([]);
  const [causeData, setCauseData] = useState<{ cause: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "cyclist" | "pedestrian" | "fatal">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", type: issueTypes[0], description: "" });

  // Fetch GeoJSON + KISS-MD data in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [geoRes, yearRes, hourRes, weekRes, causeRes] = await Promise.allSettled([
          fetch(`${RAW}/Unfaelle/Magdeburg_Unfallatlas.geojson`).then(r => r.json()) as Promise<GeoJSON>,
          fetch(`${RAW}/kiss-md/json/verkehr/strassenverkehrsunfaelle-in-magdeburg-gesamt.json`).then(r => r.json()) as Promise<KissData>,
          fetch(`${RAW}/kiss-md/json/verkehr/verkehrsunfaelle-aufgeteilt-nach-uhrzeiten.json`).then(r => r.json()) as Promise<KissData>,
          fetch(`${RAW}/kiss-md/json/verkehr/verkehrsunfaelle-mit-sachschaden-nach-wochentagen.json`).then(r => r.json()) as Promise<KissData>,
          fetch(`${RAW}/kiss-md/json/verkehr/unfaelle-nach-ausgewaehlten-ursachen.json`).then(r => r.json()) as Promise<KissData>,
        ]);

        if (geoRes.status === "fulfilled") setGeo(geoRes.value);

        if (yearRes.status === "fulfilled") {
          const d = yearRes.value;
          const yearCol = d.columns.find(c => c.id.includes("jahr") || c.id.includes("year") || c.id === "jahr")?.id ?? "jahr";
          const totalCol = d.columns.find(c => c.id.includes("gesamt") || c.id.includes("unfaelle") || c.id.includes("total"))?.id ?? d.columns[1]?.id;
          const killedCol = d.columns.find(c => c.id.includes("getoetet") || c.id.includes("kill") || c.id.includes("tot"))?.id;
          const injuredCol = d.columns.find(c => c.id.includes("verletzt") || c.id.includes("injured"))?.id;
          setYearData(d.rows.map(r => ({
            year: Number(r[yearCol]),
            total: Number(r[totalCol] ?? 0),
            killed: killedCol ? Number(r[killedCol] ?? 0) : 0,
            injured: injuredCol ? Number(r[injuredCol] ?? 0) : 0,
          })).filter(r => r.year >= 2010));
        }

        if (hourRes.status === "fulfilled") {
          const d = hourRes.value;
          const hourCol = d.columns.find(c => c.id.includes("uhr") || c.id.includes("stunde") || c.id.includes("hour"))?.id ?? d.columns[0]?.id;
          const countCol = d.columns.find(c => c.id !== hourCol)?.id ?? d.columns[1]?.id;
          setHourData(d.rows.map(r => ({ hour: Number(r[hourCol]), count: Number(r[countCol] ?? 0) })).sort((a,b) => a.hour - b.hour));
        }

        if (weekRes.status === "fulfilled") {
          const d = weekRes.value;
          const dayCol = d.columns[0]?.id;
          const countCol = d.columns[1]?.id;
          setWeekdayData(d.rows.map(r => ({ day: String(r[dayCol]), count: Number(r[countCol] ?? 0) })));
        }

        if (causeRes.status === "fulfilled") {
          const d = causeRes.value;
          const yearCol = d.columns.find(c => c.id.includes("jahr") || c.id.includes("year"))?.id ?? d.columns[0]?.id;
          const causeCol = d.columns.find(c => c.id.includes("ursache") || c.id.includes("cause"))?.id;
          const countCol = d.columns.find(c => !c.id.includes("jahr") && !c.id.includes("year") && c.id !== causeCol)?.id ?? d.columns[d.columns.length - 1]?.id;
          // Aggregate latest year's causes
          const years = [...new Set(d.rows.map(r => Number(r[yearCol])))].sort((a,b) => b-a);
          const latestYear = years[0];
          const latestRows = d.rows.filter(r => Number(r[yearCol]) === latestYear);
          if (causeCol) {
            setCauseData(latestRows.map(r => ({ cause: String(r[causeCol]), count: Number(r[countCol] ?? 0) })).sort((a,b) => b.count - a.count).slice(0, 6));
          } else {
            // Fallback: treat each column (except year) as a cause
            const causeCols = d.columns.filter(c => !c.id.includes("jahr") && !c.id.includes("year"));
            if (latestRows.length > 0) {
              setCauseData(causeCols.map(c => ({ cause: c.label ?? c.id, count: Number(latestRows[0][c.id] ?? 0) })).sort((a,b) => b.count - a.count).slice(0, 6));
            }
          }
        }
      } catch (e) {
        console.error("Safety data fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build Leaflet map once GeoJSON is loaded
  useEffect(() => {
    if (!geo || !mapRef.current) return;
    if (typeof window === "undefined") return;

    // Load Leaflet from CDN if not already loaded
    const initMap = () => {
      const L = (window as unknown as { L: typeof import("leaflet") }).L;
      if (!L || !mapRef.current) return;

      // Check if map already initialised on this div
      if ((mapRef.current as HTMLElement & { _leaflet_id?: number })._leaflet_id) return;

      const map = L.map(mapRef.current, { center: [52.1205, 11.6276], zoom: 12 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const filtered = {
        ...geo,
        features: geo.features.filter(f => {
          if (activeYear && f.properties.UJAHR !== activeYear) return false;
          if (activeFilter === "cyclist" && !f.properties.IstRad) return false;
          if (activeFilter === "pedestrian" && !f.properties.IstFuss) return false;
          if (activeFilter === "fatal" && f.properties.UKATEGORIE !== 1) return false;
          return true;
        }),
      };

      L.geoJSON(filtered as GeoJSON, {
        pointToLayer: (feature, latlng) => {
          const cat = (feature as AccidentFeature).properties.UKATEGORIE ?? 3;
          return L.circleMarker(latlng, {
            radius: cat === 1 ? 8 : cat === 2 ? 6 : 4,
            fillColor: SEVERITY_COLOR[cat] ?? "#facc15",
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.75,
          });
        },
        onEachFeature: (feature, layer) => {
          const p = (feature as AccidentFeature).properties;
          layer.bindPopup(
            `<div class="text-xs leading-5">
              <strong>${SEVERITY_LABEL[p.UKATEGORIE ?? 3] ?? "Unknown"} accident</strong><br/>
              Year: ${p.UJAHR ?? "?"} &nbsp;·&nbsp; ${p.USTUNDE ?? "?"}:00h<br/>
              ${p.IstRad ? "🚲 Cyclist &nbsp;" : ""}${p.IstFuss ? "🚶 Pedestrian &nbsp;" : ""}${p.IstPKW ? "🚗 Car" : ""}
            </div>`
          );
        },
      }).addTo(map);
    };

    if ((window as unknown as { L?: unknown }).L) {
      initMap();
    } else {
      // Inject Leaflet CSS + JS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap;
        document.head.appendChild(script);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, activeYear, activeFilter]);

  // Derived KPIs from GeoJSON
  const features = geo?.features ?? [];
  const totalAccidents = features.length;
  const fatalities = features.filter(f => f.properties.UKATEGORIE === 1).length;
  const cyclistInvolved = features.filter(f => f.properties.IstRad === 1).length;
  const pedestrianInvolved = features.filter(f => f.properties.IstFuss === 1).length;

  const maxYear = Math.max(...yearData.map(d => d.total), 1);
  const maxHour = Math.max(...hourData.map(d => d.count), 1);
  const maxDay = Math.max(...weekdayData.map(d => d.count), 1);
  const maxCause = Math.max(...causeData.map(d => d.count), 1);

  const availableYears = [...new Set(features.map(f => f.properties.UJAHR).filter(Boolean) as number[])].sort((a,b) => a-b);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setModalOpen(false); setSubmitted(false); setForm({ name: "", location: "", type: issueTypes[0], description: "" }); }, 2200);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[480px]">
        <Image src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=85" alt="Safety" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Safety</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Real accident data from Magdeburg&#39;s Unfallatlas — 2017 to 2024 — to understand where and when incidents happen.
              </p>
              <button onClick={() => setModalOpen(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#061B46] shadow-lg transition hover:bg-blue-50 hover:scale-105 active:scale-95">
                <Send size={16} /> Report an Issue
              </button>
            </div>
          </Container>
        </div>
      </section>

      {/* KPI bar */}
      <section className="bg-[#061B46]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="h-8 w-20 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                </div>
              ))
            ) : (
              [
                { value: totalAccidents.toLocaleString(), label: "Accidents (2017–2024)", icon: AlertTriangle },
                { value: fatalities.toLocaleString(), label: "Fatalities recorded", icon: TrendingDown },
                { value: cyclistInvolved.toLocaleString(), label: "Cyclist involved", icon: Users },
                { value: pedestrianInvolved.toLocaleString(), label: "Pedestrian involved", icon: MapPin },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-up delay-${(i + 1) * 100}`}>
                    <Icon className="h-5 w-5 text-blue-400 mb-1" />
                    <span className="text-3xl font-bold text-white tabular-nums">{s.value}</span>
                    <span className="mt-1 text-sm text-blue-300">{s.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </Container>
      </section>

      {/* Map section */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#061B46]">Accident Map</h2>
              <p className="text-slate-500 mt-1 text-sm">
                Source: Unfallatlas der Statistischen Ämter — Datenlizenz Deutschland v2.0
              </p>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {(["all", "cyclist", "pedestrian", "fatal"] as const).map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    activeFilter === f
                      ? "bg-[#061B46] text-white border-[#061B46]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#061B46]"
                  }`}>
                  {f === "all" ? "All" : f === "cyclist" ? "🚲 Cyclist" : f === "pedestrian" ? "🚶 Pedestrian" : "💀 Fatal only"}
                </button>
              ))}
            </div>
          </div>

          {/* Year filter pills */}
          {availableYears.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setActiveYear(null)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  activeYear === null ? "bg-[#061B46] text-white border-[#061B46]" : "bg-white text-slate-500 border-slate-200"
                }`}>All years</button>
              {availableYears.map(y => (
                <button key={y} onClick={() => setActiveYear(y === activeYear ? null : y)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                    activeYear === y ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-400"
                  }`}>{y}</button>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex gap-4 mb-4">
            {([1,2,3] as const).map(cat => (
              <div key={cat} className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLOR[cat] }} />
                <span className="text-xs text-slate-500">{SEVERITY_LABEL[cat]}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 rounded-full border-4 border-[#061B46]/20 border-t-[#061B46] animate-spin" />
                  <p className="text-sm text-slate-500">Loading accident data…</p>
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

            {/* Accidents by year */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-5 w-5 text-[#061B46]" />
                <h3 className="font-bold text-[#061B46]">Accidents per Year</h3>
              </div>
              <p className="text-xs text-slate-400 mb-5">Source: KISS-MD Verkehr — strassenverkehrsunfaelle-in-magdeburg-gesamt</p>
              {loading ? (
                <div className="space-y-3">{Array.from({length:6}).map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
              ) : yearData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-2">
                  {yearData.map(d => (
                    <div key={d.year}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">{d.year}</span>
                        {d.killed > 0 && <span className="text-red-500">{d.killed} fatal</span>}
                      </div>
                      <Bar value={d.total} max={maxYear} color="#1e40af" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By hour */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-[#061B46]" />
                <h3 className="font-bold text-[#061B46]">Accidents by Hour of Day</h3>
              </div>
              <p className="text-xs text-slate-400 mb-5">Source: KISS-MD — verkehrsunfaelle-aufgeteilt-nach-uhrzeiten</p>
              {loading ? (
                <div className="space-y-3">{Array.from({length:8}).map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
              ) : hourData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-1.5">
                  {hourData.map(d => (
                    <div key={d.hour}>
                      <div className="text-xs text-slate-400 mb-0.5">{String(d.hour).padStart(2,"0")}:00</div>
                      <Bar value={d.count} max={maxHour} color="#7c3aed" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By weekday */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-5 w-5 text-[#061B46]" />
                <h3 className="font-bold text-[#061B46]">Accidents by Weekday</h3>
              </div>
              <p className="text-xs text-slate-400 mb-5">Source: KISS-MD — verkehrsunfaelle-mit-sachschaden-nach-wochentagen</p>
              {loading ? (
                <div className="space-y-3">{Array.from({length:7}).map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
              ) : weekdayData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-2">
                  {weekdayData.map(d => (
                    <div key={d.day}>
                      <div className="text-xs text-slate-400 mb-0.5">{d.day}</div>
                      <Bar value={d.count} max={maxDay} color="#0891b2" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By cause */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-5 w-5 text-[#061B46]" />
                <h3 className="font-bold text-[#061B46]">Top Accident Causes</h3>
              </div>
              <p className="text-xs text-slate-400 mb-5">Source: KISS-MD — unfaelle-nach-ausgewaehlten-ursachen (latest year)</p>
              {loading ? (
                <div className="space-y-3">{Array.from({length:6}).map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
              ) : causeData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-2">
                  {causeData.map(d => (
                    <div key={d.cause}>
                      <div className="text-xs text-slate-500 mb-0.5 truncate" title={d.cause}>{d.cause}</div>
                      <Bar value={d.count} max={maxCause} color="#dc2626" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Safety initiatives */}
      <section className="pb-20">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3">Safety Initiatives</h2>
          <p className="text-slate-500 mb-12">Programmes that use this data to keep Magdeburg safer.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: AlertTriangle, color: "text-blue-700",   bg: "bg-blue-50",   title: "Smart Surveillance",  description: "AI-powered camera networks monitor public spaces 24/7, detecting unusual activity and alerting emergency services in real time.",      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80" },
              { icon: PhoneCall,     color: "text-green-700",  bg: "bg-green-50",  title: "Emergency Response", description: "Integrated SOS stations placed across the city connect citizens directly to emergency services with one press.",                        image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&q=80" },
              { icon: MapPin,        color: "text-violet-700", bg: "bg-violet-50", title: "Incident Mapping",    description: "The Unfallatlas GeoJSON now powers a live accident heatmap, pinpointing hotspots to prioritise infrastructure investment.",          image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80" },
              { icon: Users,         color: "text-amber-700",  bg: "bg-amber-50",  title: "Community Watch",     description: "Citizens can report safety concerns via the form below, building a collaborative network of community awareness.",                       image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#061B46]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FAB */}
      <button onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 rounded-full bg-[#061B46] px-5 py-3.5 text-sm font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-blue-700 active:scale-95">
        <Send size={16} /> Report Issue
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl animate-scale-in">
            {!submitted ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#061B46]">Report a Safety Issue</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Help us keep Magdeburg safe</p>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Your Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="Max Mustermann" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Location</label>
                    <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g. Breiter Weg, Altstadt" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Issue Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                      {issueTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                    <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                      placeholder="Describe what you observed..." />
                  </div>
                  <button type="submit"
                    className="w-full rounded-xl bg-[#061B46] py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                    Submit Report
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-[#061B46]">Report Submitted!</h3>
                <p className="text-sm text-slate-500 mt-2">Thank you, {form.name}. Our team will review your report shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
