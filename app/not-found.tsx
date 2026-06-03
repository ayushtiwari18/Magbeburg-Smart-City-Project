import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <div className="bg-[#f8fafc] min-h-[80vh] flex items-center">
      <Container className="py-20">
        <div className="flex flex-col items-center text-center">
          {/* Big 404 */}
          <div className="relative mb-8">
            <span className="text-[160px] font-bold leading-none text-slate-100 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <MapPin className="h-10 w-10 text-blue-700" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#061B46] mb-3">
            Seite nicht gefunden
          </h1>
          <p className="text-lg text-slate-500 max-w-md leading-8 mb-10">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
            Kehren Sie zur Startseite zurück, um weiterzumachen.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#061B46] shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            <ArrowLeft size={18} />
            Zurück zur Startseite
          </Link>
        </div>
      </Container>
    </div>
  );
}
