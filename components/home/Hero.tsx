import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[240px] sm:h-[270px] lg:h-[300px]">
        <Image
          src="/image/home_page_baner_image.jpg"
          alt="Magdeburg Skyline"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_15%] md:object-[80%_12%] lg:object-[80%_10%]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.75)_25%,rgba(255,255,255,0.10)_40%,rgba(255,255,255,0)_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-white/80 to-white" />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full px-6 sm:px-10 lg:px-20">
            <div className="max-w-[650px]">
              <div className="flex gap-5">
                <div className="mt-1 h-16 w-[4px] rounded-full bg-[#6F8FD8]" />
                <div>
                  <p className="mb-1 text-base text-slate-600 sm:text-lg">
                    Willkommen in
                  </p>
                  <h1 className="text-4xl font-bold tracking-[-0.05em] text-[#061B46] sm:text-5xl lg:text-6xl">
                    Magdeburg
                  </h1>
                  <p className="mt-2 text-base text-slate-600 sm:text-lg">
                    Smart City. Sustainable Future.
                  </p>
                  <Link
                    href="/about"
                    className="mt-4 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#061B46] shadow-sm transition hover:bg-slate-50 hover:shadow-md"
                  >
                    Mehr über unsere Vision
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
