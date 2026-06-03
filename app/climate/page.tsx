"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Cloud, Leaf, Droplets, Wind, Thermometer, RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";

// Open-Meteo Air Quality API — completely free, zero API key
// Docs: https://open-meteo.com/en/docs/air-quality-api
const LAT = 52.1316, LON = 11.6392;
const AQI_URL =
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}` +
  `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi`;

const aqiLevels = [
  { max: 20,  label: "Good",          color: "#16a34a", bg: "bg-green-50",  text: "text-green-700" },
  { max: 40,  label: "Fair",          color: "#84cc16", bg: "bg-lime-50",   text: "text-lime-700"  },
  { max: 60,  label: "Moderate",      color: "#d97706", bg: "bg-amber-50",  text: "text-amber-700" },
  { max: 80,  label: "Poor",          color: "#ea580c", bg: "bg-orange-50", text: "text-orange-700"},
  { max: 100, label: "Very Poor",     color: "#dc2626", bg: "bg-red-50",    text: "text-red-700"   },
  { max: 999, label: "Extremely Poor",color: "#7c3aed", bg: "bg-violet-50", text: "text-violet-700"},
];

function getLevel(aqi: number) {
  return aqiLevels.find((l) => aqi <= l.max) ?? aqiLevels[aqiLevels.length - 1];
}

interface AQIData {
  aqi: number;
  pm2_5: number;
  pm10: number;
  o3: number;
  no2: number;
  co: number;
}

const climateInitiatives = [
  { icon: Leaf,        color: "text-green-700",  bg: "bg-green-50",  title: "Urban Greening",          description: "Over 5,000 new trees planted across Magdeburg as part of a 10-year urban forest expansion plan to combat heat islands.",            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",  delay: "delay-100" },
  { icon: Droplets,    color: "text-blue-700",   bg: "bg-blue-50",   title: "Smart Water Management",  description: "IoT sensors monitor water quality and consumption across the city, reducing waste and detecting leaks automatically.",              image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80",  delay: "delay-200" },
  { icon: Wind,        color: "text-violet-700", bg: "bg-violet-50", title: "Air Quality Monitoring",   description: "A network of 80+ sensors provides real-time air quality data, helping residents make informed decisions daily.",                  image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&q=80",  delay: "delay-300" },
  { icon: Thermometer, color: "text-amber-700",  bg: "bg-amber-50",  title: "Heat Island Reduction",    description: "Cool pavements, green roofs, and shaded public spaces reduce urban temperatures by up to 4°C in summer months.",                 image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80",  delay: "delay-400" },
];

const stats = [
  { value: "-32%",   label: "CO₂ Since 2020" },
  { value: "80+",    label: "Air Quality Sensors" },
  { value: "5,000+", label: "New Trees Planted" },
  { value: "2035",   label: "Carbon Neutral Target" },
];

export default function Climate() {
  const [data, setData]           = useState<AQIData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [lastUpdated, setUpdated] = useState("");

  const fetchAQI = async () => {
    setLoading(true);
    try {
      const res  = await fetch(AQI_URL);
      const json = await res.json();
      const c    = json.current;
      setData({
        aqi:   c.european_aqi,
        pm2_5: c.pm2_5,
        pm10:  c.pm10,
        o3:    c.ozone,
        no2:   c.nitrogen_dioxide,
        co:    c.carbon_monoxide,
      });
      setUpdated(new Date().toLocaleTimeString("de-DE"));
    } catch {
      // graceful fallback — realistic Magdeburg June values
      setData({ aqi: 18, pm2_5: 6.4, pm10: 11.2, o3: 72.1, no2: 9.3, co: 185 });
      setUpdated(new Date().toLocaleTimeString("de-DE") + " (demo)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAQI(); }, []);

  const level = data ? getLevel(data.aqi) : null;

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[480px]">
        <Image src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85" alt="Climate" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Cloud className="h-4 w-4 text-green-300" />
                <span className="text-sm font-medium text-green-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Climate</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">A greener city for a better tomorrow — combining smart technology with sustainable urban planning.</p>
            </div>
          </Container>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#061B46]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {stats.map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-up delay-${(i + 1) * 100}`}>
                <span className="text-3xl font-bold text-white">{s.value}</span>
                <span className="mt-1 text-sm text-blue-300">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Live Air Quality Widget — Open-Meteo (no key) */}
      <section className="py-14 bg-white border-b border-slate-100">
        <Container>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#061B46]">Live Air Quality — Magdeburg</h2>
              <p className="text-slate-500 text-sm mt-1">
                Source: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open-Meteo</a>
                {" "}(European AQI) · {lastUpdated && `Updated: ${lastUpdated}`}
              </p>
            </div>
            <button onClick={fetchAQI}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            </div>
          ) : data && level ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Big AQI score */}
              <div className={`rounded-[28px] border-2 p-8 flex flex-col items-center text-center ${level.bg}`} style={{ borderColor: level.color }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: level.color }}>European AQI</p>
                <p className="text-7xl font-black mb-3" style={{ color: level.color }}>{data.aqi}</p>
                <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${level.bg} ${level.text}`}>{level.label}</span>
                <p className="mt-4 text-xs text-slate-400 leading-5">Magdeburg city centre<br />52.13°N 11.63°E</p>
              </div>

              {/* Pollutant breakdown */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: "PM2.5", val: data.pm2_5.toFixed(1), unit: "μg/m³" },
                  { key: "PM10",  val: data.pm10.toFixed(1),  unit: "μg/m³" },
                  { key: "O₃",   val: data.o3.toFixed(1),    unit: "μg/m³" },
                  { key: "NO₂",  val: data.no2.toFixed(1),   unit: "μg/m³" },
                  { key: "CO",   val: data.co.toFixed(0),    unit: "μg/m³" },
                ].map((p) => (
                  <div key={p.key} className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 text-center hover:bg-white hover:shadow-sm transition">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{p.key}</p>
                    <p className="text-2xl font-bold text-[#061B46]">{p.val}</p>
                    <p className="text-xs text-slate-400 mt-1">{p.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {/* Cards */}
      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3 animate-fade-up">Climate Initiatives</h2>
          <p className="text-slate-500 mb-12 animate-fade-up delay-100">Turning Magdeburg into a model of urban sustainability.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {climateInitiatives.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-scale-in ${item.delay}`}>
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}><Icon className={`h-6 w-6 ${item.color}`} /></div>
                    <h3 className="text-lg font-semibold text-[#061B46]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
