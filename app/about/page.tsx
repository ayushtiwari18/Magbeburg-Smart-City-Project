import Image from "next/image";
import { Building2, Target, Globe2, HeartHandshake } from "lucide-react";
import Container from "@/components/layout/Container";

const pillars = [
  {
    icon: Target,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Our Mission",
    description: "To transform Magdeburg into a leading European smart city by combining digital innovation with citizen-first urban planning.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    delay: "delay-100",
  },
  {
    icon: Globe2,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Sustainability",
    description: "Every initiative is designed with environmental responsibility at its core — targeting carbon neutrality by 2035.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    delay: "delay-200",
  },
  {
    icon: HeartHandshake,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Citizen Participation",
    description: "Residents are partners in building the smart city — from online surveys to open hackathons like this one.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    delay: "delay-300",
  },
  {
    icon: Building2,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Governance",
    description: "Transparent, data-backed decision making ensures every euro invested in smart city infrastructure delivers measurable value.",
    image: "https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?w=600&q=80",
    delay: "delay-400",
  },
];

export default function About() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="relative h-[420px] sm:h-[480px]">
        <Image
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=85"
          alt="About Magdeburg"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Building2 className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Our Vision</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">Magdeburg — reimagining its future through smart technology, sustainable infrastructure, and inclusive civic participation.</p>
            </div>
          </Container>
        </div>
      </section>

      {/* Vision quote */}
      <section className="py-16 bg-white border-b border-slate-100">
        <Container>
          <div className="max-w-3xl animate-fade-up">
            <div className="flex gap-5">
              <div className="mt-1 w-[4px] min-h-[80px] rounded-full bg-[#6F8FD8] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-[#061B46]">Smart City. Sustainable Future.</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  By 2030, Magdeburg aims to be fully connected — where every street, service, and system speaks a common digital language. This platform was built as part of the{" "}
                  <span className="font-semibold text-[#061B46]">Magdeburg Smart City Hackathon</span>.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3 animate-fade-up">Our Pillars</h2>
          <p className="text-slate-500 mb-12 animate-fade-up delay-100">The four foundations of Magdeburg's smart city transformation.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => {
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
