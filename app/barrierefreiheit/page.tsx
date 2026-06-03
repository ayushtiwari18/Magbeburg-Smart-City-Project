import Container from "@/components/layout/Container";
import { Accessibility } from "lucide-react";

export default function Barrierefreiheit() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <Container className="py-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
              <Accessibility className="h-7 w-7 text-violet-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                Landeshauptstadt Magdeburg
              </p>
              <h1 className="text-4xl font-bold text-[#061B46] tracking-tight">
                Barrierefreiheitserklärung
              </h1>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-2xl space-y-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Unser Anspruch</h2>
              <p className="text-slate-600 leading-8">
                Die Landeshauptstadt Magdeburg ist bemüht, ihre Website barrierefrei
                zugänglich zu machen. Diese Erklärung gilt für das Smart City
                Demonstrationsprojekt, das im Rahmen eines Hackathons entwickelt wurde.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Stand der Barrierefreiheit</h2>
              <p className="text-slate-600 leading-8">
                Diese Website erfüllt die Anforderungen der WCAG 2.1 Stufe AA teilweise.
                Da es sich um ein Hackathon-Projekt handelt, sind einige Bereiche noch
                in Bearbeitung und werden schrittweise verbessert.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Bekannte Einschränkungen</h2>
              <ul className="text-slate-600 leading-9 list-disc list-inside space-y-1">
                <li>Einige Diagramme und Infografiken sind noch ohne Textalternative</li>
                <li>Sprachauswahl ist noch nicht vollständig funktionsfähig</li>
                <li>Benachrichtigungsfunktion ist in Entwicklung</li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#061B46] mb-4">Feedback & Kontakt</h2>
              <p className="text-slate-600 leading-8">
                Wenn Sie Barrieren auf dieser Website bemerken, kontaktieren Sie uns:<br />
                E-Mail: barrierefreiheit@magdeburg.de<br />
                Telefon: +49 (0) 391 540-0
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
