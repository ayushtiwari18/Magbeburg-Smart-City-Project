import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import CitySnapshot from "@/components/home/CitySnapshot";
import WelcomeToast from "@/components/home/WelcomeToast";

export default function Home() {
  return (
    <>
      {/* Welcome toaster — appears once per session */}
      <WelcomeToast />

      {/* 1. Welcome / Hero */}
      <Hero />

      {/* 2. Plain-language city snapshot strip */}
      <CitySnapshot />

      {/* 3. Feature cards */}
      <FeatureGrid />
    </>
  );
}
