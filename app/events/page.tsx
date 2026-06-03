"use client";
import Image from "next/image";
import { useState } from "react";
import { CalendarDays, MapPin, Tag, ExternalLink, Search, Clock } from "lucide-react";
import Container from "@/components/layout/Container";

type Category = "Festival" | "Science" | "Music" | "Culture" | "Sport" | "Family";
type Month = "June" | "July" | "August" | "September" | "October";

const events: {
  title: string;
  category: Category;
  date: string;
  month: Month;
  time: string;
  venue: string;
  description: string;
  image: string;
  link: string;
  highlight?: boolean;
}[] = [
  {
    title: "TomorrowLabs — Science Festival",
    category: "Science",
    date: "6 June 2026",
    month: "June",
    time: "4:00 PM – 10:00 PM",
    venue: "Wissenschaftshafen Magdeburg",
    description: "Magdeburg’s flagship science & future festival. Research institutions, universities, and innovators open their doors for live experiments, talks, and music at the Science Port.",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&q=80",
    link: "https://www.mpg.de/events/43771/2183",
    highlight: true,
  },
  {
    title: "Prinzessinnentag 2026",
    category: "Family",
    date: "26 June 2026",
    month: "June",
    time: "10:00 AM – 6:00 PM",
    venue: "Elbauenpark Magdeburg",
    description: "A magical day at the Elbauenpark for families, children’s performances, and outdoor activities in Magdeburg’s beloved riverside park.",
    image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
  },
  {
    title: "Love Music Festival 2026",
    category: "Festival",
    date: "2 July 2026",
    month: "July",
    time: "12:00 PM – Late",
    venue: "Elbauenpark Magdeburg",
    description: "Open-air music festival on the banks of the Elbe. Live bands, food stalls, and a massive stage lineup making it one of Magdeburg’s biggest summer events.",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b99f842?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
    highlight: true,
  },
  {
    title: "Holi Festival of Colours",
    category: "Festival",
    date: "7 July 2026",
    month: "July",
    time: "2:00 PM – 9:00 PM",
    venue: "Elbauenpark Magdeburg",
    description: "The iconic Festival of Colours comes to Magdeburg! Dance to music and celebrate in an explosion of colour powder. Family-friendly, open-air.",
    image: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
  },
  {
    title: "Carmina Burana 2026",
    category: "Culture",
    date: "11 July 2026",
    month: "July",
    time: "8:00 PM",
    venue: "Seebühne Magdeburg",
    description: "Carl Orff’s spectacular choral masterpiece performed open-air on the Seebühne. Full orchestra, choir and dramatic staging under the summer sky.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
  },
  {
    title: "Firmenstaffel 2026",
    category: "Sport",
    date: "4 July 2026",
    month: "July",
    time: "9:00 AM – 5:00 PM",
    venue: "Elbauenpark Magdeburg",
    description: "The city’s major corporate relay race — companies across Magdeburg compete in a fun team running event. Free entry for spectators.",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
  },
  {
    title: "Pyro Games 2026 — Feuerwerker-Duell",
    category: "Festival",
    date: "15 August 2026",
    month: "August",
    time: "9:00 PM – 11:30 PM",
    venue: "Elbauenpark Magdeburg",
    description: "The legendary fireworks duel returns. Teams of pyrotechnicians compete with breathtaking displays over the Elbe in one of Germany’s most spectacular summer shows.",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
    highlight: true,
  },
  {
    title: "Mega Malle — Das Festival der Mallorcastars",
    category: "Music",
    date: "11 August 2026",
    month: "August",
    time: "3:00 PM – Late",
    venue: "Elbauenpark Magdeburg",
    description: "Mallorca party festival featuring the biggest Schläger and Mallorcastar acts. A massive open-air celebration with live acts, beer gardens, and dancing.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
  },
  {
    title: "Zauber der Operette 2026",
    category: "Culture",
    date: "21 August 2026",
    month: "August",
    time: "7:30 PM",
    venue: "Seebühne Magdeburg",
    description: "Magic of the Operetta — an enchanting open-air evening of beloved operetta classics performed by the Magdeburg ensemble on the lakeside stage.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80",
    link: "https://www.mvgm.de/de/events/",
  },
  {
    title: "Internationales Chorfest Magdeburg",
    category: "Music",
    date: "16–20 September 2026",
    month: "September",
    time: "All Day",
    venue: "Stadtmitte Magdeburg",
    description: "Choirs from across the globe gather in Telemann’s birthplace for 5 days of international choral music, competitions, and free outdoor performances across the city.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    link: "https://www.interkultur.com/events/2026/magdeburg",
    highlight: true,
  },
  {
    title: "Company Contact Fair 2026",
    category: "Science",
    date: "21 October 2026",
    month: "October",
    time: "10:00 AM – 5:00 PM",
    venue: "Otto-von-Guericke-Universität",
    description: "Magdeburg’s top careers and networking fair connecting students, graduates, and companies at the university — one of Germany’s leading campus career events.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    link: "https://10times.com/top100/magdeburg-de",
  },
  {
    title: "Sommerabend am Fluss",
    category: "Culture",
    date: "22 May – 11 Sep 2026",
    month: "June",
    time: "7:00 PM",
    venue: "Elbe Riverbank, Magdeburg",
    description: "A recurring summer evening concert and culture series along the Elbe river — local musicians, food vendors, and riverside relaxation all summer long.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    link: "https://www.eventim.de/en/cityd/magdeburg-21/",
  },
];

