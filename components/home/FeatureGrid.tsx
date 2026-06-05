import Link from "next/link";
import {
  Shield,
  Bus,
  Cloud,
  Lightbulb,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Safety",
    description: "Building a safer Magdeburg for all.",
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
    description: "A greener city for a better tomorrow.",
    href: "/climate",
    icon: Cloud,
    color: "text-blue-700",
    bg: "bg-blue-50",
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
    description: "Data-driven decisions for real impact.",
    href: "/insights",
    icon: BarChart3,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-[#f8fafc] py-12">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        {/* Section label */}
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Explore Smart City
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="
                  group
                  flex
                  min-h-[250px]
                  flex-col
                  justify-between
                  rounded-[28px]
                  border
                  border-slate-200
                  bg-white
                  p-7
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div>
                  <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-full ${item.bg}`}>
                    <Icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#061B46]">{item.title}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-600">{item.description}</p>
                </div>
                <div className="mt-8 flex justify-end">
                  <ArrowRight className={`h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 ${item.color}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
