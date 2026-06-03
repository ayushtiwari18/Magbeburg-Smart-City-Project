export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          
          {/* Left */}
          <p>
            © {new Date().getFullYear()} Landeshauptstadt Magdeburg
          </p>

          {/* Right */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="transition hover:text-slate-700"
            >
              Impressum
            </a>

            <a
              href="#"
              className="transition hover:text-slate-700"
            >
              Datenschutz
            </a>

            <a
              href="#"
              className="transition hover:text-slate-700"
            >
              Barrierefreiheit
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}