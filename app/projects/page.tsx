import Image from "next/image";
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
  image: string;
  delay: string;
}[] = [
  {
    title: "Smart Streetlight Rollout Phase 1",
    category: "AI Streetlights",
    description: "Installation of 4,200 adaptive LED streetlights across the northern districts with IoT connectivity.",
    status: "Completed",
    year: "2024",
    color: "text-violet-700",
    bg: "bg-violet-50",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80",
    delay: "delay-100",
  },
  {
    title: "Real-Time Bus Tracking System",
    category: "Transportation",
    description: "GPS-based live tracking for all 68 city bus routes integrated with the MVB app.",
    status: "Completed",
    year: "2024",
    color: "text-green-700",
    bg: "bg-green-50",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80",
    delay: "delay-200",
  },
  {
    title: "Urban Air Quality Sensor Network",
    category: "Climate",
    description: "Deployment of 80 micro air quality sensors across all 28 districts, feeding the city data platform.",
    status: "In Progress",
    year: "2025",
    color: "text-blue-700",
    bg: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&q=80",
    delay: "delay-300",
  },
  {
    title: "Community Safety SOS Stations",
    category: "Safety",
    description: "Installation of 120 emergency call stations in public parks and pedestrian zones.",
    status: "In Progress",
    year: "2025",
    color: "text-blue-700",
    bg: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&q=80",
    delay: "delay-400",
  },
  {
    title: "Open City Data Portal",
    category: "City Insights",
    description: "A public-facing open data platform publishing anonymised datasets for developers and researchers.",
    status: "Planned",
    year: "2026",
    color: "text-amber-700",
    bg: "bg-amber-50",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    delay: "delay-500",
  },
  {
    title: "E-Bike Docking Expansion",
    category: "Transportation",
    description: "Adding 30 new e-bike docking stations in underserved suburbs as part of the green mobility plan.",
    status: "Planned",
    year: "2026",
    color: "text-green-700",
    bg: "bg-green-50",
    image: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600&q=80",
    delay: "delay-600",
  },
];

const statusConfig: Record<Status, { icon: React.ElementType; className: string }> = {
  Completed:    { icon: CheckCircle2, className: "text-green-700 bg-green-50" },
  "In Progress": { icon: Clock4,       className: "text-amber-700 bg-amber-50" },
  Planned:      { icon: Circle,        className: "text-slate-500 bg-slate-100" },
};

export default function Projects() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="relative h-[420px] sm:h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85"
          alt="Projects"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <FolderOpen className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Projects</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">A transparent overview of every smart city initiative — from completed rollouts to future plans.</p>
            </div>
          </Container>
        </div>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3 animate-fade-up">All Initiatives</h2>
          <p className="text-slate-500 mb-12 animate-fade-up delay-100">Tracking every project shaping Magdeburg's digital future.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const cfg = statusConfig[project.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={project.title} className={`group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-scale-in ${project.delay}`}>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image src={project.image} alt={project.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${cfg.className}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className={`inline-flex self-start items-center rounded-full px-3 py-1 text-xs font-semibold mb-4 ${project.bg} ${project.color}`}>
                      {project.category}
                    </span>
                    <h3 className="text-lg font-semibold text-[#061B46] leading-snug">{project.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">{project.description}</p>
                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                      <CalendarDays className="h-4 w-4" />
                      <span>{project.year}</span>
                    </div>
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
