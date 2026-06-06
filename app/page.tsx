import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import CitySnapshot from "@/components/home/CitySnapshot";

export default function Home() {
  return (
    <>
      {/* 1. Welcome / Hero */}
      <Hero />

      {/* 2. Plain-language city snapshot strip — replaces WeatherWidget */}
      <CitySnapshot />

      {/* 3. Feature cards — visible without scrolling */}
      <FeatureGrid />
    </>
  );
}
