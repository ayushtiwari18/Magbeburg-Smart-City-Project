import Image from "next/image";
import { Cloud, Leaf, Droplets, Wind, Thermometer } from "lucide-react";
import Container from "@/components/layout/Container";

const climateInitiatives = [
  {
    icon: Leaf,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Urban Greening",
    description: "Over 5,000 new trees planted across Magdeburg as part of a 10-year urban forest expansion plan to combat heat islands.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    delay: "delay-100",
  },
  {
    icon: Droplets,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Smart Water Management",
    description: "IoT sensors monitor water quality and consumption across the city, reducing waste and detecting leaks automatically.",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80",
    delay: "delay-200",
  },
  {
    icon: Wind,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Air Quality Monitoring",
    description: "A network of 80+ sensors provides real-time air quality data, helping residents make informed decisions daily.",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&q=80",
    delay: "delay-300",
  },
  {
    icon: Thermometer,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Heat Island Reduction",
    description: "Cool pavements, green roofs, and shaded public spaces reduce urban temperatures by up to 4°C in summer months.",
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80",
    delay: "delay-400",
  },
];

const stats = [
  { value: "−32%", label: "CO₂ Since 2020" },
  { value: "80+", label: "Air Quality Sensors" },
  { value: "5,000+", label: "New Trees Planted" },
  { value: "2035", label: "Carbon Neutral Target" },
];

export default function Climate() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="relative h-[420px] sm:h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85"
          alt="Climate"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
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
