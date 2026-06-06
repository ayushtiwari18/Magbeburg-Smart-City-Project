"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const navItems = [
  { de: "Start",             en: "Home",             href: "/" },
  { de: "Sicherheit",        en: "Safety",           href: "/safety" },
  { de: "Mobilität",         en: "Transportation",   href: "/transportation" },
  { de: "Klima",             en: "Climate",          href: "/climate" },
  { de: "Wirtschaft",        en: "Economy",          href: "/economy" },
  { de: "Wohnen",            en: "Housing",          href: "/housing" },
  { de: "KI-Straßenlichter", en: "AI Streetlights",  href: "/ai-streetlights" },
  { de: "Projekte",          en: "Projects",         href: "/projects" },
  { de: "Einblicke",         en: "Insights",         href: "/insights" },
  { de: "Veranstaltungen",   en: "Events",           href: "/events" },
  { de: "Karte",             en: "Map",              href: "/map" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lang, toggle } = useLang();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e8edf5]">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative h-14 w-44">
            <Image src="/image/ottostadt_magdeburg_logo.png" alt="Magdeburg Logo" fill priority sizes="176px" className="object-contain object-left" />
          </div>
        </Link>

        {/* Desktop nav — scrollable on medium screens */}
        <nav className="hidden md:flex h-full items-center gap-5 xl:gap-7 overflow-x-auto no-scrollbar flex-1 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`relative flex-shrink-0 flex h-full items-center text-[13px] xl:text-[13.5px] font-medium transition ${
                isActive(item.href) ? "text-blue-700" : "text-[#061B46] hover:text-blue-700"
              }`}
            >
              {lang === "de" ? item.de : item.en}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-full -translate-x-1/2 rounded-full bg-blue-700" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <button aria-label="Notifications" className="text-[#061B46] transition hover:text-blue-700">
            <Bell size={19} strokeWidth={1.9} />
          </button>
          <div className="h-8 w-px bg-[#d9e1ef]" />
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-xl border border-[#e1e7f0] px-3 py-1.5 text-[13px] font-bold text-[#061B46] transition hover:bg-blue-50 hover:text-blue-700"
          >
            {lang === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
          </button>
        </div>

        <button onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e7f0] text-[#061B46] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e8edf5] bg-white md:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-4 sm:px-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                  isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-[#061B46] hover:bg-[#f4f7fb]"
                }`}
              >
                {lang === "de" ? item.de : item.en}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-[#e8edf5] pt-4">
              <button aria-label="Notifications" className="flex items-center gap-2 text-sm text-[#061B46]">
                <Bell size={18} /> {lang === "de" ? "Benachrichtigungen" : "Notifications"}
              </button>
              <button onClick={toggle}
                className="rounded-xl border border-[#e1e7f0] px-3 py-1.5 text-sm font-bold text-[#061B46]">
                {lang === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
