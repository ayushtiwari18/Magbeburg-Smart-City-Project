import Container from "@/components/layout/Container";
import { FileText } from "lucide-react";

export default function Impressum() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <FileText className="h-7 w-7 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Landeshauptstadt Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                Impressum
              </h1>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-2xl space-y-10">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Angaben gemäß § 5 TMG</h2>
              <p className="text-slate-600 leading-8">
                Landeshauptstadt Magdeburg<br />
                Alter Markt 6<br />
                39104 Magdeburg<br />
                Deutschland
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Vertreten durch</h2>
              <p className="text-slate-600 leading-8">
                Oberbürgermeister der Landeshauptstadt Magdeburg
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Kontakt</h2>
              <p className="text-slate-600 leading-8">
                Telefon: +49 (0) 391 540-0<br />
                E-Mail: stadtrat@magdeburg.de<br />
                Web: <a href="https://www.magdeburg.de" className="text-blue-700 hover:underline">www.magdeburg.de</a>
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Hinweis</h2>
              <p className="text-slate-600 leading-8">
                Diese Website wurde im Rahmen des Magdeburg Smart City Hackathons erstellt
                und dient ausschließlich Demonstrationszwecken.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
