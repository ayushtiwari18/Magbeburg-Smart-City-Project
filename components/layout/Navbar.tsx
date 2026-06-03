"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Safety", href: "/safety" },
  { label: "Smart Transportation", href: "/transportation" },
  { label: "Climate", href: "/climate" },
  { label: "AI Streetlights", href: "/ai-streetlights" },
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e8edf5]">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-14 w-44">
            <Image
              src="/image/ottostadt_magdeburg_logo.png"
              alt="Magdeburg Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden h-full items-center gap-9 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex h-full items-center text-[14px] font-medium text-[#061B46] transition hover:text-blue-700"
            >
              {item.label}
              {item.label === "Home" && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-[70px] -translate-x-1/2 rounded-full bg-[#061B46]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-5 xl:flex">
          <button
            aria-label="Notifications"
            className="text-[#061B46] transition hover:text-blue-700"
          >
            <Bell size={19} strokeWidth={1.9} />
          </button>
          <div className="h-8 w-px bg-[#d9e1ef]" />
          <button className="flex items-center gap-2 text-[14px] font-semibold text-[#061B46]">
            DE
            <ChevronDown size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e7f0] text-[#061B46] xl:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-[#e8edf5] bg-white xl:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-4 sm:px-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-[#061B46] hover:bg-[#f4f7fb]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-[#e8edf5] pt-4">
              <button className="flex items-center gap-2 text-sm text-[#061B46]">
                <Bell size={18} />
                Notifications
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold text-[#061B46]">
                DE
                <ChevronDown size={15} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
