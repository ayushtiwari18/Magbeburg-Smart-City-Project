import Image from "next/image";
import { Lightbulb, Zap, Moon, Activity, BrainCircuit } from "lucide-react";
import Container from "@/components/layout/Container";
import PedestrianHeatmap from "@/components/ai-streetlights/PedestrianHeatmap";

const streetlightFeatures = [
  {
    icon: BrainCircuit,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Adaptive Brightness",
    description:
      "AI adjusts streetlight intensity in real time based on pedestrian density, weather, and ambient light — from 20% standby to 100% full power.",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80",
    delay: "delay-100",
  },
  {
    icon: Zap,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Energy Savings",
    description:
      "Smart dimming cuts street-lighting energy by up to 60% vs conventional always-on systems, saving €2.1M annually across Magdeburg.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
    delay: "delay-200",
  },
  {
    icon: Moon,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Light Pollution Reduction",
    description:
      "Directional LED fixtures + intelligent scheduling minimise light pollution, protecting the night sky and local wildlife.",
    image: "https://images.unsplash.com/photo-1503437313881-503a91226402?w=600&q=80",
    delay: "delay-300",
  },
  {
    icon: Activity,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Predictive Maintenance",
    description:
      "Sensors detect bulb degradation before failure, triggering automated maintenance requests to keep network uptime at 99.2%.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
    delay: "delay-400",
  },
];

const stats = [
  { value: "8,400+",  label: "Smart Lights Installed" },
  { value: "−60%",    label: "Energy Consumption" },
  { value: "99.2%",   label: "Network Uptime" },
  { value: "€2.1M",   label: "Annual Savings" },
];

export default function AIStreetlights() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=85"
          alt="AI Streetlights Magdeburg at night"
          fill priority sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0533]/95 via-[#1a0533]/70 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Lightbulb className="h-4 w-4 text-violet-300" />
                <span className="text-sm font-medium text-violet-200 uppercase tracking-widest">
                  Smart City Magdeburg
                </span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">
                AI Streetlights
              </h1>
              <p className="mt-4 text-lg text-violet-100 leading-relaxed">
                Real-time pedestrian detection drives adaptive lighting across all 12 city
                zones — saving energy, enhancing safety, and responding live to where people
                actually are.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#1a0533]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-up delay-${(i + 1) * 100}`}
              >
                <span className="text-3xl font-bold text-white">{s.value}</span>
                <span className="mt-1 text-sm text-violet-300">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────── LIVE PEDESTRIAN DETECTION + HEATMAP ──────────── */}
      <section className="py-16 bg-[#0d1117]">
        <Container>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-1.5 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-sm text-green-300 font-medium">Live Detection Active</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Night Pedestrian Heatmap
            </h2>
            <p className="text-slate-400 max-w-2xl">
              Sensor data from 12 Magdeburg zones updates every 3 seconds. Streetlight
              brightness adjusts automatically — 20% when empty, up to 100% at peak
              pedestrian activity. The heatmap shows where people are right now.
            </p>
          </div>
          <PedestrianHeatmap />
        </Container>
      </section>

      {/* Technology features */}
      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3 animate-fade-up">
            Technology Features
          </h2>
          <p className="text-slate-500 mb-12 animate-fade-up delay-100">
            Intelligent lighting infrastructure powering a smarter Magdeburg.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {streetlightFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-scale-in ${item.delay}`}
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}
                    >
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#061B46]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[#0d1117]">
        <Container>
          <h2 className="text-3xl font-bold text-white mb-10 text-center">How the AI Decides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step:'01', title:'Sensor Detects', desc:'PIR/radar sensors or camera analytics detect human presence anonymously in each zone.', colour:'text-violet-400' },
              { step:'02', title:'Count & Classify', desc:'Pedestrian count per zone is classified: Empty · Low · Active · Busy.', colour:'text-yellow-400' },
              { step:'03', title:'Brightness Decision', desc:'AI maps count to brightness tier: 20% → 45% → 70% → 88% → 100%.', colour:'text-orange-400' },
              { step:'04', title:'Heatmap Updates', desc:'City dashboard reflects live density changes. Logs energy saved per zone.', colour:'text-green-400' },
            ].map(({ step, title, desc, colour }) => (
              <div key={step} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
                <span className={`text-4xl font-black ${colour} opacity-40`}>{step}</span>
                <h3 className="text-white font-semibold mt-3 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
