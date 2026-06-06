"use client";

import { useState } from "react";
import Link from "next/link";
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
];

/** Inline SVG logo — a stylised city skyline badge for Magdeburg Smart City */
function MagdeburgLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Badge icon */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nb-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1d4ed8"/>
            <stop offset="100%" stopColor="#0f2952"/>
          </linearGradient>
          <linearGradient id="nb-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047"/>
            <stop offset="100%" stopColor="#ca8a04"/>
          </linearGradient>
        </defs>
        {/* rounded square bg */}
        <rect width="40" height="40" rx="10" fill="url(#nb-bg)"/>
        {/* city buildings */}
        <rect x="5"  y="22" width="5"  height="13" rx="1" fill="rgba(255,255,255,0.25)"/>
        <rect x="12" y="17" width="5"  height="18" rx="1" fill="rgba(255,255,255,0.35)"/>
        <rect x="19" y="12" width="6"  height="23" rx="1" fill="rgba(255,255,255,0.55)"/>
        <rect x="27" y="18" width="4"  height="17" rx="1" fill="rgba(255,255,255,0.35)"/>
        <rect x="33" y="24" width="4"  height="11" rx="1" fill="rgba(255,255,255,0.22)"/>
        {/* pediment on tallest */}
        <polygon points="18,12 22,7 26,12" fill="rgba(255,255,255,0.4)"/>
        {/* euro sign */}
        <text x="22" y="27" textAnchor="middle"
          style={{ fill:"url(#nb-gold)", fontSize:"8px", fontWeight:900,
            filter:"drop-shadow(0 0 3px rgba(253,224,71,0.8))" }}>€</text>
        {/* ground */}
        <rect x="3" y="35" width="34" height="1.5" rx="1" fill="rgba(255,255,255,0.15)"/>
        {/* antenna dot */}
        <circle cx="22" cy="5.5" r="1.3" fill="#fde047"
          style={{ filter:"drop-shadow(0 0 3px #fde047)" }}/>
      </svg>

      {/* wordmark */}
      <div style={{ lineHeight: 1.1 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: ".02em",
          background: "linear-gradient(90deg,#1d4ed8,#0ea5e9)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>MAGDEBURG</div>
        <div style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: ".12em",
          color: "var(--text-secondary, rgba(100,116,139,1))",
          textTransform: "uppercase",
        }}>Smart City</div>
      </div>
    </div>
  );
}

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
        <Link href="/" className="flex items-center flex-shrink-0">
          <MagdeburgLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex h-full items-center gap-5 xl:gap-7 overflow-x-auto no-scrollbar flex-1 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`relative flex-shrink-0 flex h-full items-center text-[13px] xl:text-[13.5px] font-medium transition ${
                isActive(item.href) ? "text-blue-600" : "hover:text-blue-600"
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

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition hover:bg-blue-50 dark:hover:bg-slate-800"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {isDark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
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
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  {isDark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
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
