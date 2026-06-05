"use client";
import { useEffect, useRef, useState } from "react";
import Container from "@/components/layout/Container";
import { Map as MapIcon, Wind, Thermometer, Droplets, RefreshCw } from "lucide-react";

const MARKERS = [
  { lat: 52.1316, lng: 11.6392, label: "Smart Streetlights – Altstadt",     category: "AI Streetlights", color: "#7c3aed" },
  { lat: 52.1205, lng: 11.6278, label: "Bus Depot – Hauptbahnhof",           category: "Transportation",  color: "#16a34a" },
  { lat: 52.1389, lng: 11.6501, label: "Air Quality Sensor – Nord",          category: "Climate",        color: "#0891b2" },
  { lat: 52.1265, lng: 11.6340, label: "SOS Station – Breiter Weg",          category: "Safety",         color: "#2563eb" },
  { lat: 52.1178, lng: 11.6195, label: "E-Bike Station – Sudenburg",         category: "Transportation",  color: "#16a34a" },
  { lat: 52.1450, lng: 11.6600, label: "Green Roof Project – Stadtfeld",     category: "Climate",        color: "#0891b2" },
  { lat: 52.1098, lng: 11.6450, label: "Smart Camera – Elbepark",            category: "Safety",         color: "#2563eb" },
  { lat: 52.1340, lng: 11.6150, label: "KI-Laterne Pilot – Buckau",          category: "AI Streetlights", color: "#7c3aed" },
  { lat: 52.1500, lng: 11.6250, label: "Tram Upgrade – Cracau",              category: "Transportation",  color: "#16a34a" },
  { lat: 52.1220, lng: 11.6580, label: "Urban Forest – Herrenkrug",          category: "Climate",        color: "#0891b2" },
  { lat: 52.1355, lng: 11.6420, label: "Incident Map Hub – Zentrum",         category: "Safety",         color: "#2563eb" },
  { lat: 52.1430, lng: 11.6320, label: "Smart Light Phase 2 – Reform",       category: "AI Streetlights", color: "#7c3aed" },
];

const LEGEND = [
  { color: "#2563eb", label: "Safety" },
  { color: "#16a34a", label: "Transportation" },
  { color: "#0891b2", label: "Climate" },
  { color: "#7c3aed", label: "AI Streetlights" },
];

type Weather = {
  temperature: number | null;
  wind_speed: number | null;
  precipitation: number | null;
  condition: string | null;
};

type AirQuality = { pm10: number | null; pm25: number | null; sensors: number };

function conditionEmoji(c: string | null) {
  const m: Record<string, string> = { dry: "☀️", fog: "🌫️", rain: "🌧️", sleet: "🌨️", snow: "❄️", hail: "🌩️", thunderstorm: "⛈️" };
  return c ? (m[c] ?? "🌡️") : "🌡️";
}

function aqiLabel(pm10: number | null) {
  if (pm10 === null) return { text: "—", color: "#64748b" };
  if (pm10 <= 20)  return { text: "Good",        color: "#16a34a" };
  if (pm10 <= 40)  return { text: "Moderate",    color: "#d97706" };
  if (pm10 <= 50)  return { text: "Unhealthy",   color: "#ea580c" };
  return               { text: "Very Unhealthy", color: "#dc2626" };
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [air, setAir] = useState<AirQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      // Weather
      const wRes = await fetch(
        "https://api.brightsky.dev/current_weather?lat=52.1205&lon=11.6276"
      );
      const { weather: w } = await wRes.json();
      setWeather({ temperature: w.temperature, wind_speed: w.wind_speed, precipitation: w.precipitation, condition: w.condition });
    } catch { setWeather(null); }

    try {
      // Air Quality (Sensor.Community)
      const aRes = await fetch(
        "https://data.sensor.community/airrohr/v1/filter/area=52.1205,11.6276,10"
      );
      const sensors = await aRes.json();
      const pm10vals: number[] = [];
      const pm25vals: number[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sensors.forEach((s: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.sensordatavalues?.forEach((v: any) => {
          const val = parseFloat(v.value);
          if (!isNaN(val)) {
            if (v.value_type === "P1") pm10vals.push(val);
            if (v.value_type === "P2") pm25vals.push(val);
          }
        });
      });
      const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
      setAir({ pm10: avg(pm10vals), pm25: avg(pm25vals), sensors: sensors.length });
    } catch { setAir(null); }

    setLastUpdated(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L;
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true })
        .setView([52.13, 11.63], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      MARKERS.forEach((m) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:16px;height:16px;background:${m.color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([m.lat, m.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:160px">
              <div style="font-size:11px;font-weight:700;color:${m.color};text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${m.category}</div>
              <div style="font-size:13px;font-weight:600;color:#061B46">${m.label}</div>
            </div>
          `, { maxWidth: 220 });
      });
    };
    document.head.appendChild(script);
  }, []);

  const aqi = aqiLabel(air?.pm10 ?? null);

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <Container className="py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <MapIcon className="h-7 w-7 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Smart City Magdeburg</p>
                <h1 className="text-3xl font-bold text-[#061B46]">Interaktive Stadtkarte</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {LEGEND.map((l) => (
                <span key={l.label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                  <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Live data strip */}
      <section className="bg-[#061B46]">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex flex-wrap gap-6">
              {/* Weather */}
              <div className="flex items-center gap-2">
                <span className="text-xl">{weather ? conditionEmoji(weather.condition) : "🌡️"}</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300">Temperature</p>
                  <p className="text-base font-bold text-white tabular-nums">
                    {loading ? "…" : weather?.temperature != null ? `${weather.temperature.toFixed(1)}°C` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300">Wind</p>
                  <p className="text-base font-bold text-white tabular-nums">
                    {loading ? "…" : weather?.wind_speed != null ? `${weather.wind_speed} km/h` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300">Precip.</p>
                  <p className="text-base font-bold text-white tabular-nums">
                    {loading ? "…" : weather?.precipitation != null ? `${weather.precipitation} mm` : "—"}
                  </p>
                </div>
              </div>
              {/* Air Quality */}
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300">Air Quality (PM10)</p>
                  <p className="text-base font-bold tabular-nums" style={{ color: loading ? "#93c5fd" : aqi.color }}>
                    {loading ? "…" : air?.pm10 != null ? `${air.pm10.toFixed(1)} µg/m³` : "—"}
                    {!loading && air?.pm10 != null && <span className="ml-2 text-xs font-semibold" style={{ color: aqi.color }}>({aqi.text})</span>}
                  </p>
                </div>
              </div>
              {!loading && air && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">📡</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300">Sensors</p>
                    <p className="text-base font-bold text-white tabular-nums">{air.sensors} active</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={fetchLiveData}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Updating…" : `Refresh · ${lastUpdated}`}
            </button>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="py-8">
        <Container>
          <div
            ref={mapRef}
            className="w-full rounded-[28px] overflow-hidden border border-slate-200 shadow-lg animate-scale-in"
            style={{ height: "600px" }}
          />
          <p className="mt-4 text-sm text-slate-400 text-center">
            {MARKERS.length} Smart City locations · Click a marker for details · Map: © OpenStreetMap · Air: Sensor.Community · Weather: Bright Sky / DWD
          </p>
        </Container>
      </section>
    </div>
  );
}
