import { BarChart3, TrendingUp, Users, Map, Database } from "lucide-react";
import Container from "@/components/layout/Container";

const insightCategories = [
  {
    icon: TrendingUp,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Live KPI Dashboard",
    description:
      "Track Magdeburg's key performance indicators across safety, transport, climate, and energy in a single real-time view.",
  },
  {
    icon: Users,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Citizen Feedback",
    description:
      "Aggregated sentiment and satisfaction data from residents, collected via the smart city portal and public kiosks.",
  },
  {
    icon: Map,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "District Heatmaps",
    description:
      "Interactive maps showing neighbourhood-level data on noise, traffic, air quality, and public service usage.",
  },
  {
    icon: Database,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Open Data Portal",
    description:
      "Anonymised city data made available to researchers, developers, and citizens to foster innovation and transparency.",
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
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <BarChart3 className="h-7 w-7 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Smart City Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                City Insights
              </h1>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Data-driven decisions for real impact — turning Magdeburg's city
            data into actionable intelligence for residents and planners alike.
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
            Insight Categories
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {insightCategories.map((item) => {
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
