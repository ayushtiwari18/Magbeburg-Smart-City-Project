import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import WeatherWidget from "@/components/home/WeatherWidget";

export default function Home() {
  return (
    <main>
      {/* 1. Welcome / Hero */}
      <Hero />

      {/* 2. Live Weather — sits directly below the hero */}
      <WeatherWidget />

      {/* 3. Feature cards — perfectly centered, no overlap */}
      <FeatureGrid />
    </main>
  );
}