const categoryConfig: Record<Category, { color: string; bg: string; dot: string }> = {
  Festival: { color: "text-orange-700", bg: "bg-orange-50",  dot: "#ea580c" },
  Science:  { color: "text-violet-700", bg: "bg-violet-50", dot: "#7c3aed" },
  Music:    { color: "text-blue-700",   bg: "bg-blue-50",   dot: "#2563eb" },
  Culture:  { color: "text-rose-700",   bg: "bg-rose-50",   dot: "#e11d48" },
  Sport:    { color: "text-green-700",  bg: "bg-green-50",  dot: "#16a34a" },
  Family:   { color: "text-amber-700",  bg: "bg-amber-50",  dot: "#d97706" },
};

const CATS: (Category | "All")[] = ["All", "Festival", "Music", "Culture", "Science", "Sport", "Family"];
const MONTHS: (Month | "All")[] = ["All", "June", "July", "August", "September", "October"];

export default function Events() {
  const [cat, setCat]     = useState<Category | "All">("All");
  const [month, setMonth] = useState<Month | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = events.filter((e) => {
    const matchCat   = cat   === "All" || e.category === cat;
    const matchMonth = month === "All" || e.month === month;
    const matchQ     = e.title.toLowerCase().includes(query.toLowerCase()) ||
                       e.venue.toLowerCase().includes(query.toLowerCase()) ||
                       e.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchMonth && matchQ;
  });

  const highlights = events.filter((e) => e.highlight);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[480px]">
        <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=85"
          alt="Magdeburg Events" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <CalendarDays className="h-4 w-4 text-orange-300" />
                <span className="text-sm font-medium text-orange-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">City Events</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Concerts, festivals, science fairs and more — discover everything happening in Magdeburg in 2026.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#061B46]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: "72+",  label: "Events in 2026" },
              { value: "5",    label: "Months Covered" },
              { value: "6",    label: "Event Categories" },
              { value: "Free", label: "Many Free Events" },
            ].map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-up delay-${(i+1)*100}`}>
                <span className="text-3xl font-bold text-white">{s.value}</span>
                <span className="mt-1 text-sm text-blue-300">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Highlights carousel */}
      <section className="py-12 bg-white border-b border-slate-100">
        <Container>
          <h2 className="text-2xl font-bold text-[#061B46] mb-6 animate-fade-up">⭐ Highlight Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((e) => {
              const cfg = categoryConfig[e.category];
              return (
                <a key={e.title} href={e.link} target="_blank" rel="noopener noreferrer"
                  className="group relative rounded-[24px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
                  <div className="relative h-44">
                    <Image src={e.image} alt={e.title} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${cfg.bg} ${cfg.color}`}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.dot }} />
                      {e.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs text-blue-200 mb-1">{e.date}</p>
                    <p className="text-sm font-bold text-white leading-snug">{e.title}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Filter + All Events */}
      <section className="py-10">
        <Container>
          {/* Filter bar */}
          <div className="mb-8 flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm animate-fade-up">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search events, venues..."
                value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-[#061B46] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-400 self-center mr-1">CATEGORY</span>
              {CATS.map((c) => (
                <button key={c} onClick={() => setCat(c as Category | "All")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    cat === c ? "bg-[#061B46] text-white" : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}>{c}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-400 self-center mr-1">MONTH</span>
              {MONTHS.map((m) => (
                <button key={m} onClick={() => setMonth(m as Month | "All")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    month === m ? "bg-blue-600 text-white" : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-6">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e, i) => {
              const cfg = categoryConfig[e.category];
              return (
                <div key={e.title} className={`group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-scale-in delay-${Math.min((i % 6 + 1) * 100, 600)}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image src={e.image} alt={e.title} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-sm ${cfg.bg} ${cfg.color}`}>
                      <Tag size={10} />{e.category}
                    </span>
                    {e.highlight && (
                      <span className="absolute top-4 right-4 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-yellow-900">⭐ Featured</span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-[#061B46] leading-snug">{e.title}</h3>
                    <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-blue-400" />{e.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} className="text-blue-400" />{e.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-blue-400" />{e.venue}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500 flex-1">{e.description}</p>
                    <a href={e.link} target="_blank" rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                      More Info <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-lg font-semibold text-[#061B46]">No events found</p>
              <p className="text-sm text-slate-400 mt-2">Try adjusting your filters or search.</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
