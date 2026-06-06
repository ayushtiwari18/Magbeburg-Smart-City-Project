"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, Sun, Moon } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

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
  const { lang, toggle: toggleLang } = useLang();
  const { isDark, toggle: toggleTheme } = useTheme();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b"
      style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative h-14 w-44">
            <Image src="/image/ottostadt_magdeburg_logo.png" alt="Magdeburg Logo" fill priority sizes="176px" className="object-contain object-left" />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex h-full items-center gap-5 xl:gap-7 overflow-x-auto no-scrollbar flex-1 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`relative flex-shrink-0 flex h-full items-center text-[13px] xl:text-[13.5px] font-medium transition ${
                isActive(item.href)
                  ? "text-blue-600"
                  : "hover:text-blue-600"
              }`}
              style={{ color: isActive(item.href) ? undefined : "var(--text-primary)" }}
            >
              {lang === "de" ? item.de : item.en}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-full -translate-x-1/2 rounded-full bg-blue-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button aria-label="Notifications" className="transition hover:text-blue-600" style={{ color: "var(--text-primary)" }}>
            <Bell size={19} strokeWidth={1.9} />
          </button>

          {/* ── Dark / Light toggle ── */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition hover:bg-blue-50 dark:hover:bg-slate-800"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {isDark
              ? <Sun  size={16} className="text-yellow-400" />
              : <Moon size={16} />}
          </button>

          <div className="h-8 w-px" style={{ backgroundColor: "var(--border)" }} />

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[13px] font-bold transition hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {lang === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border md:hidden"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          aria-label="Toggle menu"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t md:hidden" style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}>
          <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-4 sm:px-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                  isActive(item.href) ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                style={{ color: isActive(item.href) ? undefined : "var(--text-primary)" }}
              >
                {lang === "de" ? item.de : item.en}
              </Link>
            ))}

            <div className="mt-3 flex items-center justify-between border-t pt-4"
              style={{ borderColor: "var(--nav-border)" }}>
              <button aria-label="Notifications" className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-primary)" }}>
                <Bell size={18} /> {lang === "de" ? "Benachrichtigungen" : "Notifications"}
              </button>
              <div className="flex items-center gap-2">
                {/* Theme toggle in mobile menu */}
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  {isDark
                    ? <Sun  size={16} className="text-yellow-400" />
                    : <Moon size={16} />}
                </button>
                <button onClick={toggleLang}
                  className="rounded-xl border px-3 py-1.5 text-sm font-bold"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
                  {lang === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
