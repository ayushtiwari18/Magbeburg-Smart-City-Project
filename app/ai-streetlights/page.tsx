import { Lightbulb, Zap, Moon, Activity, BrainCircuit } from "lucide-react";
import Container from "@/components/layout/Container";

const streetlightFeatures = [
  {
    icon: BrainCircuit,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Adaptive Brightness",
    description:
      "AI adjusts streetlight intensity based on real-time pedestrian density, weather, and ambient light conditions.",
  },
  {
    icon: Zap,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Energy Savings",
    description:
      "Smart dimming and scheduling cuts street lighting energy consumption by up to 60% compared to conventional systems.",
  },
  {
    icon: Moon,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Light Pollution Reduction",
    description:
      "Directional LED fixtures and intelligent scheduling minimize light pollution, protecting the night sky and local wildlife.",
  },
  {
    icon: Activity,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Predictive Maintenance",
    description:
      "Sensors detect bulb degradation and faults before failure, triggering automated maintenance requests to reduce outages.",
  },
];

const stats = [
  { value: "8,400+", label: "Smart Lights Installed" },
  { value: "−60%", label: "Energy Consumption" },
  { value: "99.2%", label: "Network Uptime" },
  { value: "€2.1M", label: "Annual Savings" },
];

export default function AIStreetlights() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
              <Lightbulb className="h-7 w-7 text-violet-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Smart City Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                AI Streetlights
              </h1>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Smart lighting for a smarter city — AI-driven streetlights that
            save energy, enhance safety, and adapt to the city's rhythm.
          </p>
        </Container>
      </section>

      <section className="bg-[#061B46]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-8 px-4 bg-[#061B46] text-center"
              >
                <span className="text-3xl font-bold text-white">{s.value}</span>
                <span className="mt-1 text-sm text-blue-200">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-[#061B46] mb-8">
            Technology Features
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {streetlightFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${item.bg}`}
                  >
                    <Icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#061B46]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
