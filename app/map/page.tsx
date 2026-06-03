"use client";
import { useEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import { Map as MapIcon } from "lucide-react";

const markers = [
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

const legend = [
  { color: "#2563eb", label: "Safety" },
  { color: "#16a34a", label: "Transportation" },
  { color: "#0891b2", label: "Climate" },
  { color: "#7c3aed", label: "AI Streetlights" },
];

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS then init map
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

      markers.forEach((m) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:16px;height:16px;
            background:${m.color};
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
          "></div>`,
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

  return (
    <div className="bg-[#f8fafc] min-h-screen">
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
              {legend.map((l) => (
                <span key={l.label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                  <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div
            ref={mapRef}
            className="w-full rounded-[28px] overflow-hidden border border-slate-200 shadow-lg animate-scale-in"
            style={{ height: "600px" }}
          />
          <p className="mt-4 text-sm text-slate-400 text-center">
            {markers.length} Smart City Standorte · Klicken Sie auf einen Marker für Details · Karte: © OpenStreetMap
          </p>
        </Container>
      </section>
    </div>
  );
}
