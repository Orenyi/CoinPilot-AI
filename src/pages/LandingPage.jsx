import React from "react";
import Hero from "../components/landing/Hero";
import MarketPreview from "../components/landing/MarketPreview";
import Features from "../components/landing/FeatureCard";
import CTA from "../components/landing/CTA";

const LandingPage = () => {
  return (
    <main>
      <Hero />
      <MarketPreview />
      <Features />
      <CTA />
    </main>
  );
};

export default LandingPage;
