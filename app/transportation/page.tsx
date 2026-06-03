import { Bus, Train, Bike, Navigation, Clock, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";

const transportFeatures = [
  {
    icon: Bus,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Smart Bus Network",
    description:
      "Real-time GPS tracking on all city buses with dynamic scheduling that adapts to live traffic conditions.",
  },
  {
    icon: Train,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Tram Integration",
    description:
      "Magdeburg's tram network is fully connected to the smart city platform for unified ticketing and live updates.",
  },
  {
    icon: Bike,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "E-Bike Sharing",
    description:
      "300+ electric bikes available across 60 docking stations, bookable via the city app with real-time availability.",
  },
  {
    icon: Navigation,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Multimodal Routing",
    description:
      "One platform to plan journeys combining tram, bus, bike, and walking for the fastest sustainable route.",
  },
];

const stats = [
  { value: "98%", label: "On-Time Accuracy" },
  { value: "60+", label: "Docking Stations" },
  { value: "1.2M", label: "Monthly Rides" },
  { value: "−18%", label: "CO₂ vs. Last Year" },
];

export default function Transportation() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <Bus className="h-7 w-7 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Smart City Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                Smart Transportation
              </h1>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Efficient, connected, and sustainable mobility solutions that move
            Magdeburg forward while reducing its carbon footprint.
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
            Transport Initiatives
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {transportFeatures.map((item) => {
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
