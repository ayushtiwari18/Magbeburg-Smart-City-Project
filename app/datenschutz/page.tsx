import Container from "@/components/layout/Container";
import { ShieldCheck } from "lucide-react";

export default function Datenschutz() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <ShieldCheck className="h-7 w-7 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Landeshauptstadt Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                Datenschutzerklärung
              </h1>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-2xl space-y-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">1. Datenschutz auf einen Blick</h2>
              <p className="text-slate-600 leading-8">
                Diese Website wurde im Rahmen eines Hackathons erstellt und erhebt keine
                personenbezogenen Daten. Es werden keine Cookies gesetzt und keine
                Nutzerdaten gespeichert oder weitergegeben.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">2. Hosting</h2>
              <p className="text-slate-600 leading-8">
                Diese Website wird auf Vercel gehostet. Beim Aufruf der Website werden
                automatisch Server-Log-Dateien durch den Hosting-Anbieter gespeichert.
                Weitere Informationen finden Sie in der{" "}
                <a href="https://vercel.com/legal/privacy-policy" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
                  Datenschutzerklärung von Vercel
                </a>.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">3. Ihre Rechte</h2>
              <p className="text-slate-600 leading-8">
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung
                der Verarbeitung Ihrer personenbezogenen Daten sowie das Recht auf
                Datenübertragbarkeit gemäß DSGVO.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">4. Kontakt</h2>
              <p className="text-slate-600 leading-8">
                Bei Fragen zum Datenschutz wenden Sie sich an:<br />
                E-Mail: datenschutz@magdeburg.de
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
