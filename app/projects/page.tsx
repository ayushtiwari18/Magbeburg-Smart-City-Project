import { FolderOpen, CalendarDays, CheckCircle2, Clock4, Circle } from "lucide-react";
import Container from "@/components/layout/Container";

type Status = "Completed" | "In Progress" | "Planned";

const projects: {
  title: string;
  category: string;
  description: string;
  status: Status;
  year: string;
  color: string;
  bg: string;
}[] = [
  {
    title: "Smart Streetlight Rollout Phase 1",
    category: "AI Streetlights",
    description: "Installation of 4,200 adaptive LED streetlights across the northern districts with IoT connectivity.",
    status: "Completed",
    year: "2024",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  {
    title: "Real-Time Bus Tracking System",
    category: "Transportation",
    description: "GPS-based live tracking for all 68 city bus routes integrated with the MVB app.",
    status: "Completed",
    year: "2024",
    color: "text-green-700",
    bg: "bg-green-50",
  },
  {
    title: "Urban Air Quality Sensor Network",
    category: "Climate",
    description: "Deployment of 80 micro air quality sensors across all 28 districts, feeding the city data platform.",
    status: "In Progress",
    year: "2025",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    title: "Community Safety SOS Stations",
    category: "Safety",
    description: "Installation of 120 emergency call stations in public parks and pedestrian zones.",
    status: "In Progress",
    year: "2025",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    title: "Open City Data Portal",
    category: "City Insights",
    description: "A public-facing open data platform publishing anonymised datasets for developers and researchers.",
    status: "Planned",
    year: "2026",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    title: "E-Bike Docking Expansion",
    category: "Transportation",
    description: "Adding 30 new e-bike docking stations in underserved suburbs as part of the green mobility plan.",
    status: "Planned",
    year: "2026",
    color: "text-green-700",
    bg: "bg-green-50",
  },
];

const statusConfig: Record<Status, { icon: React.ElementType; className: string; dot: string }> = {
  Completed: { icon: CheckCircle2, className: "text-green-700 bg-green-50", dot: "bg-green-500" },
  "In Progress": { icon: Clock4, className: "text-amber-700 bg-amber-50", dot: "bg-amber-500" },
  Planned: { icon: Circle, className: "text-slate-500 bg-slate-100", dot: "bg-slate-400" },
};

export default function Projects() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <FolderOpen className="h-7 w-7 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Smart City Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                Projects
              </h1>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-slate-600 leading-relaxed">
            A transparent overview of every smart city initiative — from completed
            rollouts to future plans shaping Magdeburg's digital future.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const cfg = statusConfig[project.status];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={project.title}
                  className="flex flex-col rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${project.bg} ${project.color}`}
                    >
                      {project.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {project.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#061B46] leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 flex-1">
                    {project.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                    <span>{project.year}</span>
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
