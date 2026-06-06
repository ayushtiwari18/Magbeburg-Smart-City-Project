import Link from "next/link";
import {
  Shield,
  Bus,
  Cloud,
  Lightbulb,
  BarChart3,
  Home,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Safety",
    description: "Real accident data. Safer streets for everyone.",
    href: "/safety",
    icon: Shield,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    title: "Smart Transportation",
    description: "Efficient. Connected. Sustainable.",
    href: "/transportation",
    icon: Bus,
    color: "text-green-700",
    bg: "bg-green-50",
  },
  {
    title: "Climate",
    description: "75 years of temperature data visualised.",
    href: "/climate",
    icon: Cloud,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "AI Streetlights",
    description: "Smart lighting for a smarter city.",
    href: "/ai-streetlights",
    icon: Lightbulb,
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  {
    title: "City Insights",
    description: "Tax revenue & city finances 2010–2025.",
    href: "/insights",
    icon: BarChart3,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    title: "Rent Index",
    description: "Net cold rent per district — Mietspiegel 2024.",
    href: "/housing",
    icon: Home,
    color: "text-teal-700",
    bg: "bg-teal-50",
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-[#f8fafc] py-6">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Explore Smart City
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="
                  group flex min-h-[180px] flex-col justify-between
                  rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                "
              >
                <div>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-[#061B46]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.description}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  <ArrowRight className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${item.color}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
