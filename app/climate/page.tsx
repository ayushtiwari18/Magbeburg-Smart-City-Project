import { Cloud, Leaf, Droplets, Wind, Thermometer } from "lucide-react";
import Container from "@/components/layout/Container";

const climateInitiatives = [
  {
    icon: Leaf,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Urban Greening",
    description:
      "Over 5,000 new trees planted across Magdeburg as part of a 10-year urban forest expansion plan to combat heat islands.",
  },
  {
    icon: Droplets,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Smart Water Management",
    description:
      "IoT sensors monitor water quality and consumption across the city, reducing waste and detecting leaks automatically.",
  },
  {
    icon: Wind,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Air Quality Monitoring",
    description:
      "A network of 80+ sensors provides real-time air quality data, helping residents make informed decisions daily.",
  },
  {
    icon: Thermometer,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Heat Island Reduction",
    description:
      "Cool pavements, green roofs, and shaded public spaces reduce urban temperatures by up to 4°C in summer months.",
  },
];

const stats = [
  { value: "−32%", label: "CO₂ Emissions Since 2020" },
  { value: "80+", label: "Air Quality Sensors" },
  { value: "5,000+", label: "New Trees Planted" },
  { value: "2035", label: "Carbon Neutral Target" },
];

export default function Climate() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Cloud className="h-7 w-7 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Smart City Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                Climate
              </h1>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-slate-600 leading-relaxed">
            A greener city for a better tomorrow — Magdeburg's climate strategy
            combines smart technology with sustainable urban planning.
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
            Climate Initiatives
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {climateInitiatives.map((item) => {
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
