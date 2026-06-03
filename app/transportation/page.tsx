import Image from "next/image";
import { Bus, Train, Bike, Navigation } from "lucide-react";
import Container from "@/components/layout/Container";

const transportFeatures = [
  {
    icon: Bus,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Smart Bus Network",
    description: "Real-time GPS tracking on all city buses with dynamic scheduling that adapts to live traffic conditions.",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80",
    delay: "delay-100",
  },
  {
    icon: Train,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Tram Integration",
    description: "Magdeburg's tram network is fully connected to the smart city platform for unified ticketing and live updates.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    delay: "delay-200",
  },
  {
    icon: Bike,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "E-Bike Sharing",
    description: "300+ electric bikes available across 60 docking stations, bookable via the city app with real-time availability.",
    image: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600&q=80",
    delay: "delay-300",
  },
  {
    icon: Navigation,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Multimodal Routing",
    description: "One platform to plan journeys combining tram, bus, bike, and walking for the fastest sustainable route.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
    delay: "delay-400",
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
      <section className="relative h-[420px] sm:h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=85"
          alt="Smart Transportation"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Bus className="h-4 w-4 text-green-300" />
                <span className="text-sm font-medium text-green-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Smart Transportation</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">Efficient, connected, and sustainable mobility solutions that move Magdeburg forward.</p>
            </div>
          </Container>
        </div>
      </section>

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

      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3 animate-fade-up">Transport Initiatives</h2>
          <p className="text-slate-500 mb-12 animate-fade-up delay-100">Connecting every corner of Magdeburg sustainably.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {transportFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-scale-in ${item.delay}`}>
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
    </div>
  );
}
