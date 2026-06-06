import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-6 sm:px-10 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          {/* Left */}
          <p>© {new Date().getFullYear()} Landeshauptstadt Magdeburg</p>

          {/* Right */}
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="transition hover:text-slate-700">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition hover:text-slate-700">
              Datenschutz
            </Link>
            <Link href="/barrierefreiheit" className="transition hover:text-slate-700">
              Barrierefreiheit
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
