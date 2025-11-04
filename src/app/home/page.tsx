"use client";

import SportsSection from "./container/SportsSection";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import HeroSection from "./container/HeroSection";
import LatestSection from "./container/LatestSection";
import HighlightSection from "./container/HighlightSection";
import PoliticsSection from "./container/PoliticsSection";
import Highlight2Section from "./container/Highlight2Section";
import FloatingAIButton from "./components/FloatingButton";
import EconomySection from "./container/EconomySection";
import { useEffect, useState } from "react";
import Loading from "../loading/page";
import LoadingScreen from "../components/LoadingScree";
import AnalyzerPromoModal from "../components/ModalAnalyzer";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasikan delay data loading (misal dari API)
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Navbar />
      <AnalyzerPromoModal />
      <main className="w-full mx-auto gap-6 pt-10">
        <HeroSection />
        <HighlightSection />
        <section className="px-16 py-6 bg-white">
          <PoliticsSection />
        </section>
        <section className="px-16 py-6 bg-[#BABABA]">
          <SportsSection />
        </section>
        <Highlight2Section />
        <section className="px-16 py-6 bg-yellow-50">
          <EconomySection />
        </section>
        <LatestSection />
      </main>
      <Footer />
      <FloatingAIButton />
    </>
  );
}
