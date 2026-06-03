import Image from "next/image";
import { BarChart3, TrendingUp, Users, Map, Database } from "lucide-react";
import Container from "@/components/layout/Container";

const insightCategories = [
  {
    icon: TrendingUp,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Live KPI Dashboard",
    description: "Track Magdeburg's key performance indicators across safety, transport, climate, and energy in a single real-time view.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    delay: "delay-100",
  },
  {
    icon: Users,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Citizen Feedback",
    description: "Aggregated sentiment and satisfaction data from residents, collected via the smart city portal and public kiosks.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    delay: "delay-200",
  },
  {
    icon: Map,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "District Heatmaps",
    description: "Interactive maps showing neighbourhood-level data on noise, traffic, air quality, and public service usage.",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80",
    delay: "delay-300",
  },
  {
    icon: Database,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Open Data Portal",
    description: "Anonymised city data made available to researchers, developers, and citizens to foster innovation and transparency.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80",
    delay: "delay-400",
  },
];

const stats = [
  { value: "140+", label: "Live Data Streams" },
  { value: "3.8M", label: "Data Points / Day" },
  { value: "28", label: "City Districts Covered" },
  { value: "99.7%", label: "Dashboard Uptime" },
];

export default function Insights() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="relative h-[420px] sm:h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=85"
          alt="City Insights"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <BarChart3 className="h-4 w-4 text-amber-300" />
                <span className="text-sm font-medium text-amber-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">City Insights</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">Data-driven decisions for real impact — turning Magdeburg's city data into actionable intelligence.</p>
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
          <h2 className="text-3xl font-bold text-[#061B46] mb-3 animate-fade-up">Insight Categories</h2>
          <p className="text-slate-500 mb-12 animate-fade-up delay-100">Real-time intelligence powering smarter decisions across the city.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {insightCategories.map((item) => {
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
