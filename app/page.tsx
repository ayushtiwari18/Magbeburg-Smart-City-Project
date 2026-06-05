import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import WeatherWidget from "@/components/home/WeatherWidget";
import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <div>
      <main>
        <Hero />
        {/* Live weather strip below hero */}
        <section className="bg-white border-b border-slate-100 py-6">
          <Container>
            <div className="max-w-sm">
              <WeatherWidget />
            </div>
          </Container>
        </section>
        <FeatureGrid />
      </main>
    </div>
  );
}
