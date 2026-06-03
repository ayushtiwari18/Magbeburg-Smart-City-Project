import { Building2, Target, Globe2, HeartHandshake } from "lucide-react";
import Container from "@/components/layout/Container";

const pillars = [
  {
    icon: Target,
    color: "text-blue-700",
    bg: "bg-blue-50",
    title: "Our Mission",
    description:
      "To transform Magdeburg into a leading European smart city by combining digital innovation with citizen-first urban planning.",
  },
  {
    icon: Globe2,
    color: "text-green-700",
    bg: "bg-green-50",
    title: "Sustainability",
    description:
      "Every initiative is designed with environmental responsibility at its core — targeting carbon neutrality by 2035.",
  },
  {
    icon: HeartHandshake,
    color: "text-violet-700",
    bg: "bg-violet-50",
    title: "Citizen Participation",
    description:
      "Residents are partners in building the smart city — from online surveys to open hackathons like this one.",
  },
  {
    icon: Building2,
    color: "text-amber-700",
    bg: "bg-amber-50",
    title: "Governance",
    description:
      "Transparent, data-backed decision making ensures every euro invested in smart city infrastructure delivers measurable value.",
  },
];

export default function About() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Building2 className="h-7 w-7 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Smart City Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                About Our Vision
              </h1>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Magdeburg — Sachsen-Anhalt's capital and one of Germany's oldest
            cities — is reimagining its future through smart technology,
            sustainable infrastructure, and inclusive civic participation.
          </p>
        </Container>
      </section>

      {/* Vision Statement */}
      <section className="py-16 bg-white border-b border-slate-200">
        <Container>
          <div className="max-w-3xl">
            <div className="flex gap-5">
              <div className="mt-1 h-full w-[4px] min-h-[80px] rounded-full bg-[#6F8FD8] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-[#061B46]">
                  Smart City. Sustainable Future.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  By 2030, Magdeburg aims to be fully connected — where every
                  street, service, and system speaks a common digital language.
                  This platform is built to showcase and enable that
                  transformation, created as part of the{" "}
                  <span className="font-semibold text-[#061B46]">
                    Magdeburg Smart City Hackathon
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-[#061B46] mb-8">
            Our Pillars
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => {
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
